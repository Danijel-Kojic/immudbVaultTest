import requests
import json
from django.db import models
from config.settings import IMMUDB_VAULT_API_KEY, IMMUDB_VAULT_LEDGER_NAME_IMMUBANK, IMMUDB_VAULT_COLLECTION_NAME_ACCOUNTS
from datetime import datetime
from .account import get_account_by_id, update_balance_by_id

IMMUDB_COLLECTION_URL_PREFIX = "https://vault.immudb.io/ics/api/v1/ledger/" + IMMUDB_VAULT_LEDGER_NAME_IMMUBANK + "/collection/"
session = requests.session()
headers = {"Content-Type": "application/json", "X-API-Key": IMMUDB_VAULT_API_KEY, "Accept": "application/json"}

def deposit_to_account(account_id: str, amount: float) -> bool:
    account = get_account_by_id(account_id)
    if None == account:
        return False
    if None == update_balance_by_id(account_id=account_id, balance=account.balance + amount):
        return False
    # TODO: Add transaction history to 'transaction' collection, requires a paid plan for multiple collections
    return True

def withdraw_from_account(account_id: str, amount: float) -> bool:
    account = get_account_by_id(account_id)
    if None == account:
        return False
    if amount > account.balance:
        return False
    if None == update_balance_by_id(account_id=account_id, balance=account.balance - amount):
        return False
    # TODO: Add transaction history to 'transaction' collection, requires a paid plan for multiple collections
    return True

def transfer_money(account_id_from: str, account_id_to: str, amount: float) -> bool:
    account_from = get_account_by_id(account_id_from)
    if None == account_from:
        return False
    account_to = get_account_by_id(account_id_to)
    if None == account_to:
        return False
    if amount > account_from.balance:
        return False
    if None == update_balance_by_id(account_id=account_id_from, balance=account_from.balance - amount):
        return False
    if None == update_balance_by_id(account_id=account_id_to, balance=account_to.balance + amount):
        return False
    # TODO: Add transaction history to 'transaction' collection, requires a paid plan for multiple collections
    return True
