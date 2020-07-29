'''This software is called SpearCRM and it is a customer relationship management software for stockbrokers.
Copyright (C) 2020  Amol Rane, Vedant Pimpley.
This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.\n
'''
from flask import jsonify, request, g

from bson.objectid import ObjectId

import json

import datetime

from datetime import timedelta

from ...extensions import mongo

from app.main.accounts import accounts

from ..helper import fetch_order, get_cost_from_text

from app.api.send_email import send_email

import re

from app.utils.auth import token_required

from cryptography.fernet import Fernet

from os import environ

def myconverter(o):
	if isinstance(o, datetime.datetime):
		return o.strftime('%Y-%m-%dT%H:%M:%S.%fZ')
	elif isinstance(o, ObjectId):
		return str(o)
	else:
		raise TypeError(o)

#RENAME TO show_all_accounts--- DONE
@accounts.route('/show_all_accounts')
@token_required
def show_all_accounts():
	accounts = mongo.Accounts
	current_user = g.current_user
	accounts_view = accounts.find({"user_id": str(current_user["_id"])}, {"_id" : 1, "name" : 1, "job_type" : 1, "company" : 1, "city" : 1, "email" : 1, "phone_number" : 1})
	accounts_view = list(accounts_view)
	accounts_view = json.dumps(accounts_view, default = myconverter)
	return accounts_view


@accounts.route('/display_account/<usr_id>')
@token_required
def display_account(usr_id):
	accounts = mongo.Accounts
	orders = mongo.Orders
	
	max_stage_order = orders.find({"account_id":usr_id}).sort("stage",-1).limit(1)

	order_count = orders.count_documents({"account_id":usr_id})
	if(order_count==0):
		accounts.update({"_id": ObjectId(usr_id)}, {"$set": {"latest_order_stage": 0}})
	else:
		accounts.update({"_id": ObjectId(usr_id)}, {"$set": {"latest_order_stage": max_stage_order[0]["stage"]}})
	
	account = accounts.find({"_id" : ObjectId(usr_id)})
	account = list(account)
	account = json.dumps(account[0], default=myconverter)



	return account


@accounts.route('/edit_account', methods = ['POST'])
@token_required
def edit_account():
	req_data = request.get_json()
	#JSON data into variables
	usr_id = req_data["_id"]
	usr_id = ObjectId(usr_id)
	city = req_data["city"]
	company = req_data["company"]
	contact_comm_type = req_data["contact_comm_type"]
	country = req_data["country"]
	demat_accno = req_data["demat_accno"]
	dob = req_data["dob"]
	dob = datetime.datetime.strptime(dob, '%Y-%m-%dT%H:%M:%S.%fZ')
	education = req_data["education"]
	email = req_data["email"]
	job_type = req_data["job_type"]
	last_contact = req_data["last_contact"]
	latest_order_stage = req_data["latest_order_stage"]
	marital_status = req_data["marital_status"]
	name = req_data["name"]
	phone_number = req_data["phone_number"]
	state = req_data["state"]
	trading_accno = req_data["trading_accno"]

	accounts = mongo.Accounts
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

#Change structure...?---DONE 
#RENAME complete_account_orders--- DONE
@accounts.route('/complete_account_orders',methods = ["POST"])
@token_required
def complete_account_orders():
	req_data = request.get_json()
	usr_id = req_data["account_id"]
	company = req_data["company"]
	
	orders = mongo.Orders
	accounts = mongo.Accounts
	activities = mongo.Activities

	all_orders= orders.find({"stage":3, "account_id": usr_id})
	all_orders = list(all_orders)
	activity_id = [i['activity_id'] for i in all_orders]
	activity_id = list(map(ObjectId,activity_id))


	account = accounts.find({"_id": ObjectId(usr_id)})
	account = list(account)


	orders_company = [i["company"].lower() for i in all_orders]
	orders_company = set(orders_company)
	company_keys = set(company)
	company_values = set(company.values())
	companies = orders_company.intersection(company_keys)

	if bool(companies) == False and bool(orders_company) == True:
		return "Send correct company"
	elif bool(companies) == False and bool(orders_company) == False:
		return "No companies to be transacted"
	else:
		#O(n)--> where n is the number of companies in stage 3, ie:better than number of orders
		for i in companies:
			a = re.compile(i, re.IGNORECASE)
			orders.update_many({"company": a, "stage":3},{"$set": {"cost_of_share": company[i]}})

		all_orders_new= orders.find({"stage":3})
		all_orders_new = list(all_orders_new)

		orders.update_many({"stage" : 3, 'account_id' : usr_id},{"$set": {"stage" : 0}})
		
		activities.update({"_id":{"$in": activity_id}},{"$set": {"activity_type": "past"}}, multi = True)

		all_orders_new = json.dumps(all_orders_new, default =myconverter)
		
		return all_orders_new


