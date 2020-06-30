import os

import numpy as np

import pandas as pd

import pickle

from flask import Flask, request, jsonify, render_template, g

from app.main.leads import leads

import json

import datetime

from bson.objectid import ObjectId

from app.utils.auth import token_required

from ...extensions import mongo

def myconverter(o):
	if isinstance(o, datetime.datetime):
		return o.strftime('%Y-%m-%dT%H:%M:%S.%fZ')
	elif isinstance(o, ObjectId):
		return str(o)
	else:
		raise TypeError(o)


basedir=os.path.dirname(os.path.abspath(__file__))
fullpath = os.path.join(basedir, 'data/model.pkl')


@leads.route('/top_leads')
@token_required
def leads_top():

    leads = mongo.Leads
    
    current_user = g.current_user

    lead_names = leads.find({"user_id":str(current_user["_id"])},{"name":1,"_id": 1})
    lead_names = list(lead_names)
    names = pd.DataFrame(lead_names)
    ml_data = []
    lead_ml_data = leads.find({"user_id":str(current_user["_id"])},{"ml_fields": 1})
    lead_ml_data = list(lead_ml_data)
    for i in  lead_ml_data:
        del i["_id"]
        ml_data.append(i["ml_fields"])
    
    ml_data = pd.DataFrame(ml_data)


    model = pickle.load(open(fullpath, 'rb'))

    
    #Making predictions
    pred = model.predict(ml_data)

    #Multiply score by 100
    final_pred = pred*100
    final_pred = final_pred.rename("lead_score")

    #Merge name and score
    final = pd.concat([names, final_pred], axis=1)

    #Sort with descending values of score
    final = final.sort_values('lead_score',ascending=False)
    
    #Send top 3 values and names
    final = final.head(3)

    #COnvert df to json 
    final = final.T.to_dict().values()
    final = list(final)
    final = json.dumps(final, default = myconverter)

    #returning the predictions as json    
    return final

