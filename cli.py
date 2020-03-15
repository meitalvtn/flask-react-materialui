from datetime import datetime
from config import config_add
import requests
import sys


def present_output(results):
    for k, v in results.items():
        if k == 'ended_details':
            continue
        print(f'   {k}: {v}')


# TODO: error handle the use of requests and catch input errors? type checks? etc
def main():

    if sys.argv[1] == "loan":
        try:
            amount = sys.argv[2]
            loan_currency = sys.argv[3]
        except IndexError as e:
            print('You must specify the loan amount and loan currency.')
            sys.exit(1)
        payload = {'amount': amount,
                   'loan_currency': loan_currency,
                   'created': datetime.now()
                   }
        # TODO: Catch exception?
        receipt = requests.post('http://localhost:5000/loan', params=payload)
        print('Loan Details:    ')
        present_output(receipt.json())

    elif sys.argv[1] == "end-loan":
        try:
            loan_id, paid_currency = sys.argv[2], sys.argv[3]
        except IndexError as e:
            print('You must specify the loan id and the loan currency.')
            sys.exit(1)
        payload = {'id': loan_id,
                   'ended': datetime.now(),
                   'paid_currency': paid_currency
                   }
        receipt = requests.put('http://localhost:5000/loan', params=payload)
        print("Loan end:")
        present_output(receipt.json()['ended_details'])
        print("Loan details:")
        present_output(receipt.json())

    elif sys.argv[1] == 'config':
        try:
            if sys.argv[2] == 'base-commission':
                new_base_commission = sys.argv[3]
                config_add('base-commission', new_base_commission)
                print(f'Base commission configured to {new_base_commission}')
        except IndexError as e:
            print('You must specify something to configure.')
            sys.exit(1)
    else:
        try:
            amount = sys.argv[1]
        except IndexError as e:
            print('Please supply arguments.')
            sys.exit(1)
        if len(sys.argv) == 4:
            to, base = sys.argv[3], sys.argv[2]
        else:
            to, base = sys.argv[2], 'ILS'
        print(amount, to, base)
        payload = {'amount': amount, 'to': to, 'base': base}
        receipt = requests.get('http://localhost:5000/exchange', params=payload)
        print('Exchange Receipt:')
        present_output(receipt.json())


# if __name__ is '__main__':
main()
