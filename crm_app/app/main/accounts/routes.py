from flask import jsonify, request, Response

from bson.objectid import ObjectId

import json

import datetime

from datetime import timedelta

from ...extensions import mongo

from app.main.accounts import accounts

from ..helper import fetch_order, get_cost_from_text

from app.api.send_email import send_email

from app.api.get_stock_price import get_stock_price


def myconverter(o):
	if isinstance(o, datetime.datetime):
		return o.strftime('%Y-%m-%dT%H:%M:%S.%fZ')
	elif isinstance(o, ObjectId):
		return str(o)
	else:
		raise TypeError(o)

#RENAME TO show_all_accounts--- DONE
@accounts.route('/show_all_accounts')
def show_all_accounts():
	accounts = mongo.db.Accounts
	accounts_view = accounts.find({}, {"_id" : 1, "name" : 1, "job_type" : 1, "company" : 1, "city" : 1, "email" : 1, "phone_number" : 1})
	accounts_view = list(accounts_view)
	accounts_view = json.dumps(accounts_view, default = myconverter)
	return accounts_view


@accounts.route('/display_account/<usr_id>')
def display_account(usr_id):
	accounts = mongo.db.Accounts
	account = accounts.find({"_id" : ObjectId(usr_id)})
	account = list(account)
	orders = mongo.db.Orders
	account = json.dumps(account[0], default=myconverter)

	return account


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
	dob = datetime.datetime.strptime(dob, '%Y-%m-%dT%H:%M:%S.%fZ')
	education = req_data["education"]
	email = req_data["email"]
	job_type = req_data["job_type"]
	last_contact = req_data["last_contact"]
	#last_contact = datetime.datetime.strptime(last_contact, "%Y-%m-%dT%H:%M:%S.%fZ")
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


#RENAME complete_account_orders--- DONE
@accounts.route('/complete_account_orders',methods = ["POST"])
def complete_account_orders():
	req_data = request.get_json()
	usr_id = req_data["account_id"]
	

	orders = mongo.db.Orders
	accounts = mongo.db.Accounts

	account_orders = orders.find({'account_id': usr_id})
	
	order = orders.find({"stage":3, "account_id": usr_id})
	order = list(order)
	orders.update_many({"stage" : 3, 'account_id' : usr_id},{"$set": {"stage" : 0}})

	for i in order:
		
		activities = mongo.db.Activities
		activities.update({"_id":ObjectId(i["activity_id"]) },{ "$set": {"activity_type": "past"}})
		try:
			current_price = get_stock_price(i["company"])
		except:
			current_price = 0.0
		orders.update({"_id":i["_id"]},{"$set": {"cost_of_share": current_price}})
		account = accounts.find_one({"_id": ObjectId(i["account_id"])})

		message = """\
Subject: Hi """+str(account["name"])+"""
Hi """+str(account["name"])+""",
Your order to """+str(i["trans_type"]) +""" """+str(i["no_of_shares"])+""" shares of """+str(i["company"])+"""\
for cost Rs."""+str(current_price)+""" has been transacted."""

		send_email(account["email"],message)

	max_stage_order = orders.find({"account_id":usr_id}).sort("stage",-1).limit(1)

	accounts.update({"_id": ObjectId(usr_id)}, { "$set": {"latest_order_stage": max_stage_order[0]["stage"]}})
	
	return "All transacted orders of account have been archived"


@accounts.route('/complete_all_orders')
def complete_all_orders():	
	accounts = mongo.db.Accounts
	orders = mongo.db.Orders
	activities = mongo.db.Activities	
	account_of_orders= orders.find({"stage":3},{"account_id": 1})
	account_ids = list(account_of_orders)
	
	orders.update_many({"stage" : 3},{"$set": {"stage" : 0}})
	for i in account_ids:
		max_stage_order = orders.find({"account_id":i["account_id"]}).sort("stage",-1).limit(1)
		accounts.update({"_id": ObjectId(i["account_id"])}, { "$set": {"latest_order_stage": max_stage_order[0]["stage"]}})
		account = accounts.find_one({"_id": ObjectId(i["account_id"])})
		
		order = orders.find_one({"_id": i["_id"]})
		
		try:
			current_price = get_stock_price(order["company"])
		except:
			current_price = 0.0
		
		orders.update({"_id":i["_id"]},{"$set": {"cost_of_share": current_price}})
		activities.update({"_id": ObjectId(order["activity_id"])},{"$set": {"activity_type": "past"}})

		message = """\
Subject: Hi """+str(account["name"])+"""
Hi """+str(account["name"])+""",
Your order to """+str(order["trans_type"]) +""" """+str(order["no_of_shares"])+""" shares of """+str(order["company"])+"""\
for cost Rs."""+str(current_price)+""" has been transacted."""

		send_email(account["email"],message)

	return "All transacted orders have been archived"


