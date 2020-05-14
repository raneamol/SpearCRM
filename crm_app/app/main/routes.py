#from flask import Blueprint

from ..extensions import mongo

from app.main import main

from .helper import fetch_order

#main = Blueprint('main',__name__)

@main.route('/homepage')
def homepage():
    abc = fetch_order()

    return str(abc)