import os
import json


def db_read():
    if not os.path.exists('data.json'):
        open('data.json', 'w').write('{}')
    return json.load(open('data.json'))


def db_add_loan(loan):
    loans = db_read()
    loans[loan['Loan id']] = loan
    with open('data.json', 'w') as file:
        json.dump(loans, file)


def db_end_loan(loan_id, transaction_details):
    loans = db_read()
    loans[loan_id].update(transaction_details)
    with open('data.json', 'w') as file:
        json.dump(loans, file)

    return loans[loan_id]