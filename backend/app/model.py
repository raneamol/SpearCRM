from flask import Blueprint

from .extension import mongo

main = Blueprint('main',__name__)

@main.route('/')
def index():
    user_collection = mongo.leads
    user_collection.insert({})