#Change structure... add commpany to post data?---DONE 
@accounts.route('/complete_all_orders', methods = ["POST"])
@token_required
def complete_all_orders():	
	accounts = mongo.Accounts
	orders = mongo.Orders
	activities = mongo.Activities
	req_data = request.get_json()
	company = req_data["company"]

	current_user = g.current_user

	all_accounts = accounts.find({"user_id": str(current_user["_id"])})
	all_accounts = list(all_accounts)
	account_id = [i['_id'] for i in all_accounts]
	account_id = list(map(str,account_id))
	all_orders= orders.find({"stage":3,"account_id":{"$in": account_id}})
	all_orders = list(all_orders)
	activity_id = [i['activity_id'] for i in all_orders]
	activity_id = list(map(ObjectId,activity_id))
	
	orders_company = [i["company"].lower() for i in all_orders]
	orders_company = set(orders_company)
	company_keys = set(company)
	company_values = set(company.values())
	companies = orders_company.intersection(company_keys)
	if bool(companies) == False and bool(orders_company) == True:
		return "Send correct company"
	elif bool(companies) == False and bool(orders_company) == False:
		return "No companies to be transacted"
	else:
		for i in companies:
			a = re.compile(i, re.IGNORECASE)
			orders.update_many({"company": a, "stage":3,"account_id": {"$in":account_id}},{"$set": {"cost_of_share": company[i]}})

		all_orders_new= orders.find({"stage":3})
		all_orders_new = list(all_orders_new)

		orders.update_many({"stage" : 3,"account_id": {"$in":account_id}},{"$set": {"stage" : 0}})
		
		activities.update({"_id":{"$in": activity_id}},{"$set": {"activity_type": "past"}}, multi = True)

		all_orders_new = json.dumps(all_orders_new, default =myconverter)

		return all_orders_new


@accounts.route('/send_email_after_transaction', methods = ["POST"])
@token_required
def send_email_after_transaction():
	accounts = mongo.Accounts
	all_orders = request.get_json()
	all_accounts = accounts.find({},{"_id":1,"name":1,"email": 1})
	all_accounts = list(all_accounts)
	accounts_id = [i['_id'] for i in all_accounts]
	all_accounts_id = list(map(str,accounts_id))
	all_accounts_id = set(all_accounts_id)

	current_user = g.current_user
	enc_email_pw = current_user["email_pw"]
	crypt_key = environ.get("crypt_key")
	cipher_key = crypt_key.encode('utf-8')
	cipher_suite = Fernet(cipher_key)
	enc_email_pw = enc_email_pw.encode('utf-8')
	email_pw = cipher_suite.decrypt(enc_email_pw)
	email_pw = email_pw.decode('utf-8')

	for i in all_orders:
		
		if i["account_id"] in all_accounts_id:
			abc = i["account_id"]		
			account = next((sub for sub in all_accounts if sub['_id'] == ObjectId(abc)), None)

		message = """\
Subject: Hi """+str(account["name"])+"""
Hi """+str(account["name"])+""",
Your order to """+str(i["trans_type"]) +""" """+str(i["no_of_shares"])+""" shares of """+str(i["company"])+"""\
for cost Rs."""+str(i["cost_of_share"])+""" has been transacted."""

		send_email(account["email"],message,current_user["username"],email_pw)
	
	return "Emails have been sent."




