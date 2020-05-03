from flask import jsonify, request, Response

from bson.objectid import ObjectId

import json

import datetime

from ...extensions import mongo

from app.main.accounts import accounts



def myconverter(o):
	if isinstance(o, datetime.datetime):
		return o.strftime('%Y-%m-%dT%H:%M:%S.%fZ')
	elif isinstance(o, ObjectId):
		return str(o)
	else:
		raise TypeError(o)

@accounts.route('/show_accounts')
def show_accounts():
	accounts = mongo.db.Accounts
	accounts_view = accounts.find({}, {"_id" : 1, "name" : 1, "job_type" : 1, "company" : 1, "city" : 1, "email" : 1, "phone_number" : 1})
	accounts_view = list(accounts_view)
	#dumps converts cursor to string json
	accounts_view = json.dumps(accounts_view, default = myconverter)
	return accounts_view

#date changed
@accounts.route('/display_account/<usr_id>')
#5ea58fbc63e50fc607cf6a10
def display_account(usr_id):
	accounts = mongo.db.Accounts
	account = accounts.find({"_id" : ObjectId(usr_id)})
	account = list(account)
	orders = mongo.db.Orders
	account = json.dumps(account[0], default=myconverter)

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
	contact_comm_type = req_data["contact_comm_type"]
	country = req_data["country"]
	demat_accno = req_data["demat_accno"]
	dob = req_data["dob"]
	#dob = datetime.datetime.strptime(dob, "%Y-%m-%dT%H:%M:%S.000Z")
	#dob = new Date(dob)
	education = req_data["education"]
	email = req_data["email"]
	job_type = req_data["job_type"]
	last_contact = req_data["last_contact"]
	#last_contact = datetime.datetime.strptime(last_contact, "%Y-%m-%dT%H:%M:%S")
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
	
	orders.update_many({"stage" : 3, 'account_id' : usr_id},{"$set": {"stage" : 0}})




	accounts = mongo.db.Accounts

	max_stage_order = orders.find({"account_id":usr_id}).sort("stage",-1).limit(1)


	accounts.update({"_id": ObjectId(usr_id)}, { "$set": {"latest_order_stage": max_stage_order[0]["stage"]}})

	

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
	dob = datetime.datetime.strptime(dob, '%Y-%m-%dT%H:%M:%S.%fZ')
	#dob = new Date(dob)
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
	trans_type = req_data["trans_type"]


	values = {
    "company" : company,
    "no_of_shares" : no_of_shares,
    "cost_of_share" : cost_of_share,
    "stage" : stage,
    "account_id" : account_id,
	"trans_type": trans_type 
}

	orders = mongo.db.Orders
	orders.insert(values)

	return "Order Created"

#myconverter used
@accounts.route('/display_account_orders/<usr_id>')
def display_user_orders(usr_id):
	orders = mongo.db.Orders

	account_orders = orders.find({'account_id': usr_id})
	account_orders = list(account_orders)
	account_orders = json.dumps(account_orders, default=myconverter)

	return account_orders

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

#myconverter used
@accounts.route('/show_all_orders')
def show_all_orders():
	orders = mongo.db.Orders
	all_orders = orders.find()
	all_orders = list(all_orders)
	all_orders = json.dumps(all_orders, default =myconverter)

	return all_orders

@accounts.route("/delete_order/<order_id>")
def delete_order(order_id):
	orders = mongo.db.Orders
	orders.delete_one({"_id" : ObjectId(order_id)})
	return "Order Deleted"

@accounts.route('/create_activity',methods = ["POST"])
def create_activity():
	req_data = request.get_json()
	title = req_data["title"]
	body = req_data["body"]
	date = req_data["date"]
	date = datetime.datetime.strptime(date, '%Y-%m-%dT%H:%M:%S.%fZ')
	activity_type = req_data["activity_type"]
	user_id = req_data["user_id"]

	activities = mongo.db.Activities

	values = {
    "title" : title,
    "body" : body,
    "date" : date,
    "activity_type" : activity_type,
	"user_id": user_id,
	#new
	"elapsed": 0
}

	activities.insert(values)

	return "Values inserted"

#used myconverter
@accounts.route('/show_user_activities/<usr_id>')
def show_user_activities(usr_id):
	
	activities = mongo.db.Activities
	#dumps converts cursor to string json
	#loading string json to dictionary json
	#account_activities = json.loads(account_activities)

	#new
	print(datetime.datetime.now())
	activities.update_many({"activity_type": "future", "date": { "$lte" : datetime.datetime.now()}},{ "$set": { "elapsed": 1 ,"activity_type": "past"}})
	#new end

	account_activities = activities.find({'user_id': usr_id})
	account_activities = list(account_activities)
	account_activities = json.dumps(account_activities, default=myconverter)

	return account_activities




#used myconverter
@accounts.route('/show_all_activities')
def show_all_activities():
	activities = mongo.db.Activities

	activities.update_many({"activity_type": "future", "date": { "$lte" : datetime.datetime.now()}},{ "$set": { "elapsed": 1 ,"activity_type": "past"}})

	all_activities = activities.find()
	
	all_activities = list(all_activities)
	print(all_activities)
	all_activities = json.dumps(all_activities, default=myconverter)

	return all_activities

@accounts.route('/change_activity_type',methods = ["POST"])
def change_activity_type():
	req_data = request.get_json()
	_id = req_data["_id"]
	activity_type = req_data["activity_type"]
	activities = mongo.db.Activities


	activities.update({"_id": ObjectId(_id)},{"$set":{"activity_type":activity_type}})
	return "Activity updated"



'''Data for create activity
{
    "title" : "Finalize Mike's order",
    "body" : "Company-ABC and number of shares-200",
    "date" : "2020-05-18T16:00:00.000Z",
    "activity_type" : 1,
	"user_id" : "5ea51dfc0498e7340c7c7225"
}
'''

'''op for show user activities
{"_id": {"$oid": "5ea6130a9c1a7ee74956c18b"}, "title": "Finalize Mike's order", "body": "Company-ABC and number of
shares-200", "date": {"$date": 1589817600000}, "activity_type": "todos", "user_id": "5ea58fbc63e50fc607cf6a10", "elapsed": 0 }'''