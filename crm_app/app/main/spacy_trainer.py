import random
import spacy
from spacy import displacy
from collections import Counter
import en_core_web_sm
nlp = en_core_web_sm.load()
from spacy.gold import GoldParse
train_data = [      
 ("Buy 100 shares of INFY for rs.100", {'entities' : [(27, 33, 'MONEY'),(4, 7, 'CARDINAL'),(18, 22, 'ORG')] }),\
("Buy 100 shares of INFY for rs. 100", {'entities' : [(27, 34, 'MONEY'),(4, 7, 'CARDINAL'),(18, 22, 'ORG')] }),\
("Sell 100 shares of INFY over rs. 100", {'entities' : [(29, 36, 'MONEY'),(5, 8, 'CARDINAL'),(19, 23, 'ORG')] }),\
("Buy 100 shares of INFY below rs. 100", {'entities' : [(29, 36, 'MONEY'),(4, 7, 'CARDINAL'),(18, 22, 'ORG')] }),\
("Sell 100 shares of INFY above rs. 100", {'entities' : [(30, 37, 'MONEY'),(5, 8, 'CARDINAL'),(19, 23, 'ORG')] }),\
("Sell 100 shares of INFY above Rs. 100", {'entities' : [(30, 37, 'MONEY'),(5, 8, 'CARDINAL'),(19, 23, 'ORG')] }),\
("Buy 100 shares of INFY less than rs. 100", {'entities' : [(33, 40, 'MONEY'),(4, 7, 'CARDINAL'),(18, 22, 'ORG')] }),\
("Sell 100 shares of INFY greater than rs. 100", {'entities' : [(37, 44, 'MONEY'),(5, 8, 'CARDINAL'),(19, 23, 'ORG')] }),\
("I want to purchase 40 shares of asian paints for rs. 100", {'entities' : [(49, 56, 'MONEY'),(19, 21, 'CARDINAL'),(32, 44, 'ORG')] }),\
("Buy 100 shares of INFY for inr100", {'entities' : [(27, 33, 'MONEY'),(4, 7, 'CARDINAL'),(18, 22, 'ORG')] }),\
("Buy 100 shares of INFY for inr 100", {'entities' : [(27, 34, 'MONEY'),(4, 7, 'CARDINAL'),(18, 22, 'ORG')] }),\
("Buy 100 shares of INFY for rs100", {'entities' : [(27, 32, 'MONEY'),(4, 7, 'CARDINAL'),(18, 22, 'ORG')] }),\
("Buy 100 shares of INFY for rs 100", {'entities' : [(27, 33, 'MONEY'),(4, 7, 'CARDINAL'),(18, 22, 'ORG')] }),\
("Buy 100 shares of INFY for rupees 100", {'entities' : [(27, 37, 'MONEY'),(4, 7, 'CARDINAL'),(18, 22, 'ORG')] }),\
("Buy 100 shares of INFY for 100 rupees", {'entities' : [(27, 37, 'MONEY'),(4, 7, 'CARDINAL'),(18, 22, 'ORG')] }),\
("Buy 100 shares of INFY for rupees100", {'entities' : [(27, 36, 'MONEY'),(4, 7, 'CARDINAL'),(18, 22, 'ORG')] }),\
("Buy 100 shares of INFY for 100rupees", {'entities' : [(27, 36, 'MONEY'),(4, 7, 'CARDINAL'),(18, 22, 'ORG')] })]
nlp = spacy.load('en_core_web_sm')
optimizer = nlp.begin_training()

for itn in range(100):
    random.shuffle(train_data)
    for raw_text, entity_offsets in train_data:
        doc = nlp.make_doc(raw_text)
        gold = GoldParse(doc, entities=entity_offsets.get('entities'))
        nlp.update([doc], [gold], drop=0.5, sgd=optimizer)
nlp.to_disk('/nlp_model')