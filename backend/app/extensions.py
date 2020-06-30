from flask_pymongo import pymongo

from os import environ

MONGO_URI = environ.get("MONGO_URI")
DB = environ.get("DB")

client = pymongo.MongoClient(MONGO_URI)
mongo = client.get_database('crm_db')