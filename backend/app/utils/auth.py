'''This software is called SpearCRM and it is a customer relationship management software for stockbrokers.
Copyright (C) 2020  Amol Rane, Vedant Pimpley.
This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
'''
from flask import request, g, jsonify

import jwt

import datetime

from ..extensions import mongo

from functools import wraps

from os import environ

from base64 import b64decode

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            auth = auth_header.split(maxsplit=2)
            token = b64token = None
            if len(auth) > 1 and auth[0].lower() == 'bearer':
                b64token = auth[1]
                try:
                    token = b64decode(b64token)
                except ValueError:
                    pass

        if not b64token:
            return jsonify({'message' : 'Token is missing!'}), 401
        try: 
            data = jwt.decode(b64token, environ.get('SECRET_KEY'))
            current_user = mongo.Users.find_one({'username': data['username']})
            if current_user:
                g.current_user = current_user
            else:
                return jsonify({'message' : 'Not a valid user, Invalid token!'}), 401
        except:
            return jsonify({'message' : 'Token is invalid!'}), 401

        return f(*args, **kwargs)

    return decorated

