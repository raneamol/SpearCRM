'''This software is called SpearCRM and it is a customer relationship management software for stockbrokers.
Copyright (C) 2020  Amol Rane, Vedant Pimpley.
This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.\n
'''
from ..extensions import mongo

from app.main import main

from .helper import fetch_order

from os import environ

from cryptography.fernet import Fernet

@main.route('/homepage')
def homepage():
    abc = fetch_order()

    return str(abc)