@accounts.route('/create_account', methods = ["POST"])
@token_required
def create_account():
	req_data = request.get_json()

	city = req_data["city"]
	company = req_data["company"]
	contact_comm_type = req_data["email"]
	country = req_data["country"]
	demat_accno = req_data["demat_accno"]
	dob = req_data["dob"]
	dob = datetime.datetime.strptime(dob, '%Y-%m-%dT%H:%M:%S.%fZ')
	education = req_data["education"]
	email = req_data["email"]
	job_type = req_data["job_type"]
	last_contact = req_data["last_contact"]
	last_contact = datetime.datetime.strptime(last_contact, '%Y-%m-%dT%H:%M:%S.%fZ')
	latest_order_stage = req_data["latest_order_stage"]
	marital_status = req_data["marital_status"]
	name = req_data["name"]
	phone_number = req_data["phone_number"]
	state = req_data["state"]
	trading_accno = req_data["trading_accno"]
	current_user = g.current_user

	accounts = mongo.Accounts

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
	"trading_accno": trading_accno,
	"user_id": str(current_user["_id"]) 
}
	accounts.insert_one(values)

	return "Account Created"


@accounts.route('/create_order',methods = ["POST"])
@token_required
def create_order():
	req_data = request.get_json()

	company = req_data["company"]
	no_of_shares = req_data["no_of_shares"]
	cost_of_share= req_data["cost_of_share"]
	stage = req_data["stage"]
	account_id = req_data["account_id"]
	trans_type = req_data["trans_type"]

	values = {
    "company" : company,
    "no_of_shares" : no_of_shares,
    "cost_of_share" : cost_of_share,
    "stage" : stage,
    "account_id" : account_id,
	"trans_type": trans_type,
	"creation_date":datetime.datetime.now()
}

	accounts = mongo.Accounts
	accounts.update({"_id": ObjectId(account_id)},{"$set" : {"latest_order_stage": 2}})

	orders = mongo.Orders
	orders.insert(values)

	return "Order Created"



@accounts.route('/display_account_orders/<usr_id>')
@token_required
def display_user_orders(usr_id):
	orders = mongo.Orders

	account_orders = orders.find({'account_id': usr_id})
	account_orders = list(account_orders)
	account_orders = json.dumps(account_orders, default=myconverter)

	return account_orders

#Change structure---DONE
@accounts.route('/order_stage_change',methods = ["POST"])
@token_required
def order_stage_change():
	req_data = request.get_json()
	_id = req_data["_id"]
	_id = ObjectId(_id)
	stage = req_data["stage"]
	company = req_data["company"]

	orders = mongo.Orders
	accounts = mongo.Accounts
	activities = mongo.Activities

	current_user = g.current_user

	enc_email_pw = current_user["email_pw"]
	crypt_key = environ.get("crypt_key")
	cipher_key = crypt_key.encode('utf-8')
	cipher_suite = Fernet(cipher_key)
	enc_email_pw = enc_email_pw.encode('utf-8')
	email_pw = cipher_suite.decrypt(enc_email_pw)
	email_pw = email_pw.decode('utf-8')

	order = orders.find_one({"_id":_id})
	order_company = order["company"].lower()
	account = accounts.find_one({"_id":ObjectId(order["account_id"])})


	if stage == 2:
		activities.update({"_id": ObjectId(order["activity_id"])},{"$set": {"activity_type": "past"}})
		orders.update({"_id":_id},{"$set": {"stage" : stage}})
		message = """\
Subject: Order Finalized
Hi """+str(account["name"])+""",
Your order to """+str(order["trans_type"]) +""" """+str(order["no_of_shares"])+""" shares of """+str(order["company"])+"""\
for cost """+str(order["cost_of_share"])+""" is finalized"""
	
		send_email(account["email"],message,current_user["username"],email_pw)

	
	elif stage == 3:
		orders.update({"_id":_id},{"$set": {"stage" : stage}})

		title = "Transact order for {}ing {} {} shares.".format(order["trans_type"],order["no_of_shares"],order["company"])
		body = "Transact order of {} to {} {} shares of {}. Desired Price:{}".format(account["name"],order["trans_type"],order["no_of_shares"],\
		order["company"],order["cost_of_share"])
		date = datetime.datetime.now() + timedelta(hours = 2)

		activities.insert({"title": title, "body": body, "date": date, "activity_type": "future", "customer_id": order["account_id"],\
		"elapsed":0, "ai_activity": 1})
		activity = activities.find({}).sort("_id",-1).limit(1)
		orders.update({"_id": _id},{"$set" : {"activity_id": str(activity[0]["_id"])}})
	
	elif stage == 0:
		orders.update({"_id":_id},{"$set": {"stage" : stage, "cost_of_share": company[order_company]}})
		activities.update({"_id": ObjectId(order["activity_id"])},{"$set": {"activity_type": "past"}})
		email_id = account["email"]
		message = """\
Subject: Order Transacted
Hi """+str(account["name"])+""",
Your order to """+str(order["trans_type"]) +""" """+str(order["no_of_shares"])+""" shares of """+str(order["company"])+\
""" has been transacted for Rs."""+str(order["cost_of_share"])
	
		send_email(email_id,message,current_user["username"],email_pw)
	
	else:
		print("Error in updating")	

	return "Order has been changed to stage {}".format(stage)



