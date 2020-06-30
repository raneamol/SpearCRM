from flask import Blueprint 

accounts = Blueprint('accounts',__name__)

from app.main.accounts import routes