@accounts.route('/create_account', methods = ["POST"])
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
	"trans_type": trans_type,
	"creation_date":datetime.datetime.now()
}

	accounts = mongo.db.Accounts
	accounts.update({"_id": ObjectId(account_id)},{"$set" : {"latest_order_stage": 2}})

	orders = mongo.db.Orders
	orders.insert(values)

	return "Order Created"



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
	accounts = mongo.db.Accounts
	order = orders.find_one({"_id":_id})
	account = accounts.find_one({"_id":ObjectId(order["account_id"])})
	activities = mongo.db.Activities

	if stage == 2:
		activities.update({"_id": ObjectId(order["activity_id"])},{"$set": {"activity_type": "past"}})
		orders.update({"_id":_id},{"$set": {"stage" : stage}})
		message = """\
Subject: Order Finalized
Hi """+str(account["name"])+""",
Your order to """+str(order["trans_type"]) +""" """+str(order["no_of_shares"])+""" shares of """+str(order["company"])+"""\
for cost """+str(order["cost_of_share"])+""" is finalized"""
	
		send_email(account["email"],message)

	
	elif stage == 3:
		orders.update({"_id":_id},{"$set": {"stage" : stage}})

		title = "Transact order for {}ing {} {} shares.".format(order["trans_type"],order["no_of_shares"],order["company"])
		body = "Transact order of {} to {} {} shares of {}. Price:{}".format(account["name"],order["trans_type"],order["no_of_shares"],\
		order["company"],order["cost_of_share"])
		date = datetime.datetime.now() + timedelta(hours = 2)

		activities.insert({"title": title, "body": body, "date": date, "activity_type": "future", "user_id": order["account_id"],\
		"elapsed":0, "ai_activity": 1})
		activity = activities.find({}).sort("_id",-1).limit(1)
		orders.update({"_id": _id},{"$set" : {"activity_id": str(activity[0]["_id"])}})
	
	elif stage == 0:
		try:
			current_price = get_stock_price(order["company"])
		except:
			current_price = 0.0
		orders.update({"_id":_id},{"$set": {"stage" : stage, "cost_of_share": current_price}})
		activities.update({"_id": ObjectId(order["activity_id"])},{"$set": {"activity_type": "past"}})
		email_id = account["email"]
		message = """\
Subject: Order Transacted
Hi """+str(account["name"])+""",
Your order to """+str(order["trans_type"]) +""" """+str(order["no_of_shares"])+""" shares of """+str(order["company"])+\
""" has been transacted for Rs."""+str(order["cost_of_share"])
	
		send_email(email_id,message)
	
	else:
		print("Error in updating")	

	max_stage_order = orders.find({"account_id":order["account_id"]}).sort("stage",-1).limit(1)

	accounts.update({"_id": ObjectId(order["account_id"])}, { "$set": {"latest_order_stage": max_stage_order[0]["stage"]}})

	return "Order has been changed to stage {}".format(stage)



@accounts.route('/show_all_orders')
def show_all_orders():
	orders = mongo.db.Orders

	accounts = mongo.db.Accounts

	all_orders = orders.find()

	all_orders = list(all_orders)
	for i in all_orders:
		account_name = accounts.find_one({"_id":ObjectId(i["account_id"])},{"name" :1})
		i["name"] = account_name["name"]

	all_orders = json.dumps(all_orders, default =myconverter)

	return all_orders

