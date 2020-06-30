from flask import request, make_response, jsonify

from ..extensions import mongo

from werkzeug.security import generate_password_hash, check_password_hash

import datetime

from app.main import main

from os import environ

import jwt

from cryptography.fernet import Fernet

@main.route('/user/login', methods = ["POST"])
def login():
    auth = request.get_json()
    username = auth["username"]
    password = auth["password"]

    if not auth or not username or not password:
        return make_response('Could not verify', 401, {'WWW-Authenticate' : 'Basic realm="Login required!"'})

    user = mongo.Users.find_one({'username': username}) 

    if not user:
        return make_response('Could not verify', 401, {'WWW-Authenticate' : 'Basic realm="Login required!"'})

    if check_password_hash(user["password"], password):
        token = jwt.encode({'user_id' : str(user["_id"]),'username' : user["username"],'email_pw': user["email_pw"],'first_name': user["first_name"],'last_name': user["last_name"],\
        'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}, environ.get("SECRET_KEY"))

        return jsonify({'token' : token.decode('UTF-8')})

    return make_response('Could not verify', 401, {'WWW-Authenticate' : 'Basic realm="Login required!"'})

@main.route('/user/register', methods=['POST'])
def register():
    
    first_name = request.get_json()['first_name']
    last_name = request.get_json()['last_name']
    email = request.get_json()['email']
    password = generate_password_hash(request.get_json()['password'], method = 'sha256')
    crypt_key = environ.get("crypt_key")
    cipher_key = crypt_key.encode('utf-8')
    cipher_suite = Fernet("cipher_key")
    email_pw = request.get_json()["email_pw"]
    email_pw = email_pw.encode('utf-8')
    email_pw = cipher_suite.encrypt(email_pw)
    email_pw = email_pw.decode('utf_8')
    created = datetime.datetime.utcnow()
	
    email_exist = mongo.Users.find_one({"username":email})
    if email_exist:
        return jsonify({'result': "Email already exists, please enter a new email"}),401
    else:
        result = {
        'first_name' : first_name,
        'last_name' : last_name,
        'username' : email,
        'password' : password,
        'created' : created,
        'email_pw' : email_pw
        }

        mongo.Users.insert(result)

        return jsonify({'result' : "User has been registered."})