# SpearCRM: AI-enabled CRM for Stockbrokers

SpearCRM is a software for stockbrokers that helps to manage their customers and orders effectively. </br>
SpearCRM is built using ReactJS for the frontend, MongoDB and Flask for the backend, Python for Machine Learning/AI features. 

## Overview

CRMs often suffer due to feature-bloat and poor usability. For small and medium brokerage firms, general-purpose solutions do not fit their specific business cases well enough. They also cannot afford expensive custom solutions.


Hence, SpearCRM condenses the most important features into a user-friendly interface. It is aimed at stockbrokers having individual speculators as their clients. SpearCRM provides insightful visualizations and recommendations, detailed customer tables, comprehensive customer profiles, a streamlined order transaction process and many smart features like real-time stock price fetching and automatic order creation from emails.



## Features 

* **Email Automation**: Orders are automatically extracted from emails, and automatic email updates are sent as orders progress.
* **AI-enabled Workflow** : Maximize efficiency with automation of email, orders, tasks
* **Orders Pipeline**: It is a Kanban-like interface for all orders.
* **Top Opportunities Recommender**: An AI-based system analyzes leads and customers data and suggests the best prospects directly to the user.
* **Dashboard**: Clear and compelling visualizations provide valuable insights.
* **Task management**: The user can add future or past activities (tasks) for each customer and track its status.
* **Next Step Recommendation**: Tasks are automatically generated based on user actions or on the orders' position in the pipeline.
* **Real-time Stock Price fetching**: The system automatically compares the real-time stock prices against the desired price, allowing the user to transact the order promptly when the price is right.
* **Feature-rich customer tables**: A clear tabular view of Accounts and Leads with powerful features is provided.
* **Comprehensive Profile page**: Interactive Customer profile management which displays all customer associated data.
* Seamless lead to account conversion
* Clean and responsive UI that stays user-friendly

## Usage