'''
#RENAME check_share_price_and_update_order
@accounts.route('/convert_and_get_orders')
def convert_and_get_orders():
	orders = mongo.db.Orders

	accounts = mongo.db.Accounts

	activities = mongo.db.Activities

	all_orders = orders.find()

	finalized_orders = orders.find({"stage": 2}) 
	finalized_orders = list(finalized_orders)

	for i in finalized_orders:
		
		current_price = get_stock_price(i["company"])
		cost_of_share = get_cost_from_text(i["cost_of_share"])
		if cost_of_share == 'undefined':
			cost_of_share = current_price		
		action = i["trans_type"].lower()
		account = accounts.find_one({"_id":ObjectId(i["account_id"])})

		if (action == 'buy' and cost_of_share >= current_price) or (action == 'sell' and cost_of_share <= current_price):
			orders.update({"_id": i["_id"]},{"$set":{"stage": 3}})
			title = "Transact order for {}ing {} {} shares.".format(i["trans_type"],i["no_of_shares"],i["company"])
			body = "Transact order of {} to {} {} shares of {}. Price:{}".format(account["name"],i["trans_type"],i["no_of_shares"],\
			i["company"],cost_of_share)
			date = datetime.datetime.now() + timedelta(hours = 2)

			activities.insert({"title": title, "body": body, "date": date, "activity_type": "future", "user_id": i["account_id"],\
			"elapsed":0, "ai_activity": 1})
			activity = activities.find({}).sort("_id",-1).limit(1)
			orders.update({"_id": i["_id"]},{"$set" : {"activity_id": str(activity[0]["_id"])}})
			
		max_stage_order = orders.find({"account_id":i["account_id"]}).sort("stage",-1).limit(1)
		accounts.update({"_id": ObjectId(i["account_id"])}, { "$set": {"latest_order_stage": max_stage_order[0]["stage"]}})

	all_orders = list(all_orders)

	for i in all_orders:
		account_name = accounts.find_one({"_id":ObjectId(i["account_id"])},{"name" :1})
		i["name"] = account_name["name"]

	all_orders = json.dumps(all_orders, default =myconverter)

	return all_orders
'''


@accounts.route("/delete_order/<order_id>")
def delete_order(order_id):

	orders = mongo.db.Orders
	order = orders.find({"_id":ObjectId(order_id)})
	activities = mongo.db.Activities

	order1 = orders.find({"$and": [ {"_id":ObjectId(order_id)}, {"activity_id":{"$exists":True}}]})
	order_count = order1.count()
	
	if(order_count==1):
		activities.delete_one({"_id": ObjectId(order[0]["activity_id"])})

	accounts = mongo.db.Accounts
	account_id = order[0]["account_id"]
	
	orders.delete_one({"_id" : ObjectId(order_id)})
	order_count = orders.count_documents({"account_id":account_id})
	max_stage_order = orders.find({"account_id":account_id}).sort("stage",-1).limit(1)
	
	if(order_count==0):
		accounts.update({"_id": ObjectId(account_id)}, {"$set": {"latest_order_stage": 0}})
	else:
		accounts.update({"_id": ObjectId(account_id)}, {"$set": {"latest_order_stage": max_stage_order[0]["stage"]}})

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
	"elapsed": 0,
	"ai_activity": 0
}

	activities.insert(values)

	return "Values inserted"




@accounts.route('/show_user_activities/<usr_id>')
def show_user_activities(usr_id):
	
	activities = mongo.db.Activities

	activities.update_many({"activity_type": "future", "date": { "$lte" : datetime.datetime.now()}},{ "$set": { "elapsed": 1 ,"activity_type": "past"}})

	account_activities = activities.find({'user_id': usr_id})
	account_activities = list(account_activities)
	account_activities = json.dumps(account_activities, default=myconverter)

	return account_activities




@accounts.route('/show_all_activities')
def show_all_activities():
	activities = mongo.db.Activities

	activities.update_many({"activity_type": "future", "date": { "$lte" : datetime.datetime.now()}},{ "$set": { "elapsed": 1 ,"activity_type": "past"}})

	all_activities = activities.find()
	
	all_activities = list(all_activities)

	all_activities = json.dumps(all_activities, default=myconverter)

	return all_activities