@accounts.route('/show_all_orders')
@token_required
def show_all_orders():
	orders = mongo.Orders

	accounts = mongo.Accounts

	current_user = g.current_user

	all_accounts = accounts.find({"user_id": str(current_user["_id"])},{"_id":1,"name":1})
	all_accounts = list(all_accounts)
	accounts_id = [i['_id'] for i in all_accounts]
	accounts_id = list(map(str,accounts_id))
	all_accounts_id = set(accounts_id)
	all_orders = orders.find({"account_id": {"$in": accounts_id}})
	all_orders = list(all_orders)

	for i in all_orders:
		if i["account_id"] in all_accounts_id:
			abc = i["account_id"]		
			account = next((sub for sub in all_accounts if sub['_id'] == ObjectId(abc)), None) 
			i["name"] = account["name"]	

	all_orders = json.dumps(all_orders, default =myconverter)

	return all_orders

@accounts.route('/show_all_companies')
def show_all_companies():
	orders = mongo.Orders

	accounts = mongo.Accounts


	all_accounts = accounts.find({},{"_id":1,"name":1})
	all_accounts = list(all_accounts)
	accounts_id = [i['_id'] for i in all_accounts]
	accounts_id = list(map(str,accounts_id))
	all_accounts_id = set(accounts_id)
	all_companies = orders.find({},{"company":1,"_id":0})
	all_companies = list(all_companies)

	all_companies = json.dumps(all_companies, default =myconverter)

	return all_companies


@accounts.route("/delete_order/<order_id>")
@token_required
def delete_order(order_id):

	orders = mongo.Orders
	order = orders.find({"_id":ObjectId(order_id)})
	activities = mongo.Activities

	order1 = orders.find({"$and": [ {"_id":ObjectId(order_id)}, {"activity_id":{"$exists":True}}]})
	order_count = order1.count()
	
	if(order_count==1):
		activities.delete_one({"_id": ObjectId(order[0]["activity_id"])})

	accounts = mongo.Accounts
	account_id = order[0]["account_id"]
	
	orders.delete_one({"_id" : ObjectId(order_id)})
	order_count = orders.count_documents({"account_id":account_id})
	
	return "Order Deleted"



@accounts.route('/create_activity',methods = ["POST"])
@token_required
def create_activity():
	req_data = request.get_json()
	title = req_data["title"]
	body = req_data["body"]
	date = req_data["date"]
	date = datetime.datetime.strptime(date, '%Y-%m-%dT%H:%M:%S.%fZ')
	activity_type = req_data["activity_type"]
	customer_id = req_data["user_id"]

	activities = mongo.Activities

	values = {
    "title" : title,
    "body" : body,
    "date" : date,
    "activity_type" : activity_type,
	"customer_id": customer_id,
	"elapsed": 0,
	"ai_activity": 0
}

	activities.insert(values)

	return "Values inserted"




@accounts.route('/show_user_activities/<usr_id>')
@token_required
def show_user_activities(usr_id):
	
	activities = mongo.Activities

	activities.update_many({"activity_type": "future", "date": { "$lte" : datetime.datetime.now()}},{ "$set": { "elapsed": 1 ,"activity_type": "past"}})

	account_activities = activities.find({'customer_id': usr_id})
	account_activities = list(account_activities)
	account_activities = json.dumps(account_activities, default=myconverter)

	return account_activities




