from app import app
from flask import jsonify, request
from db import db_read
import ExchangeManager
import datetime


@app.route('/')
def index():
    return 'Welcome to Allenby Exchange and Co!'


@app.route('/exchange', methods=['GET'])
def get_cash_exchange():
    params = request.args
    amount, to, base = params['amount'], params['to'], params['base']
    receipt = ExchangeManager.generate_exchange_receipt(amount, to, base)
    return jsonify(receipt)


@app.route('/loans', methods=['GET'])
def loans():
    return jsonify(db_read())


@app.route('/loan', methods=['POST'])
def add_loan():
    params = request.args
    amount, loan_currency, created = params['amount'], params['loan_currency'], params['created']
    new_loan = ExchangeManager.generate_new_loan(amount, loan_currency, created)
    return jsonify(new_loan)


@app.route('/loan', methods=['PUT'])
def end_loan():
    params = request.args
    ExchangeManager.end_loan(params['id'], params['ended'], params['paid_currency'])
    return jsonify(db_read()[params['id']])
