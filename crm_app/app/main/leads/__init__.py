from flask import Blueprint

leads = Blueprint('leads',__name__)

from app.main.leads import top_leads,routes