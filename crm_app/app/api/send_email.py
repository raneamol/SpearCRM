import smtplib, ssl


def send_email(receiver_email,message):
    print(message)
    print(receiver_email)
    port = 465  # For SSL
    smtp_server = "smtp.gmail.com"
    sender_email = "raneamol1967@gmail.com"  # Enter your address
    password = "amol9699"

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(smtp_server, port, context=context) as server:
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, message)



#testing
'''
receiver_email = "amolrane1973@gmail.com"
no_of_shares = 10
name = "Amol Rane"
trans_type = "buy"
company = "Nerolac"
cost_of_share = "$100"
message = """\
Subject: Hi there
Hi """+str(name)+""",
Your order to """+str(trans_type) +""" """+str(no_of_shares)+""" shares of """+str(company)+"""\
for cost """+str(cost_of_share)+""" is finalized"""

send_email(receiver_email,message)'''