from app.api.get_email import get_email

from nltk.tokenize import word_tokenize,sent_tokenize
from nltk import pos_tag
from nltk.corpus import stopwords

import html2text

import spacy
from spacy import displacy
from collections import Counter
import en_core_web_sm
nlp = en_core_web_sm.load()





def split_into_sentence(body):
    body = html2text.html2text(body)
    sent_list = sent_tokenize(body)
    return sent_list

def check_nlp(sent):
    #nltk part to get action and company
    ignorewords= ['dear', 'sir','stockbroker','mr','mr.','respected','please','help','company','id.','id','\n','\r']
    question = ['?','is it possible',"how","what","why"]
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
            if value[0]=='buy':
                action = value[0]

            elif value[0]=='sell':
                action = value[0]

            elif value[1]=='NN':
                company = value[0]

        #spacy part to get amount and numvber of shares
        nlp = en_core_web_sm.load()
        doc = nlp(sent)
        amount = ''
        for X in doc.ents:
            if X.label_=='CARDINAL':
                no_of_shares = X.text
            elif X.label_=='MONEY':
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
        #print(order_list)
    return order_list

