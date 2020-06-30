from app import create_app

from waitress import serve

from os import environ

application = create_app()
serve(application, host = '0.0.0.0', port = environ.get("PORT", 5000))