@accounts.route('/show_all_activities')
@token_required
def show_all_activities():
	activities = mongo.Activities
	accounts = mongo.Accounts
	leads = mongo.Leads

	current_user = g.current_user
	all_accounts = accounts.find({"user_id": str(current_user["_id"])})
	all_accounts = list(all_accounts)
	accounts_id = [i['_id'] for i in all_accounts]
	accounts_id = list(map(str,accounts_id))

	all_leads = leads.find({"user_id": str(current_user["_id"])})
	all_leads = list(all_leads)
	leads_id = [i['_id'] for i in all_leads]
	leads_id = list(map(str,leads_id))

	users_id = accounts_id+leads_id

	activities.update_many({"activity_type": "future", "date": { "$lte" : datetime.datetime.now()}},{ "$set": { "elapsed": 1 ,"activity_type": "past"}})
	
	all_activities = activities.find({"customer_id":{"$in": users_id}})
	
	all_activities = list(all_activities)

	all_activities = json.dumps(all_activities, default=myconverter)

	return all_activities


#Change structure--add company to post
@accounts.route('/change_activity_type',methods = ["POST"])
@token_required
def change_activity_type():
	req_data = request.get_json()
	_id = req_data["_id"]
	activity_type = req_data["activity_type"]
	activities = mongo.Activities
	activity = activities.find_one({"_id":ObjectId(_id)})

	if activity["ai_activity"]==1:
		company = req_data["company"]

	activities = mongo.Activities
	orders = mongo.Orders
	accounts = mongo.Accounts
	activity = activities.find_one({"_id": ObjectId(_id)})

	current_user = g.current_user
	enc_email_pw = current_user["email_pw"]
	crypt_key = environ.get("crypt_key")
	cipher_key = crypt_key.encode('utf-8')
	cipher_suite = Fernet(cipher_key)
	enc_email_pw = enc_email_pw.encode('utf-8')
	email_pw = cipher_suite.decrypt(enc_email_pw)
	email_pw = email_pw.decode('utf-8')

	if activity["ai_activity"] == 1:
		order = orders.find_one({"activity_id": _id})
		order_company = order["company"].lower()
		
		
		if order["stage"] == 1:

			orders.update({"activity_id": _id},{"$set":{"stage": 2 }})
			activities.update({"_id": ObjectId(_id)},{"$set":{"activity_type":activity_type}})
			account = accounts.find_one({"_id": ObjectId(order["account_id"])})
			message = """\
Subject: Order Finalized
Hi """+str(account["name"])+""",
Your order to """+str(order["trans_type"]) +""" """+str(order["no_of_shares"])+""" shares of """+str(order["company"])+"""\
for cost """+str(order["cost_of_share"])+""" is finalized"""
			
			send_email(account["email"] ,message,current_user["username"],email_pw)

		elif order["stage"] == 3:
			orders.update({"activity_id": _id},{"$set":{"stage": 0 , "cost_of_share": company[order_company]}})
			order = orders.find_one({"activity_id":_id})
			activities.update({"_id": ObjectId(_id)},{"$set":{"activity_type":activity_type}})
			account = accounts.find_one({"_id": ObjectId(order["account_id"])})
			message = """\
Subject: Order Transacted
Hi """+str(account["name"])+""",
Your order to """+str(order["trans_type"]) +""" """+str(order["no_of_shares"])+""" shares of """+str(order["company"])+\
""" has been transacted for Rs."""+str(order["cost_of_share"])
			
			send_email(account["email"] ,message,current_user["username"],email_pw)
		
	
	else:
		activities.update({"_id": ObjectId(_id)},{"$set":{"activity_type":activity_type}})

	return "Activity updated"


