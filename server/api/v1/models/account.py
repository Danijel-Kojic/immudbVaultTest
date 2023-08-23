import requests
import json
from django.db import models
from config.settings import IMMUDB_VAULT_API_KEY, IMMUDB_VAULT_LEDGER_NAME_IMMUBANK, IMMUDB_VAULT_COLLECTION_NAME_ACCOUNTS
from datetime import datetime

IMMUDB_COLLECTION_URL_PREFIX = "https://vault.immudb.io/ics/api/v1/ledger/" + IMMUDB_VAULT_LEDGER_NAME_IMMUBANK + "/collection/"
session = requests.session()
headers = {"Content-Type": "application/json", "X-API-Key": IMMUDB_VAULT_API_KEY, "Accept": "application/json"}

# Create your models here.
class BankAccountModel(models.Model):
    account_id = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    balance = models.PositiveBigIntegerField()
    created_at = models.DateTimeField()

    def __str__(self) -> str:
        return self.name

class BankAccount():
    account_id: str
    name: str
    email: str
    balance: float
    created_at: datetime
    def __init__(self, account_id: str, name: str, email: str, balance: float = 0, created_at: datetime = datetime.now()):
        self.account_id = account_id
        self.name = name
        self.email = email
        self.balance = balance
        self.created_at = created_at
    
    def __str__(self) -> str:
        return json.dumps({'account_id': self.account_id, 'name': self.name, 'email': self.email, 'balance': self.balance, 'created_at': self.created_at.strftime("%m/%d/%Y, %H:%M:%S")})

def delete_all_accounts() -> dict:
    """
    Delete accounts collection

    :return: dictionary object containing 'code' of operation result
    :rtype: dict
    """
    try:
        response = session.delete(IMMUDB_COLLECTION_URL_PREFIX + IMMUDB_VAULT_COLLECTION_NAME_ACCOUNTS, headers = headers)
        if 200 == response.status_code:
            return {'code': 200}
        return json.loads(response.text)
    except Exception as e:
        print(e)
        return None

def get_total_accounts() -> int:
    try:
        response = session.post(IMMUDB_COLLECTION_URL_PREFIX + IMMUDB_VAULT_COLLECTION_NAME_ACCOUNTS + "/documents/count", headers = headers, data = json.dumps({"query": {"limit": -1}}))
    except Exception as e:
        print(e)
        return 0
    resp_obj = json.loads(response.text)
    if 200 != resp_obj['code']:
        return 0
    if "count" in resp_obj:
        return resp_obj["count"]
    return 0

def get_all_accounts() -> list[BankAccount]:
    try:
        response = session.post(IMMUDB_COLLECTION_URL_PREFIX + IMMUDB_VAULT_COLLECTION_NAME_ACCOUNTS + "/documents/search",
                                headers = headers,
                                data = json.dumps({"page": 1, "perPage": 100}))
    except Exception as e:
        print(e)
        return 0
    accounts = []
    resp_obj = json.loads(response.text)
    if 'revisions' in resp_obj:
        for revision in resp_obj['revisions']:
            document = revision['document']
            account = BankAccount(
                account_id=document['_id'], 
                email=document['email'], 
                name=document['name'], 
                balance=document['balance'], 
                created_at=datetime.utcfromtimestamp(document['_vault_md']['ts']))
            accounts.append(account)
    return accounts

def is_account_collection_exist() -> bool:
    try:
        response = session.get(IMMUDB_COLLECTION_URL_PREFIX + IMMUDB_VAULT_COLLECTION_NAME_ACCOUNTS, headers = headers, data = json.dumps({"collections": [IMMUDB_VAULT_COLLECTION_NAME_ACCOUNTS]}))
        resp_obj = json.loads(response.text)
        if "idFieldName" in resp_obj:
            return True
    except Exception as e:
        print(e)
        return False
    return False

def create_account_collection() -> bool:
    try:
        data = json.dumps(
            {
                "idFieldName": "_id",
                "fields": [
                    {"name": "email", "type": "STRING"},
                    {"name": "name", "type": "STRING"},
                    {"name": "balance", "type": "DOUBLE"}],
                "indexes": [{"fields": ["email"], "isUnique": True}]
            }
        )
        response = session.put(IMMUDB_COLLECTION_URL_PREFIX + IMMUDB_VAULT_COLLECTION_NAME_ACCOUNTS, headers = headers, data = data)
        resp_obj = json.loads(response.text)
        if 200 == resp_obj["code"]:
            return True
        print(resp_obj)
    except Exception as e:
        print(e)
        return False
    
    return False

def create_account(data: dict) -> int|str:
    """
    Create a new bank account using given data, sets balance to 0

    :param dict data: The dictionary object contains "email" and "mail"
    :return: documentId if success, or the HTTP status code for failure
    :rtype: str|int
    """
    if not("email" in data and "name" in data):
        return 400
    if len(data["email"]) == 0 or len(data['name']) == 0:
        return 400

    data = {
        "email": data["email"],
        "name": data["name"],
        "balance": 0
    }
    try:
        response = session.put(IMMUDB_COLLECTION_URL_PREFIX + IMMUDB_VAULT_COLLECTION_NAME_ACCOUNTS + "/document", headers = headers, data=json.dumps(data))
        resp_obj = json.loads(response.text)
        if response.status_code == 200 and "documentId" in resp_obj:
            return resp_obj['documentId']
        return resp_obj['code']

    except Exception as e:
        print(e)
        return 502
    
def get_account_by_id(account_id: str) -> BankAccount | None:
    try:
        response = session.post(IMMUDB_COLLECTION_URL_PREFIX + IMMUDB_VAULT_COLLECTION_NAME_ACCOUNTS + "/document/" + account_id + "/audit",
                                headers = headers,
                                data=json.dumps({"desc": True, "page": 1, "perPage": 1}))
        resp_obj = json.loads(response.text)
        document = resp_obj['revisions'][0]['document']
        return BankAccount(
                account_id=document['_id'], 
                email=document['email'], 
                name=document['name'], 
                balance=document['balance'], 
                created_at=datetime.utcfromtimestamp(document['_vault_md']['ts']))
    except Exception as e:
        print(e)
        return None

def update_account_by_id(account_id: str, name: str) -> BankAccount | None:
    account = get_account_by_id(account_id=account_id)
    if None == account:
        return None
    try:
        req_body = {
            "document": {
                "email": account.email,
                "name": name,
                "balance": account.balance,
            },
            "query": {
                "expressions": [{
                    "fieldComparisons": [{
                        "field": "_id",
                        "operator": "EQ",
                        "value": account_id
                    }]
                }]
            }
        }
        response = session.post(IMMUDB_COLLECTION_URL_PREFIX + IMMUDB_VAULT_COLLECTION_NAME_ACCOUNTS + "/document",
                                headers = headers,
                                data=json.dumps(req_body))
        if 200 == response.status_code:
            resp_obj = json.loads(response.text)
            if 'documentId' in resp_obj and resp_obj['documentId'] == account_id:
                # Update success
                account.name = name
        return account
    except Exception as e:
        print(e)
        return None

def delete_account_by_id(account_id: str) -> bool:
    return False