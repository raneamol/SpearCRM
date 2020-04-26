from flask import jsonify, request

from bson.json_util import dumps

from bson.objectid import ObjectId

import json

import datetime

from ...extensions import mongo

from app.main.accounts import accounts

@accounts.route('/show_accounts')
def show_accounts():
	accounts = mongo.db.Accounts
	accounts_view = accounts.find({}, {"_id" : 1, "name" : 1, "job_type" : 1, "company" : 1, "city" : 1, "email" : 1, "phone_number" : 1})
	#dumps converts cursor to string json

	accounts_view = dumps(accounts_view)
	return accounts_view

@accounts.route('/display_account/<usr_id>')
def display_account(usr_id):
	accounts = mongo.db.Accounts
	account = accounts.find_one({"_id" : ObjectId(usr_id)})
	
	orders = mongo.db.Orders
	account_orders = orders.find({'account_id': account["_id"]})
	
	#dumps converts cursor to string json
	account_orders = dumps(account_orders)
	#loading string json to dictionary json
	account_orders = json.loads(account_orders)
	
	account = dumps(account)
	account= json.loads(account)
	
	account["orders"] =account_orders
	return account


#edit account details
@accounts.route('/edit_account', methods = ['POST'])
def edit_account():
	req_data = request.get_json()

	#JSON data into variables
	usr_id = req_data["_id"]
	usr_id = ObjectId(usr_id)
	city = req_data["city"]
	company = req_data["company"]
	contact_comm_type = req_data["email"]
	country = req_data["country"]
	demat_accno = req_data["demat_accno"]
	dob = req_data["dob"]
	dob = datetime.datetime.strptime(dob, '%Y-%m-%d %H:%M:%S.%fZ')
	#dob = new Date(dob)
	education = req_data["education"]
	email = req_data["email"]
	job_type = req_data["job_type"]
	last_contact = req_data["last_contact"]
	last_contact = datetime.datetime.strptime(last_contact, '%Y-%m-%d %H:%M:%S.%fZ')
	latest_order_stage = req_data["latest_order_stage"]
	marital_status = req_data["marital_status"]
	name = req_data["name"]
	phone_number = req_data["phone_number"]
	state = req_data["state"]
	trading_accno = req_data["trading_accno"]

	accounts = mongo.db.Accounts
	account = accounts.find({"_id": usr_id})

	new_values = {"$set":{
	"city": city, 
	"company": company, 
	"contact_comm_type": contact_comm_type, 
	"country": country, 
	"demat_accno": demat_accno, 
	"dob": dob, 
	"education": education, 
	"email": email, 
	"job_type": job_type, 
	"last_contact": last_contact, 
	"latest_order_stage": latest_order_stage, 
	"marital_status": marital_status, 
	"name": name, 
	"phone_number": phone_number, 
	"state": state, 
	"trading_accno": trading_accno
}}

	x = accounts.update({"_id": usr_id},new_values)
	return "Document has been updated"


@accounts.route('/complete_orders',methods = ["POST"])
def complete_orders():
	req_data = request.get_json()
	usr_id = req_data["account_id"]
	#latest_order_stage = req_data["latest_order_stage"]
	

	orders = mongo.db.Orders
	account_orders = orders.find({'account_id': usr_id})
	
	orders.update_many({"stage" : 3, 'account_id' : usr_id},{"$set": {"stage" : 4}})

	return "All transacted orders have been archived"


@accounts.route('/create_account', methods = ["POST"])
def create_account():
	req_data = request.get_json()

	#JSON data into variables

	city = req_data["city"]
	company = req_data["company"]
	contact_comm_type = req_data["email"]
	country = req_data["country"]
	demat_accno = req_data["demat_accno"]
	dob = req_data["dob"]
	dob = datetime.datetime.strptime(dob, '%Y-%m-%d %H:%M:%S.%fZ')
	#dob = new Date(dob)
	education = req_data["education"]
	email = req_data["email"]
	job_type = req_data["job_type"]
	last_contact = req_data["last_contact"]
	last_contact = datetime.datetime.strptime(last_contact, '%Y-%m-%d %H:%M:%S.%fZ')
	latest_order_stage = req_data["latest_order_stage"]
	marital_status = req_data["marital_status"]
	name = req_data["name"]
	phone_number = req_data["phone_number"]
	state = req_data["state"]
	trading_accno = req_data["trading_accno"]

	accounts = mongo.db.Accounts


	values = {
	"city": city, 
	"company": company, 
	"contact_comm_type": contact_comm_type, 
	"country": country, 
	"demat_accno": demat_accno, 
	"dob": dob, 
	"education": education, 
	"email": email, 
	"job_type": job_type, 
	"last_contact": last_contact, 
	"latest_order_stage": latest_order_stage, 
	"marital_status": marital_status, 
	"name": name, 
	"phone_number": phone_number, 
	"state": state, 
	"trading_accno": trading_accno
}
	
	accounts.insert_one(values)

	return "Account Created"

@accounts.route('/create_order',methods = ["POST"])
def create_order():
	req_data = request.get_json()

	company = req_data["company"]
	no_of_shares = req_data["no_of_shares"]
	cost_of_share= req_data["cost_of_share"]
	stage = req_data["stage"]
	account_id = req_data["account_id"]

	values = {
    "company" : company,
    "no_of_shares" : no_of_shares,
    "cost_of_share" : cost_of_share,
    "stage" : stage,
    "account_id" : account_id
}

	orders = mongo.db.Orders
	orders.insert(values)
	return "Order Created"



@accounts.route('/order_stage_change',methods = ["POST"])
def order_stage_change():
	req_data = request.get_json()
	_id = req_data["_id"]
	_id = ObjectId(_id)
	stage = req_data["stage"]

	orders = mongo.db.Orders

	orders.update({"_id":_id},{"$set": {"stage" : stage}})

	accounts = mongo.db.Accounts
	order = orders.find_one({"_id":_id})

	max_stage_order = orders.find({"_id":_id}).sort("stage",-1).limit(1)


	accounts.update({"_id": ObjectId(order["account_id"])}, { "$set": {"latest_order_stage": max_stage_order[0]["stage"]}})

	return "Order has been changed to stage {}".format(stage)



