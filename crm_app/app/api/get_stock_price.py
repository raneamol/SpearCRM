from nsetools import Nse

def get_stock_price(company):
    nse = Nse()
    stock_data = nse.get_quote(company)
    last_price = stock_data["lastPrice"]
    return last_price

#Testing
'''
abc = get_stock_price('kansainer')
print(abc)
'''