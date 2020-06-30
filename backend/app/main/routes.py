from ..extensions import mongo

from app.main import main

from .helper import fetch_order

from os import environ

from cryptography.fernet import Fernet

@main.route('/homepage')
def homepage():
    abc = fetch_order()

    return str(abc)