@accounts.route('/change_activity_type',methods = ["POST"])
def change_activity_type():
	req_data = request.get_json()
	_id = req_data["_id"]
	activity_type = req_data["activity_type"]
	activities = mongo.db.Activities
	orders = mongo.db.Orders
	accounts = mongo.db.Accounts
	activity = activities.find_one({"_id": ObjectId(_id)})

	if activity["ai_activity"] == 1:
		order = orders.find_one({"activity_id": _id})
		
		if order["stage"] == 1:

			orders.update({"activity_id": _id},{"$set":{"stage": 2 }})
			activities.update({"_id": ObjectId(_id)},{"$set":{"activity_type":activity_type}})
			account = accounts.find_one({"_id": ObjectId(order["account_id"])})
			message = """\
Subject: Order Finalized
Hi """+str(account["name"])+""",
Your order to """+str(order["trans_type"]) +""" """+str(order["no_of_shares"])+""" shares of """+str(order["company"])+"""\
for cost """+str(order["cost_of_share"])+""" is finalized"""
			
			send_email(account["email"] ,message)

		elif order["stage"] == 3:
			try:
				current_price = get_stock_price(order["company"])
			except:
				current_price = 0.0
			orders.update({"activity_id": _id},{"$set":{"stage": 0 , "cost_of_share": current_price}})
			order = orders.find_one({"activity_id":_id})
			activities.update({"_id": ObjectId(_id)},{"$set":{"activity_type":activity_type}})
			account = accounts.find_one({"_id": ObjectId(order["account_id"])})
			message = """\
Subject: Order Transacted
Hi """+str(account["name"])+""",
Your order to """+str(order["trans_type"]) +""" """+str(order["no_of_shares"])+""" shares of """+str(order["company"])+\
""" has been transacted for Rs."""+str(order["cost_of_share"])
			
			send_email(account["email"] ,message)
		
		max_stage_order = orders.find({"account_id": order["account_id"]}).sort("stage",-1).limit(1)

		accounts.update({"_id": ObjectId(order["account_id"])}, { "$set": {"latest_order_stage": max_stage_order[0]["stage"]}})
	
	else:
		activities.update({"_id": ObjectId(_id)},{"$set":{"activity_type":activity_type}})

	return "Activity updated"


@accounts.route('/get_order_from_email')
def get_order_from_email():
	order_list = fetch_order()
	print(order_list)
	if order_list == []:
		return "No new order"
	else:
	#if not any(d["From"] == email_id for d in order_list):
		for i in order_list:
			n_email = i["From"]
			n_email = n_email.split('<')[1]
			email = n_email.split('>')[0]
			print(email)
			company = i["company"]
			action = i["action"]
			no_of_shares = i["no_of_shares"]
			amount = i["amount"]

			accounts = mongo.db.Accounts
			orders = mongo.db.Orders
			activities = mongo.db.Activities
			
			account = accounts.find_one({"email":email},{"_id": 1, "name": 1})
			if account is None:
				continue
			if amount == '':
				price = ' '
			else:
				price = amount
			title = "{} {} shares of {} for price:{}?".format(action.upper(),no_of_shares,company.upper(),price)
			print(account["name"])
			body = "Finalize order of {} to {} {} shares of {}. Price:{}".format(account["name"],action,no_of_shares,company.upper(),price)
			date = datetime.datetime.now() + timedelta(hours = 2)
			max_stage_order = orders.find({"account_id":str(account["_id"])}).sort("stage",-1).limit(1)

			accounts.update({"_id": account["_id"]}, { "$set": {"latest_order_stage": max_stage_order[0]["stage"]}})
			activities.insert({"title": title, "body": body, "date": date, "activity_type": "future", "user_id": str(account["_id"]), "elapsed":0, "ai_activity": 1})
			activity = activities.find({}).sort("_id",-1).limit(1)
			orders.insert({ "company": company, "no_of_shares": no_of_shares, "cost_of_share": price, "stage": 1, "account_id":str(account["_id"]), "trans_type": action, "activity_id": str(activity[0]["_id"]), "creation_date":datetime.datetime.now()})

		return "Inserted"



@accounts.route('/get_all_account_names')
def get_all_account_names():
	accounts = mongo.db.Accounts

	all_accounts = accounts.find({},{"_id":1,"name":1})
	all_accounts = list(all_accounts)
	all_accounts = json.dumps(all_accounts, default =myconverter)

	return all_accounts

#RENAME get_line_graph_data--- DONE
@accounts.route('/get_line_graph_data')
def get_line_graph_data():
	orders = mongo.db.Orders
	order = orders.find({"stage" : 0},{"creation_date": 1, "cost_of_share": 1, "no_of_shares": 1})
	order = list(order)
	final = []
	for i in order:
		i["month"] = i["creation_date"].month
		del i["creation_date"]
		del i["_id"]

	order = json.dumps(order, default = myconverter)
	return order


