from app.api.get_email import get_email

from nltk.tokenize import word_tokenize,sent_tokenize
from nltk import pos_tag
from nltk.corpus import stopwords

import html2text

import spacy
from spacy import displacy
from collections import Counter
import en_core_web_sm

from pprint import pprint
import os

basedir=os.path.dirname(os.path.abspath(__file__))
nlp_model = os.path.join(basedir, 'data/nlp_model')



'''
def check_spacy_model():
    nlp = spacy.load('/nlp_model')
    nlp1 = spacy.load('en_core_web_sm')
    doc = nlp('Buy 5 INFY shares if the price is below 60 rs.')
    doc1 = nlp1('Buy 5 INFY shares if the price is below 60 rs.')
    pprint([(X.text, X.label_) for X in doc.ents])
    pprint([(X.text, X.label_) for X in doc1.ents])
    
    for X in doc.ents:
            if X.label_=='CARDINAL':
                no_of_shares = X.text
    for X in doc1.ents:        
            if X.label_=='MONEY':
                amount = X.text
                print(amount)
check_spacy_model()
'''
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
                company = value[0]

            elif value[1]=='NN':
                company = value[0]

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
                print(amount)
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
            cost_of_share = int(value[0])
    if cost_of_share =='':
        cost_of_share = "undefined"
    return cost_of_share


def fetch_order():
    order_list=[]
    inbox = get_email()
    for i in inbox:
        sent_list = split_into_sentence(i["Body"])
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

