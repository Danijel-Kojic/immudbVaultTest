# immudbVaultTest
Test project utilizing immudb Vault
This project is built using DRF (Django Restful Framework) for backend API server, and using React.js for frontend webpage.

# Backend server for REST API

## Starting the backend server
```bash
cd server
pipenv install
pipenv shell
python manage.py runserver 0.0.0.0:8000
```
It will start a backend API server on [localhost:8080](http://127.0.0.1:8000).

## OpenAPI v3 documentation
You can see the documentation of the APIs standarized with OpenAPI v3 specification on [localhost:8080/swagger](http://127.0.0.1:8000/swagger/).