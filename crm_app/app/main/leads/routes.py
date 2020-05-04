from flask import jsonify, request

import json

from bson.objectid import ObjectId


import datetime

from ...extensions import mongo

from app.main.leads import leads

def myconverter(o):
	if isinstance(o, datetime.datetime):
		return o.strftime('%Y-%m-%dT%H:%M:%S.%fZ')
	elif isinstance(o, ObjectId):
		return str(o)
	else:
		raise TypeError(o)

@leads.route('/show_leads')
def show_leads():
	leads = mongo.db.Leads
	leads_view = leads.find({}, {"_id" : 1, "name" : 1, "job_type" : 1, "company" : 1, "city" : 1, "email" : 1, "phone_number" : 1})
	#dumps converts cursor to string json
	leads_view = list(leads_view)
	leads_view = json.dumps(leads_view, default =myconverter)
	return leads_view


@leads.route('/display_lead/<usr_id>')
def display_lead(usr_id):
	leads = mongo.db.Leads
	lead = leads.find({"_id" : ObjectId(usr_id)})
	
	lead = list(lead)
	lead = json.dumps(lead[0],default = myconverter)
	
	return lead

#edit lead details
@leads.route('/edit_lead', methods = ['POST'])
def edit_lead():
	req_data = request.get_json()

	#JSON data into variables
	usr_id = req_data["_id"]
	usr_id = ObjectId(usr_id)
	city = req_data["city"]
	company = req_data["company"]
	country = req_data["country"]
	dob = req_data["dob"]
	dob = datetime.datetime.strptime(dob, '%Y-%m-%dT%H:%M:%S.%fZ')
	#dob = new Date(dob)
	education = req_data["education"]
	email = req_data["email"]
	job_type = req_data["job_type"]
	lead_source = req_data["lead_source"]
	marital_status = req_data["marital_status"]
	name = req_data["name"]
	phone_number = req_data["phone_number"]
	state = req_data["state"]
	status = req_data["status"]

	leads = mongo.db.Leads
	lead = leads.find({"_id": usr_id})

	new_values = {"$set":{
	"city": city, 
	"company": company, 
	"country": country, 
	"dob": dob, 
	"education": education, 
	"email": email, 
	"job_type": job_type, 
	"lead_source": lead_source, 
	"marital_status": marital_status, 
	"name": name, 
	"phone_number": phone_number, 
	"state": state, 
	"status": status
}}

	x = leads.update({"_id": usr_id},new_values)
	return "Document has been updated"



@leads.route('/create_lead', methods = ["POST"])
def create_lead():
	req_data = request.get_json()

	#JSON data into variables

	city = req_data["city"]
	company = req_data["company"]
	country = req_data["country"]
	dob = req_data["dob"]
	dob = datetime.datetime.strptime(dob, '%Y-%m-%dT%H:%M:%S.%fZ')
	#dob = new Date(dob)
	education = req_data["education"]
	email = req_data["email"]
	job_type = req_data["job_type"]
	marital_status = req_data["marital_status"]
	name = req_data["name"]
	phone_number = req_data["phone_number"]
	state = req_data["state"]
	status = req_data["status"]
	lead_source = req_data["lead_source"]

	leads = mongo.db.Leads


	values = {
	"city": city, 
	"company": company, 
	"country": country, 
	"dob": dob, 
	"education": education, 
	"email": email, 
	"job_type": job_type, 
	"marital_status": marital_status, 
	"name": name, 
	"phone_number": phone_number, 
	"state": state, 
	"status": status,
    "lead_source":lead_source
}
	
	leads.insert_one(values)

	return "Lead Created"


@leads.route('lead_to_account', methods = ["POST"])
def lead_to_accounts():
	req_data = request.get_json()

	#get JSON variables
	usr_id = req_data["_id"]
	usr_id = ObjectId(usr_id)
	contact_comm_type = req_data["contact_comm_type"]
	demat_accno = req_data["demat_accno"]
	trading_accno = req_data["trading_accno"]
	latest_order_stage = req_data["latest_order_stage"]
	last_contact = req_data["last_contact"]
	last_contact = datetime.datetime.strptime(last_contact, '%Y-%m-%dT%H:%M:%S.%fZ')

	leads = mongo.db.Leads
	accounts = mongo.db.Accounts

	values = {
	"contact_comm_type" : contact_comm_type,
	"demat_accno": demat_accno,
	"trading_accno":trading_accno,
	"latest_order_stage":latest_order_stage,
	"last_contact":last_contact
}

	a = leads.aggregate([{"$match":{"_id":usr_id}}, {"$addFields" :{
	"contact_comm_type" : contact_comm_type,
	"demat_accno": demat_accno,
	"trading_accno":trading_accno,
	"latest_order_stage":latest_order_stage,
	"last_contact":last_contact
}}])
	a = list(a)
	b = a[0]
	b.pop("_id", None)
	b.pop("lead_source", None)
	b.pop("status", None)
	accounts.insert_one(b)
	leads.delete_one({"_id" : usr_id})
	return "Lead converted to account"






















'''Edit lead input type
{
  "_id": "5ea5614463e50fc607cf674d", 
  "city": "Kavaratti", 
  "company": "Montes Foundation", 
  "country": "India", 
  "dob": "1982-10-13 07:30:45.000Z", 
  "education": "high school", 
  "email": "orci.Ut.sagittis@porttitor.co.uk", 
  "job_type": "entrepreneur", 
  "lead_source": "data.api website", 
  "marital_status": "Divorced", 
  "name": "Igor Calderon", 
  "phone_number": "+91 0785668936", 
  "state": "Lakshadweep", 
  "status": "Uncontacted"
}'''

'''Create lead data type
{
  "city": "Mumbai", 
  "company": "Deloitte", 
  "country": "India", 
  "dob": "1982-10-13 07:30:45.000Z", 
  "education": "high school", 
  "email": "orci.Ut.sagittis@porttitor.co.uk", 
  "job_type": "services", 
  "lead_source": "data.api website", 
  "marital_status": "Single", 
  "name": "Vedant Pimpley", 
  "phone_number": "+91 0785668936", 
  "state": "Maharashtra", 
  "status": "Uncontacted"
}'''