#change structure--Partially dodne, but good enough
@accounts.route('/get_order_from_email')
@token_required
def get_order_from_email():

	current_user = g.current_user
	enc_email_pw = current_user["email_pw"]
	crypt_key = environ.get("crypt_key")
	cipher_key = crypt_key.encode('utf-8')
	cipher_suite = Fernet(cipher_key)
	enc_email_pw = enc_email_pw.encode('utf-8')
	email_pw = cipher_suite.decrypt(enc_email_pw)
	email_pw = email_pw.decode('utf-8')
	
	
	order_list = fetch_order(current_user["username"],email_pw)

	accounts = mongo.Accounts
	orders = mongo.Orders
	activities = mongo.Activities

	all_accounts = accounts.find({"user_id": str(current_user["_id"])},{"_id": 1, "name": 1, "email": 1})

	all_accounts = list(all_accounts)

	accounts_email = [i['email'] for i in all_accounts]

	accounts_email = set(accounts_email)

	if order_list == []:
		return "No new order"
	else:
		for i in order_list:
			n_email = i["From"]
			n_email = n_email.split('<')[1]
			email = n_email.split('>')[0]
			company = i["company"]
			action = i["action"]
			no_of_shares = i["no_of_shares"]
			amount = i["amount"]

			if email in accounts_email:
				abc = email		
				account = next((i for i in all_accounts if i["email"] == abc), None)

			if account is None:
				continue
			if amount == '':
				price = ' '
			else:
				price = amount
			title = "{} {} shares of {} for desired price:{}?".format(action.upper(),no_of_shares,company.upper(),price)
			body = "Finalize order of {} to {} {} shares of {}. Desired Price:{}".format(account["name"],action,no_of_shares,company.upper(),price)
			date = datetime.datetime.now() + timedelta(hours = 2)
			activities.insert({"title": title, "body": body, "date": date, "activity_type": "future", "customer_id": str(account["_id"]), "elapsed":0, "ai_activity": 1})
			activity = activities.find({}).sort("_id",-1).limit(1)
			orders.insert({ "company": company, "no_of_shares": no_of_shares, "cost_of_share": price, "stage": 1, "account_id":str(account["_id"]), "trans_type": action,\
			"activity_id": str(activity[0]["_id"]), "creation_date":datetime.datetime.now()})

		return "Inserted"



@accounts.route('/get_all_account_names')
@token_required
def get_all_account_names():
	accounts = mongo.Accounts
	current_user = g.current_user
	all_accounts = accounts.find({"user_id": str(current_user["_id"])},{"_id":1,"name":1})
	all_accounts = list(all_accounts)
	all_accounts = json.dumps(all_accounts, default =myconverter)

	return all_accounts

#RENAME get_line_graph_data--- DONE
@accounts.route('/get_line_graph_data')
@token_required
def get_line_graph_data():
	orders = mongo.Orders
	accounts = mongo.Accounts
	current_user = g.current_user
	all_accounts = accounts.find({"user_id": str(current_user["_id"])})
	all_accounts = list(all_accounts)
	accounts_id = [i['_id'] for i in all_accounts]
	accounts_id = list(map(str,accounts_id))
	order = orders.find({"stage" : 0, "account_id": {"$in": accounts_id}},{"creation_date": 1, "cost_of_share": 1, "no_of_shares": 1})
	order = list(order)
	final = []
	for i in order:
		i["month"] = i["creation_date"].month
		del i["creation_date"]
		del i["_id"]

	order = json.dumps(order, default = myconverter)
	return order


#change structure----DONE
@accounts.route('/top_accounts')
@token_required
def top_accounts():
	accounts = mongo.Accounts
	orders = mongo.Orders

	current_user = g.current_user

	all_accounts = accounts.find({"user_id": str(current_user["_id"])},{"_id":1,"name":1})
	all_accounts = list(all_accounts)
	accounts_id = [i['_id'] for i in all_accounts]
	accounts_id = list(map(str,accounts_id))
	all_accounts_id = set(accounts_id)
	
	try:
		order = orders.aggregate([{"$match": {"stage": 0}},{"$group":{"_id": "$account_id" ,\
		"count": {"$sum" : "$no_of_shares"},"acc_score": { "$sum": {"$multiply": ["$no_of_shares", "$cost_of_share"] }}}}])
	except:
		return ("Incorrect type of cost_of_share present in stage 0 orders.")
	order = list(order)
	order = sorted(order, key = lambda k:k['acc_score'], reverse = True)
	
	top_accounts=[]
	for i in order:
		if i["_id"] in all_accounts_id:
			abc = i["_id"]		
			account = next((sub for sub in all_accounts if sub['_id'] == ObjectId(abc)), None) 
			top_accounts.append({"_id": i["_id"],"name": account["name"],"acc_score":i["acc_score"]})

	
	top_accounts = top_accounts[:3]
	top_accounts = json.dumps(top_accounts, default = myconverter)
	return top_accounts


