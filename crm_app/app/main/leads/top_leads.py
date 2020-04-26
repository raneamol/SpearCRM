import os

import numpy as np

import pandas as pd

import pickle

from flask import Flask, request, jsonify, render_template

from app.main.leads import leads

basedir=os.path.dirname(os.path.abspath(__file__))
fullpath = os.path.join(basedir, 'data/model.pkl')
fullpath1 = os.path.join(basedir, 'data/Leads_info.csv')
name = os.path.join(basedir, 'data/names.csv')


@leads.route('/top_leads')
def leads_top():
    model = pickle.load(open(fullpath, 'rb'))
    
    #Get data from Post request
    #data = request.get_json()
    
    #Make prediction
    df = pd.DataFrame(pd.read_csv(fullpath1))
    
    #Making predictions
    pred = model.predict(df)

    #Multiply score by 100
    final_pred = pred*100
    final_pred = final_pred.rename("lead_score")

    #Importing names dataset
    names = pd.DataFrame(pd.read_csv(name))

    #Merge name and score
    final = pd.concat([names, final_pred], axis=1)

    #Sort with descending values of score
    final = final.sort_values('lead_score',ascending=False)
    
    #Send top 3 values and names
    final = final.head(3)
    
    #COnvert df to json 
    a = final.to_json(orient = 'records')
    
    #returning the predictions as json    
    return a
