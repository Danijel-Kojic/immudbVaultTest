from django.urls import include, path
from rest_framework import routers
from . import views

urlpatterns = [
    path('withdraw', views.withdraw_from_account),
    path('deposit', views.deposit_to_account),
    path('transfer', views.transfer_money)
]