### Related material:
Individual Frontend Repository: [https://github.com/VedantPimpley/stockbroker-crm-frontend](https://github.com/VedantPimpley/stockbroker-crm-frontend)

Individual Backend Repository: [https://github.com/raneamol/stockbroker_crm_backend](https://github.com/raneamol/stockbroker_crm_backend)

Extended video showcase: [Youtube link](https://youtu.be/PNviqti7bls)


### Login Page

Users can log in using their registered Email ID and password. Authorized login is in required to access the other pages.	

### Home Page
![Home](https://user-images.githubusercontent.com/57246364/86516958-a2ff9800-be42-11ea-8a8f-32bbfb0938d3.gif)

It presents a birds-eye-view of the data and serves as a diving-off point for the user. It has 4 widgets.
* Top Opportunities: Best lead and customer prospects recommended by the AI system.
* Revenue Line Graph: Displays the revenue generated each month.
* Orders Pie Chart: Snapshot of the current pipeline state showing the number of orders in each stage.
* Upcoming Tasks: Shows the future tasks for all customers. Tasks can be added, deleted, completed right then and there.

### Accounts Page
<details>
<summary> GIF of Accounts Page </summary>

![Accounts](https://user-images.githubusercontent.com/57246364/86516955-a09d3e00-be42-11ea-9d0c-a379193dd5f7.gif)
</details>

Central place to find, access and add accounts. An account refers to an account holder of a trading and demat account in the brokerage firm.

* Account table: Rich table with multiple emailing, searching, filtering abilities. Uses Antd Tables.
* New Account Form: Quickly add an account to the system.

### Leads Page
<details>
<summary> GIF of Leads Page </summary>

![Leads](https://user-images.githubusercontent.com/57246364/86516962-a561f200-be42-11ea-98c8-0d00b23c3fb1.gif)
</details>

Central place to find, access, and add leads. Leads are prospective customers who do not yet have an account open with the firm.

Similar to the Accounts page. Big difference is the choice of ML fields during New Lead addition which can create better insights about the user.

### Account Profile Page
<details>
<summary> GIF of Account Profile Page </summary>

![AccountProfile](https://user-images.githubusercontent.com/57246364/86516943-88c5ba00-be42-11ea-84fe-9def8d21692f.gif)
</details>

Contains all pertinent information about an account. 

* Editable Data fields: Personal data of the account can be viewed and edited here. The sum of all transactions of the account till now is tracked and and presented as total account turnover.
* Stage Indicator: Shows stage of user's order/s which is/are closest to completion. In one click, all to-be-transacted orders can be marked as transacted.
* Activity Tracker: Lists all the tasks, orders and possible actions associated with the account. User can compose emails, view, create and delete orders, view past and future tasks and add, delete or complete tasks. AI-Recommended tasks are system generated tasks that recommend the next course of action for an order depending on its stage. On completion of such a task, the corresponding order's stage is updated automatically.

### Lead Profile Page
<details>
<summary> GIF of Lead Profile Page </summary>

![LeadProfile](https://user-images.githubusercontent.com/57246364/86516961-a430c500-be42-11ea-95c3-8bea273271cc.gif)
</details>

Contains all pertinent information about a lead.
* Editable Data fields: Personal data of the account can be viewed and edited here.
* Lead Status Indicator: Shows whether the lead has been contacted or not. A contacted lead can be converted into an account through a seamless transition.
* Activity Tracker: Lists all the tasks and possible actions associated with the lead. User can compose emails, view past and future tasks and add, delete or complete tasks.

### Pipeline Page
<details>
<summary> GIF of Pipeline Page </summary>

![Pipeline](https://user-images.githubusercontent.com/57246364/86516964-a6931f00-be42-11ea-963b-95b53b361506.gif)
</details>

Central place to interact with all orders in the system in a streamlined fashion. Each order consists of a company name (listed on the NSE), order owner, type of transaction (buy/sell), number of shares and the desired price. 

The order lifecycle is split into 4 stages.
1. Received: Orders received from emails are automatically inserted to this stage using an AI algorithm.
2. Finalized: Contains Received orders that have been Finalized and the orders created by the user.
3. To-be-transacted: Contains orders meant to be transacted immediately.
4. Transacted: Contains orders which have been transacted on the stock exchange.
 
 ##### Receive Order from Email
 <details>
<summary> GIF of Receive Order from Email feature </summary>

![EmailOrders](https://user-images.githubusercontent.com/57246364/86516957-a1ce6b00-be42-11ea-9c17-f9df09147091.gif)
</details>


 **Features**:
* Order drag and drop: Orders can be individually dragged and dropped from one stage to the next.
* Order addition: Newly created orders are added to the Finalized stage. 
* Order deletion: Orders can be deleted directly.
* Convert Finalized orders: When this button is pressed, the desired price of all Finalized orders is compared with their real-time stock price. The orders in which desired price is met are moved to the next stage.
* Mark orders as transacted: All Orders can be converted from to-be-transacted to transacted on a single button click. The desired price is replaced with the real-time price of the stock. 


## Technologies used
Frontend Technologies used:

* MaterialUI - Styling and login page template
* CanvasJS - Charts in ReactJS
* react-google-charts - Piechart in ReactJS 
* React Router DOM - SPA routing
* Finnhub.io - Real-time stockprice fetching API
* JWT Tokens - Login Authentication
* React-trello - Kanban interface
* AntD - Tables
* Window sessionStorage - Caching stock prices, Tab duplication prevention mechanism
* React Hooks


Backend Technologies used:

* Flask Blueprints - Flask Folder structure
* IMAP - Fetting email contents from Gmail
* SMTP - Sending emails
* JWT Bearer token authorization - Protected API routes
* Sklearn and statsmodel - Top Lead Opportunities
* Pickle - Machine learning model storage
* Pandas - Dataframe generation
* Named Entity Extraction(NER) using Spacy and Nltk - Order generation from emails
* Pymongo - Interacting with MongoDB database from Python
* Waitress - Flask Production Server
* flask-cors - CORS support

## Getting started

#### Required software:

1. Python 3.8.1
2. Mongo v4.2.2
3. React 16.13.1
4. NodeJS 8.17.1
5. yarn 1.22.0

Install pip, the Python package manager, to handle the installation of the application's Python dependencies. </br>
Follow steps on [this page](https://docs.mongodb.com/manual/administration/install-community/) to install mongodb.

#### Installation

Complete the installations of the above required programs. Then clone the directory, navigate to the root of the directory of the code and run the following:

##### Frontend installation:
	$ git clone https://github.com/raneamol/stockbroker-crm
	$ cd spearcrm
	$ yarn install 
	$ yarn start

Create a configuration file
 .env for local app configurations like config variables(proxy backend link and Finnhub API key)

##### Backend installation:

Create a database on mongodb

	$ mongo
	$ use <dbname>	

Create a virtual environment for the project
	
    $ cd backend
	$ python3 -m venv env

For activating the virtual environment (Windows):

    $ env\Scripts\activate.bat
    
For activating the virtual environment (Linux):
	
    $env/bin/activate

Run the requirements:
	
    $ pip install -r requirements.txt

Create configuration files:

- Add .env and .flaskenv files
  > .env for local app configurations like config variables(cluster link, database name, passwords, etc.)</br>
  > .flaskenv for Flask CLI configuration commands(like flask environment, host, port, etc.)

For running the main program locally:
	
    $ python index.py 
	OR
	$ heroku local web -f Procfile.windows

## Authors and acknowledgment

Vedant Y. Pimpley <vedantpimpley7@gmail.com> </br>
Amol S. Rane <raneamol99@gmail.com>

## License
This project is licensed under AGPLv3.
