import React from 'react';
import NewActivityDialogBox from './NewActivityDialogBox';
import { Link } from 'react-router-dom';
import StarRateIcon from '@material-ui/icons/StarRate';
import CancelIcon from '@material-ui/icons/Cancel';
import AuthContext from '../Other/AuthContext.js';
import { prepareGETOptions } from '../Other/helper.js';
import {convertIsoDateToDateString} from "../Other/helper.js"
import MenuItem from '@material-ui/core/MenuItem';
import '../styles/UpcomingTasksWidget.css'

const API = process.env.REACT_APP_API;
export default class UpcomingTasksWidget extends React.Component {
  state = {
    leadSelectOptions : [],
    accountSelectOptions : [],
  };
  
  static contextType = AuthContext;

  allLeadIds = [];

  componentDidMount() {
    this._isMounted = true;

    Promise.all([
      fetch(`${API}/main/get_all_account_names`, prepareGETOptions(this.context)),
      fetch(`${API}/main/get_all_lead_names`, prepareGETOptions(this.context))
    ])
    .then(values => {
      let leadsMenuItems = [<MenuItem value="" key={0}> <em>None</em> </MenuItem>];
      let accountsMenuItems = [<MenuItem value="" key={0}> <em>None</em> </MenuItem>];

      //sort and format account names
      values[0].json()
      .then(accounts => {
        accounts = accounts.sort(function(a,b){ 
          var x = a.name < b.name? -1:1; 
          return x; 
        });

        accounts.forEach( (account, i) => {
          accountsMenuItems.push([<MenuItem value={account._id} key={i+1}> {account.name} </MenuItem>]);
          //existing null MenuItem has key=0, these entries have key=i+1
        });
      });

      //sort and format lead names
      values[1].json()
      .then(leads => {
        leads = leads.sort(function(a,b){ 
          var x = a.name < b.name? -1:1; 
          return x; 
        });

        leads.forEach( (lead, i) => {
          leadsMenuItems.push([<MenuItem value={lead._id} key={i+1}> {lead.name} </MenuItem>])
          this.allLeadIds.push(lead._id);
          //existing None MenuItem has key=0, these entries have key=i+1
        });
      });

      if (this._isMounted) {
        this.setState({ leadSelectOptions : leadsMenuItems});
        this.setState({ accountSelectOptions : accountsMenuItems});
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

	transitionActivity = async (activityId) => {
    this.props.setOpenSpinnerInHome(true);
    
    const activityToTransition = {
      "_id" : activityId,
      "activity_type" : "past",
      "company" : this.props.cache,
    };
    
		fetch(`${API}/main/change_activity_type`, {
      method: "POST",
      withCredentials: true,
      headers: {'Authorization' : 'Bearer ' + this.context, 'Content-Type': 'application/json'},
      body: JSON.stringify(activityToTransition)
		})
    .then(response => {
      if (response.ok) {
        this.props.updateHome();
      }
      else {
        throw new Error("Something went wrong");
      }
    })
    .catch( error => console.log(error))
    .then( () => this.props.setOpenSpinnerInHome(false));
	}
	
	deleteActivity = (activityId) => {
    this.props.setOpenSpinnerInHome(true);

		fetch(`${API}/main/delete_activity/${activityId}`, prepareGETOptions(this.context))
    .then( () => this.props.updateHome())
    .then( () => this.props.setOpenSpinnerInHome(false))
	}

  render() {
    return(
      <>
        <div className="upcoming-tasks-widget">

          <div className='tasks-widget-title'> 
  					<span style={{ paddingLeft: 75 }}> Upcoming Tasks  </span>
  					<span className="new-task-button"> 
              <NewActivityDialogBox 
                updateHome = {this.props.updateHome} 
                setOpenSpinnerInHome = {this.props.setOpenSpinnerInHome}
                leadSelectOptions = {this.state.leadSelectOptions}
                accountSelectOptions = {this.state.accountSelectOptions}
              /> 
  					</span> 
  				</div>

      		<div className="tasks-scroller-container">
      			<ul className="tasks-list">
  						{
                this.props.activitiesList.sort( (a,b) => new Date(b.date) - new Date(a.date) ) //sort by most recent
                .map( (element,i) => {
  								return(							
  									<div key={i} >
  										
                      
                      {element.ai_activity ? 
                        <div className='ai-tag'>
                          <span className='ai-tag-star-icon'> 
                            <StarRateIcon />   
                          </span>
                          <span>
                            AI-Recommended
                          </span>
                        </div>
                        :
                        <p> &nbsp; </p>
                      }

  										<li>
                        &nbsp; 
                        <input 
                          type="checkbox" 
                          className="largerCheckbox" 
                          checked={false}
                          onClick={() => {this.transitionActivity(element._id)}} 
                        />

                        <Link to={{ 
                          pathname: this.allLeadIds.includes(element.customer_id) ? '/leadprofile' : '/accountprofile', 
                          state: {cid: element.customer_id} 
                        }}>
                          <span className="task-title">
                            &nbsp; {element.title}                      
                          </span>
                        </Link>  

                        <span className="task-date">  {convertIsoDateToDateString(element.date)} </span> 
                        <span className="delete-icon" onClick={() => {this.deleteActivity(element._id)}}> <CancelIcon /> </span>
  										</li>

  										<li className="task-body"> &nbsp; &nbsp; &nbsp; &nbsp;{element.body} </li>
  									</div>
  								);
  							})
  						}
      			</ul>
          </div>
        </div>
      </>
    );
  }
}