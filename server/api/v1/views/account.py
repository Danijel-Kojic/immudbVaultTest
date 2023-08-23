from rest_framework import serializers
from rest_framework import status
from ..serializers import BankAccountSerializer
from ..models.account import BankAccount, BankAccountModel, delete_all_accounts, is_account_collection_exist, create_account_collection, create_account, get_all_accounts, get_account_by_id, update_account_by_id, delete_account_by_id
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import Http404
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema


class BankAccountListView(APIView):
    """
    API endpoint that allows bank accounts to be viewed or created.
    """
    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT, 
        properties={
            'email': openapi.Schema(type=openapi.TYPE_STRING, description='The email of a new bank account'),
            'name': openapi.Schema(type=openapi.TYPE_STRING, description='The name of a new bank account'),
        }
    ))
    def post(self, request):
        """
        API endpoint to create a new bank account
        """
        is_account_exist = is_account_collection_exist()
        if False == is_account_exist:
            create_account_collection()
        created_result = create_account(request.data)
        if isinstance(created_result, int):
            # if 400 == created_result:
            #     return Response(status=status.HTTP_400_BAD_REQUEST)
            # if 409 == created_result:
            #     return Response(status=status.HTTP_409_CONFLICT)
            # if 502 == created_result:
            #     return Response(status=status.HTTP_502_BAD_GATEWAY)
            # if 500 == created_result:
            #     return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response(status=created_result)
        elif isinstance(created_result, str):
            account = BankAccount(account_id=created_result, email=request.data['email'], name=request.data['name'])
            account_serial = BankAccountSerializer(account)
            return Response(status=status.HTTP_201_CREATED, data=account_serial.data)

    def get(self, request):
        """
        API endpoint to retrieve all of the bank accounts
        """
        accounts = get_all_accounts()
        # if there is something in accounts else raise error
        if accounts:
            serializer = BankAccountSerializer(accounts, many=True)
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def delete(self, request):
        """
        API endpoint to drop the bank accounts collection
        """
        result = delete_all_accounts()
        if None == result:
            return Response(status=status.HTTP_502_BAD_GATEWAY)
        if 'code' in result:
            if 200 == result['code']:
                return Response(status=status.HTTP_204_NO_CONTENT)
            return Response(status=result['code'])
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class BankAccountDetailView(APIView):
    """
    API endpoint that allows individual bank account to be viewed or edited or deleted.
    """

    def get(self, request, pk):
        """
        Return a bank account given by account_id
        """
        # checking for the parameters from the URL
        account = get_account_by_id(pk)
        if None == account:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = BankAccountSerializer(account)
        return Response(serializer.data)

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT, 
        properties={
            'name': openapi.Schema(type=openapi.TYPE_STRING, description='The new name of a bank account'),
        }
    ))
    def patch(self, request, pk):
        """
        Update name of bank account
        """
        if not 'name' in request.data:
            return Response(status=status.HTTP_400_BAD_REQUEST) 
        name = request.data['name']
        if len(name) == 0:
            return Response(status=status.HTTP_400_BAD_REQUEST) 
        account = update_account_by_id(pk, name)
        if None == account:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = BankAccountSerializer(account)
        return Response(serializer.data)
        
    def delete(self, request, pk):
        """
        Delete a bank account given by account_id
        """
        del_result = delete_account_by_id(pk)
        if True == del_result:
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
