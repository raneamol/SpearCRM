#from flask import Blueprint

from ..extensions import mongo

from app.main import main

#main = Blueprint('main',__name__)

@main.route('/homepage')
def homepage():
    return '<h1>You are on the hopepage!!!<h1>'