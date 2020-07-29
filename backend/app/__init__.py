'''This software is called SpearCRM and it is a customer relationship management software for stockbrokers.
Copyright (C) 2020  Amol Rane, Vedant Pimpley.
This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.\n
'''
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