import os

from flask import Flask

from .extensions import mongo

from flask_pymongo import pymongo

from app.main import main

from app.main.accounts import accounts

from app.main.leads import leads

from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)    
    
    #register blueprints
    app.register_blueprint(main,url_prefix='/')
#   app.register_blueprint(api,url_prefix='/api')
    app.register_blueprint(accounts,url_prefix='/main')
    app.register_blueprint(leads,url_prefix='/main')

    return app