#RENAME get_pie_chart_data--- DONE
@accounts.route('/get_pie_chart_data')
@token_required
def get_pie_chart_data():
	accounts = mongo.Accounts
	orders = mongo.Orders

	current_user = g.current_user

	all_accounts = accounts.find({"user_id":str(current_user["_id"])})
	all_accounts = list(all_accounts)
	accounts_id = [i['_id'] for i in all_accounts]
	accounts_id = list(map(str,accounts_id))
	order = orders.find({"account_id":{"$in": accounts_id}},{"stage":1, "cost_of_share":1, "no_of_shares":1})
	order = list(order)

	order = json.dumps(order, default = myconverter)
	return order

#Change structure
@accounts.route('/convert_finalized_orders',methods=["POST"])
@token_required
def convert_finalized_orders():
	
	req_data = request.get_json()
	company = req_data["company"]

	accounts = mongo.Accounts
	orders = mongo.Orders
	activities = mongo.Activities

	current_user = g.current_user

	all_accounts = accounts.find({"user_id":str(current_user["_id"])})
	all_accounts = list(all_accounts)
	accounts_id = [i['_id'] for i in all_accounts]
	accounts_id = list(map(str,accounts_id))
	all_accounts_id = set(accounts_id)

	finalized_orders = orders.find({"stage": 2,"account_id":{"$in": accounts_id}}) #1
	finalized_orders = list(finalized_orders)

	order_ids = []
	values = []
	
	if finalized_orders != []:
		for i in finalized_orders:
			if i["account_id"] in all_accounts_id:
				abc = i["account_id"]
				account = next((sub for sub in all_accounts if sub['_id'] == ObjectId(abc)), None) 
				i["name"] = account["name"]

			order_company = i["company"].lower()
			action = i["trans_type"].lower()
			cost_of_share = get_cost_from_text(i["cost_of_share"])
			if cost_of_share == 'undefined':
				cost_of_share = company[order_company]

			if (action == 'buy' and cost_of_share >= company[order_company]) or (action == 'sell' and cost_of_share <= company[order_company]):
				order_ids.append(i["_id"])
				
				title = "Transact order for {}ing {} {} shares.".format(i["trans_type"],i["no_of_shares"],i["company"])
				body = "Transact order of {} to {} {} shares of {}. Desired Price:{}".format(i["name"],i["trans_type"],i["no_of_shares"],\
				i["company"],i["cost_of_share"])
				date = datetime.datetime.now() + timedelta(hours = 10)
				values.append({"title": title, "body":body, "date":date, "activity_type": "future",\
				"customer_id": i["account_id"], "elapsed":0, "ai_activity": 1})

		
		
		len_order_ids = len(order_ids)
		if len_order_ids > 0:
			activities.insert(values)
			inserted_activities = activities.find({}).sort("_id",-1).limit(len_order_ids)
			inserted_activities = list(inserted_activities)
			inserted_activities = inserted_activities[::-1]
			activity_id = [i["_id"] for i in inserted_activities]
			activity_id = list(map(str,activity_id))
			
			for i in range(len_order_ids):
				orders.update({"_id": order_ids[i]},{"$set":{"stage":3, "activity_id": activity_id[i]}})

	return "Success"


@accounts.route('/delete_activity/<activity_id>')
@token_required
def delete_activity(activity_id):
	activities = mongo.Activities
	orders = mongo.Orders
	accounts = mongo.accounts

	activity = activities.find_one({"_id": ObjectId(activity_id)})
	if activity["ai_activity"] == 0:
		activities.delete_one({"_id": ObjectId(activity_id)})

	elif activity["ai_activity"] == 1 and activity["activity_type"] == "future":
		order = orders.find_one({"activity_id": activity_id})
		account_id = order["account_id"]
		orders.delete_one({"activity_id": activity_id})
		activities.delete_one({"_id": ObjectId(activity_id)})
	return "activity deleted"

#RENAME TO get_account_turnover--- DONE
#function error
@accounts.route('get_account_turnover/<usr_id>')
@token_required
def get_account_turnover(usr_id):
	accounts = mongo.Accounts
	orders = mongo.Orders
	order = orders.aggregate([{"$match": {"stage": 0, "account_id": usr_id}},{"$group":{"_id": "$account_id",\
	"turnover": { "$sum": {"$multiply": ["$no_of_shares", "$cost_of_share"] }}}}])
	order = list(order)
	try:
		order[0].pop('_id',None)
	except:
		order = [{"turnover":0}]
	order = json.dumps(order[0], default = myconverter)
	return order
	