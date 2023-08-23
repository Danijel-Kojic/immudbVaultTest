from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets, status
from .. import models

@api_view(['POST'])
def withdraw_from_account(request) -> Response:
    if not('account_id' in request.data and 'amount' in request.data):
        return Response(status = status.HTTP_400_BAD_REQUEST)
    account_id = request.data['account_id']
    amount = float(request.data['amount'])
    if len(account_id) == 0 or 0 == amount:
        return Response(status = status.HTTP_400_BAD_REQUEST)
    if models.withdraw_from_account(account_id=account_id, amount=amount):
        return Response(status = status.HTTP_200_OK)
    else:
        return Response(status = status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def deposit_to_account(request) -> Response:
    if not('account_id' in request.data and 'amount' in request.data):
        return Response(status = status.HTTP_400_BAD_REQUEST)
    account_id = request.data['account_id']
    amount = float(request.data['amount'])
    if len(account_id) == 0 or 0 == amount:
        return Response(status = status.HTTP_400_BAD_REQUEST)
    if models.deposit_to_account(account_id=account_id, amount=amount):
        return Response(status = status.HTTP_200_OK)
    else:
        return Response(status = status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def transfer_money(request) -> Response:
    if not('account_id_from' in request.data and 'account_id_to' in request.data and 'amount' in request.data):
        return Response(status = status.HTTP_400_BAD_REQUEST)
    account_id_from = request.data['account_id_from']
    account_id_to = request.data['account_id_to']
    amount = float(request.data['amount'])
    if len(account_id_from) == 0 or len(account_id_to) == 0 or 0 == amount:
        return Response(status = status.HTTP_400_BAD_REQUEST)
    if models.transfer_money(account_id_from=account_id_from, account_id_to=account_id_to, amount=amount):
        return Response(status = status.HTTP_200_OK)
    else:
        return Response(status = status.HTTP_400_BAD_REQUEST)
