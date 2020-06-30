from flask import jsonify, g, request

import json

from bson.objectid import ObjectId

import datetime

from ...extensions import mongo

from app.main.leads import leads

from app.utils.auth import token_required

def myconverter(o):
	if isinstance(o, datetime.datetime):
		return o.strftime('%Y-%m-%dT%H:%M:%S.%fZ')
	elif isinstance(o, ObjectId):
		return str(o)
	else:
		raise TypeError(o)


#RENAME TO show_all_leads--- DONE
@leads.route('/show_all_leads')
@token_required
def show_all_leads():
	leads = mongo.Leads
	current_user = g.current_user
	leads_view = leads.find({"user_id": str(current_user["_id"])}, {"_id" : 1, "name" : 1, "job_type" : 1, "company" : 1, "city" : 1, "email" : 1, "phone_number" : 1})
	#dumps converts cursor to string json
	leads_view = list(leads_view)
	leads_view = json.dumps(leads_view, default =myconverter)
	return leads_view


@leads.route('/display_lead/<usr_id>')
@token_required
def display_lead(usr_id):
	leads = mongo.Leads
	lead = leads.find({"_id" : ObjectId(usr_id)}, {"ml_fields": 0})
	lead = list(lead)
	lead = json.dumps(lead[0],default = myconverter)
	
	return lead


#edit lead details
@leads.route('/edit_lead', methods = ['POST'])
@token_required
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

	leads = mongo.Leads
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
@token_required
def create_lead():
	req_data = request.get_json()
	city = req_data["city"]
	company = req_data["company"]
	country = req_data["country"]
	dob = req_data["dob"]
	dob = datetime.datetime.strptime(dob, '%Y-%m-%dT%H:%M:%S.%fZ')
	education = req_data["education"]
	email = req_data["email"]
	job_type = req_data["job_type"]
	marital_status = req_data["marital_status"]
	name = req_data["name"]
	phone_number = req_data["phone_number"]
	state = req_data["state"]
	status = req_data["status"]
	lead_source = req_data["lead_source"]
	ml_doNotEmail = req_data["ml_doNotEmail"]
	ml_filledRegistrationForm = req_data["ml_filledRegistrationForm"]
	ml_fromWebsite = req_data["ml_fromWebsite"]
	ml_isBusy = req_data["ml_isBusy"] 
	ml_leadQualityUncertainty = req_data["ml_leadQualityUncertainty"]
	ml_phoneReachable = req_data["ml_phoneReachable"]
	ml_phoneReachableFrequently = req_data["ml_phoneReachableFrequently"]
	ml_poorLeadQuality = req_data["ml_poorLeadQuality"]
	ml_unemployed = req_data["ml_unemployed"]
	ml_willRevert = req_data["ml_willRevert"]

	current_user = g.current_user

	leads = mongo.Leads

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
    "lead_source":lead_source,
	"user_id":str(current_user["_id"]),
	"ml_fields" : {
        "const" : 1,
        "Do Not Email" : ml_doNotEmail,
        "Lead Origin_Lead Add Form" : ml_filledRegistrationForm,
        "Lead Source_Welingak Website" : ml_fromWebsite,
        "What is your current occupation_Unemployed" : ml_unemployed,
        "Tags_Busy" : ml_isBusy,
        "Tags_Closed by Horizzon" : 0,
        "Tags_Lost to EINS" : 0,
        "Tags_Ringing" : ml_phoneReachableFrequently,
        "Tags_Will revert after reading the email" : ml_willRevert,
        "Tags_switched off" : ml_phoneReachable,
        "Lead Quality_Not Sure" : ml_leadQualityUncertainty,
        "Lead Quality_Worst" : ml_poorLeadQuality,
        "Last Notable Activity_SMS Sent" : 0
    }
}
	
	leads.insert_one(values)

	return "Lead Created"

#RENAME TO convert_lead_to_account--- DONE
@leads.route('/convert_lead_to_account', methods = ["POST"])
@token_required
def convert_lead_to_accounts():
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

	leads = mongo.Leads
	accounts = mongo.Accounts

	activities = mongo.Activities

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
	b.pop("ml_fields", None)
	accounts.insert_one(b)
	account = accounts.find({}).sort("_id",-1).limit(1)
	
	activities.update_many({"user_id": str(usr_id)},{"$set": {"user_id": str(account[0]["_id"])} })
	leads.delete_one({"_id" : usr_id})
	#To send new account id, return new_acc_id
	new_account_id = str(account[0]["_id"])
	
	return new_account_id



@leads.route('/get_all_lead_names')
@token_required
def get_all_lead_names():
	leads = mongo.Leads
	current_user = g.current_user
	all_leads = leads.find({"user_id": str(current_user["_id"])},{"_id":1,"name":1})
	all_leads = list(all_leads)
	all_leads = json.dumps(all_leads, default =myconverter)

	return all_leads