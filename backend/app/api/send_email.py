import smtplib, ssl
#from app.settings import user,password
from os import environ

def send_email(receiver_email,message,user,password):
    port = 465  # For SSL
    smtp_server = "smtp.gmail.com"
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(smtp_server, port, context=context) as server:
        server.login(user, password)
        server.sendmail(user, receiver_email, message)