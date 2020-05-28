from ..extensions import mongo

from app.main import main

from .helper import fetch_order



@main.route('/homepage')
def homepage():
    abc = fetch_order()

    return str(abc)