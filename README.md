# immudbVaultTest

## Overview
Test project utilizing immudb Vault

This project is built using DRF (Django Restful Framework) for backend API server, and using React.js for frontend webpage.

The default credential for login is admin:123456.
After login, the administrator is able to add/update a bank account and withdraw/deposit/transfer money between the accounts.

Account informations including email, name and balance are saved in immudb Vault.

I intended to use 2 different collections for account and transaction, but unfortunately I can use only one default collection in a free plan.

## Backend server for REST API

### Starting the backend server
```bash
cd server
pipenv install
pipenv shell
python manage.py runserver 0.0.0.0:8000
```
It will start a backend API server on [localhost:8080](http://127.0.0.1:8000).

### OpenAPI v3 documentation
You can see the documentation of the APIs standarized with OpenAPI v3 specification on [localhost:8080/swagger](http://127.0.0.1:8000/swagger/).

## Frontend page for admininstrator

### Starting the frontend server
```bash
cd client
npm install
npm start
```