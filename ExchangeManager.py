import requests
from datetime import datetime
from config import config_read
from db import db_read, db_add_loan, db_end_loan

# Local DB

DAILY_COMMISSION = 0.005

def get_next_id():
    return len(db_read())


def get_base_commission():
    return float(config_read()['base-commission'])


def get_exchange_rate(to, base):
    try:
        resp = requests.get(f'https://api.exchangeratesapi.io/latest?symbols={to}&base={base}')
        if resp.status_code == 400:
            print(resp.content.decode())
            raise RuntimeError('Could not fetch exchange rates with the data supplied.')
    except requests.exceptions.RequestException as e:
        print(e)
        raise RuntimeError('Error fetching request.')
    return resp.json()['rates'][to]


def generate_exchange_receipt(amount, to, base):
    commission = get_base_commission()
    rate = get_exchange_rate(to, base)
    amount_before_commission = rate * float(amount)
    final_amount = amount_before_commission * (1 - float(commission))
    return {
        'From Amount': float(amount),
        'From Currency': base,
        'To Currency': to,
        'Commission': float(commission),
        'Amount Before Commission': round(amount_before_commission, 2),
        'Amount': round(final_amount, 2),
    }


def generate_new_loan(amount, base, created):
    commission = get_base_commission()
    new_loan = {
        'Loan Amount': float(amount),
        'Loan Currency': base,
        'Commission': commission,
        'Daily Commission': DAILY_COMMISSION,
        'Loan Start': created,
        'Loan id': get_next_id(),
        'ended_details': None
    }
    db_add_loan(new_loan)
    return new_loan


def get_total_commission(loan_data, ended):
    created_datetime = datetime.strptime(loan_data['Loan Start'], '%d-%m-%Y')
    ended_datetime = datetime.strptime(ended, '%d-%m-%Y')
    delta_days = (ended_datetime - created_datetime).days
    return loan_data['Commission'] + (delta_days * loan_data['Daily Commission'])


def get_paid_amount_before_commission(loan, paid_currency):
    rate = get_exchange_rate(paid_currency, loan['Loan Currency'])

    return loan['Loan Amount'] * rate


def get_total_owed(paid_amount_before_commission, total_commission):
    return paid_amount_before_commission * (1 + total_commission)


# TODO: Is this a right way to error handle?
def end_loan(loan_id, ended, paid_currency):
    try:
        loan = db_read()[loan_id]
    except KeyError as e:
        raise RuntimeError(f'Error: a loan with id {loan_id} does not exist.')

    if loan['ended_details']:
        raise RuntimeError('Error: this loan has already been ended.')

    total_commission = get_total_commission(loan, ended)
    paid_amount_before_commission = round(get_paid_amount_before_commission(loan, paid_currency), 2)
    paid_amount = round(get_total_owed(paid_amount_before_commission, total_commission), 2)

    return db_end_loan(loan_id, {'ended_details': {
                'Paid Currency': paid_currency,
                'Total Commission': total_commission,
                'Paid Amount Before Commission': paid_amount_before_commission,
                'Paid Amount': paid_amount,
                'Loan End': ended
            }})

