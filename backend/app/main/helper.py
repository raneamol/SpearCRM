'''This software is called SpearCRM and it is a customer relationship management software for stockbrokers.
Copyright (C) 2020  Amol Rane, Vedant Pimpley.
This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
'''
from app.api.get_email import get_email

from nltk.tokenize import word_tokenize,sent_tokenize
from nltk import pos_tag
from nltk.corpus import stopwords

import html2text

import spacy
from spacy import displacy
from collections import Counter
import en_core_web_sm

import os

import pandas as pd

from ..extensions import mongo

basedir=os.path.dirname(os.path.abspath(__file__))
nlp_model = os.path.join(basedir, 'data/nlp_model')
company_sec_id = os.path.join(basedir, 'data/company_id.csv')





def split_into_sentence(body):
    body = html2text.html2text(body)
    sent_list = sent_tokenize(body)
    return sent_list


def check_nlp(sent):
    #nltk part to get action and company
    ignorewords= ['dear', 'sir','stockbroker','mr','mr.','respected','price','cost','please','help','company','id.','id','\n','\r','rs','rupees','inr','rs.']
    question = ['?','is it possible',"how","what","why"]
    spacy_sent = sent
    spacy_sent = spacy_sent.lower()
    sentence = sent
    sentence = sentence.lower()

    data = pd.DataFrame(pd.read_csv(company_sec_id))
    
    if any(w in sentence for w in question)==True:
        return 0
    
    else:    
        sentence = word_tokenize(sentence)
        
        pos=pos_tag(sentence)
        
        tokens_without_sw = [word for word in pos if not word[0] in stopwords.words()]
        tokens_without_sw = [word for word in tokens_without_sw if not word[0].lower() in ignorewords]
        for value in tokens_without_sw:
            if value[0]=='buy' or value[0]=='purchase':
                action = 'buy'

            elif value[0]=='sell':
                action = value[0]

            elif value[1]=='JJ':
                c = value[0].upper()
                company_count=data['symbol'].eq(c).sum()
                if company_count>0:
                    company = c

            elif value[1]=='NN':
                c = value[0].upper()
                company_count=data['symbol'].eq(c).sum()
                if company_count>0:
                    company = c

        #spacy part to get amount and numvber of shares
        nlp = spacy.load(nlp_model)
        doc = nlp(spacy_sent)
        nlp1 = spacy.load('en_core_web_sm')
        doc1 = nlp1(spacy_sent)
        amount = ''
        for X in doc1.ents:
            if X.label_=='CARDINAL':
                no_of_shares = X.text
        for X in doc.ents:
            if X.label_=='MONEY':
                amount = X.text
        try:
            final_json = {
            "company":company,
            "action":action,
            "no_of_shares":int(no_of_shares),
            "amount":amount
            }
            return final_json
        except:
            return 0



def get_cost_from_text(s1):
    sentence1 = word_tokenize(s1)
    pos = pos_tag(sentence1)
    cost_of_share = ''
    if pos == []:
        cost_of_share = "undefined"
    for value in pos:
        if value[1] == 'CD':
            cost_of_share = float(value[0])
    if cost_of_share =='':
        cost_of_share = "undefined"
    return cost_of_share


def fetch_order(email_id,password):
    order_list=[]
    inbox = get_email(email_id,password)

    accounts = mongo.Accounts
    emails = accounts.find({},{"_id":0, "email" : 1})
    emails = list(emails)
    emails = [ i["email"] for i in emails ]
    emails = set(emails)

    for i in inbox:
        sent_list = split_into_sentence(i["Body"])
        n_email = i["From"].split('<')[1]
        n_email = n_email.split('>')[0]
        if n_email in emails:
            for j in sent_list:
                final =check_nlp(j)
                if final == 0:
                    continue
                else:
                    break
            if final != 0:
                email_id = (i["From"])
                final["From"] = email_id

                order_list.append(final)
    
    return order_list

