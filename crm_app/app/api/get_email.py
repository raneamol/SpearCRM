import imaplib,email
import time
import datetime as dt
from os import path
import os
from datetime import timezone
from email.header import decode_header
import html2text


basedir=os.path.dirname(os.path.abspath(__file__))
gmail_time = os.path.join(basedir, 'data/gmail_time.txt')
gmail_mail = os.path.join(basedir, 'data/gmail_mail.txt')



def get_email():
    #auth details
    user = "raneamol1967@gmail.com"
    password = "amol9699"
    imap_url = "imap.gmail.com"


    date_time = dt.datetime.now()

    f = open(gmail_time,"r")
    t = f.read()
    f.close()

    #Initially put some date in the following format, inside gmail_time.txt---(Fri, 10 Apr 2020 08:33:13 -0700)
    a = dt.datetime.strptime(t, '%a, %d %b %Y %H:%M:%S %z')

    #convert datetime to iso
    date_time.replace(tzinfo=timezone.utc)
    date_time = date_time.replace(tzinfo=timezone.utc).isoformat()
    date_time = dt.datetime.strptime(date_time,'%Y-%m-%dT%H:%M:%S.%f%z')
    lastDayDateTime = date_time - a

    #Initaite connection
    con = imaplib.IMAP4_SSL(imap_url)
    con.login(user,password)
    con.select("inbox")

    dates =  (dt.datetime.now() - lastDayDateTime).strftime("%d-%b-%Y")
    #search by date
    resp , items = con.uid('search' , None , '(SENTSINCE {date})'.format(date = dates))
    #resp , items = con.uid('search' , None , '(UNSEEN)')

    #Convert items into a list
    a = items
    b = a[0].decode('utf-8')
    b = b.split(" ")

    test_json=[]

    #Check if no new emails
    if not b:
        print("No new emails")
    else:
        for value in b:
            late = int(value)
            late = str(late)

            result,data = con.uid('fetch',late,'(RFC822)')
            for response_part in data:
                if isinstance(response_part,tuple):

                    raw =  email.message_from_bytes(response_part[1])
                    date = raw['Date']
                    d = dt.datetime.strptime(t, '%a, %d %b %Y %H:%M:%S %z')
                    try:
                        date1 = dt.datetime.strptime(date, '%a, %d %b %Y %H:%M:%S %z')
                    except:
                        pass
                    if (d<date1):
                        print(raw['Date'])

                        sender = raw['From']
                        print(raw['From'])
                        subject = decode_header(raw['subject'])[0][0]
                        if isinstance(subject, bytes):
                            # if it's a bytes, decode to str
                            subject = subject.decode()
                        print("Subject:",subject)

                        #body
                        if raw.is_multipart():
                            # iterate over email parts
                            for part in raw.walk():
                                # extract content type of email
                                content_type = part.get_content_type()
                                content_disposition = str(part.get("Content-Disposition"))
                                try:
                                    # get the email body
                                    body = part.get_payload(decode=True).decode()
                                except:
                                    pass
                                if content_type == "text/plain" and "attachment" not in content_disposition:
                                    # print text/plain emails and skip attachments
                                    print(body)
                        else:

                            # extract content type of email
                            content_type = msg.get_content_type()
                            # get the email body
                            body = msg.get_payload(decode=True).decode()
                            if content_type == "text/plain":
                                # print only text email parts
                                print(body)

                        #Store data into list of json
                        abc = {
                            "Date": date,
                            "From": sender,
                            "Subject":subject,
                            "Body":html2text.html2text(body)
                        }

                        test_json.append(abc)

                        f2 = open(gmail_time, "w+")
                        print("This is the date",date)
                        f2.write(date)
                        f2.close()
                    else:
                        pass

    return test_json