@accounts.route('/top_accounts')
def top_accounts():
	accounts = mongo.db.Accounts
	orders = mongo.db.Orders
	
	order = orders.aggregate([{"$match": {"stage": 0}},{"$group":{"_id": "$account_id" ,"count": {"$sum" : "$no_of_shares"},"acc_score": { "$sum": {"$multiply": ["$no_of_shares", "$cost_of_share"] }}}}])
	order = list(order)
	order = sorted(order, key = lambda k:k['acc_score'], reverse = True)

	for i in order:
		account = accounts.find_one({"_id": ObjectId(i["_id"])})
		i["name"] = account["name"]
	
	order = json.dumps(order, default = myconverter)
	return order

#RENAME get_pie_chart_data--- DONE
@accounts.route('/get_pie_chart_data')
def get_pie_chart_data():
	accounts = mongo.db.Accounts
	orders = mongo.db.Orders
	order = orders.find({},{"stage":1, "cost_of_share":1, "no_of_shares":1})
	order = list(order)

	order = json.dumps(order, default = myconverter)
	return order


@accounts.route('/convert_finalized_orders')
def convert_finalized_orders():
	accounts = mongo.db.Accounts
	orders = mongo.db.Orders
	activities = mongo.db.Activities

	finalized_orders = orders.find({"stage": 2}) 
	finalized_orders = list(finalized_orders)
	
	for i in finalized_orders:
		#get realtime stock price
		current_price = get_stock_price(i["company"])
		cost_of_share = get_cost_from_text(i["cost_of_share"])
		
		#check order cost with realtime stock price
		if cost_of_share == 'undefined':
			cost_of_share = current_price
		action = i["trans_type"].lower()
		account = accounts.find_one({"_id":ObjectId(i["account_id"])})

		if (action == 'buy' and cost_of_share >= current_price) or (action == 'sell' and cost_of_share <= current_price):
			orders.update({"_id": i["_id"]},{"$set":{"stage": 3}})
			title = "Transact order for {}ing {} {} shares.".format(i["trans_type"],i["no_of_shares"],i["company"])
			body = "Transact order of {} to {} {} shares of {}. Price:{}".format(account["name"],i["trans_type"],i["no_of_shares"],\
			i["company"],cost_of_share)
			date = datetime.datetime.now() + timedelta(hours = 2)

			activities.insert({"title": title, "body": body, "date": date, "activity_type": "future", "user_id": i["account_id"],\
			"elapsed":0, "ai_activity": 1})
			activity = activities.find({}).sort("_id",-1).limit(1)
			orders.update({"_id": i["_id"]},{"$set" : {"activity_id": str(activity[0]["_id"])}})
			
		max_stage_order = orders.find({"account_id":i["account_id"]}).sort("stage",-1).limit(1)
		accounts.update({"_id": ObjectId(i["account_id"])}, { "$set": {"latest_order_stage": max_stage_order[0]["stage"]}})

	return "Success"


@accounts.route('/delete_activity/<activity_id>')
def delete_activity(activity_id):
	activities = mongo.db.Activities
	orders = mongo.db.Orders
	accounts = mongo.db.accounts

	activity = activities.find_one({"_id": ObjectId(activity_id)})
	if activity["ai_activity"] == 0:
		activities.delete_one({"_id": ObjectId(activity_id)})

	elif activity["ai_activity"] == 1 and activity["activity_type"] == "future":
		order = orders.find_one({"activity_id": activity_id})
		account_id = order["account_id"]
		orders.delete_one({"activity_id": activity_id})
		activities.delete_one({"_id": ObjectId(activity_id)})
		max_stage_order = orders.find({"account_id":account_id}).sort("stage",-1).limit(1)

		accounts.update({"_id": ObjectId(account_id)}, { "$set": {"latest_order_stage": max_stage_order[0]["stage"]}})
	return "activity deleted"

#RENAME TO get_account_turnover--- DONE
@accounts.route('get_account_turnover/<usr_id>')
def get_account_turnover(usr_id):
	accounts = mongo.db.Accounts
	orders = mongo.db.Orders
	order = orders.aggregate([{"$match": {"stage": 0, "account_id": usr_id}},{"$group":{"_id": "$account_id",\
	"turnover": { "$sum": {"$multiply": ["$no_of_shares", "$cost_of_share"] }}}}])
	order = list(order)
	order[0].pop('_id',None)

	order = json.dumps(order[0], default = myconverter)
	return order
	
