import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Pipeline from './Pipeline.js';
import Home from './Home.js';
import Accounts from './Accounts.js'; 
import AccountProfile from './AccountProfile.js';
import Leads from './Leads.js';
import LeadProfile from './LeadProfile.js';
import Login from './Login.js';
import { AuthProvider } from './Other/AuthContext.js';
import { prepareGETOptions } from './Other/helper.js';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { setUnion, setDifference, getPrice, LargeTooltip } from './Other/helper.js'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import PrivateRoute from './Other/PrivateRoute.js';
import Button from '@material-ui/core/Button';
import jwtDecode from 'jwt-decode';
import './styles/App.css';

const API = process.env.REACT_APP_API;
export default class App extends React.Component {
  state = {
    cache : {},
    isStartupSpinnerOn : false,
    authToken : "" || JSON.parse(sessionStorage.getItem("token")), 
    //token persists over reload, but not between sessions
    preventRender : false || ( JSON.parse(sessionStorage.getItem("disallowCopy")) && !JSON.parse(sessionStorage.getItem("wasRefreshed")) )
  }

  tokenExpiryTime = 0;
  
  //executed when tab is a duplicate tab
  forceLogOut = () => {
    alert("Tab duplication is not allowed.");
    this.setState({ authToken : "" }, () => {
      sessionStorage.removeItem("token");
    })
  }

  //called during successful login
  setToken = (data) => {
    this.setState({ authToken : data }, () => {
      sessionStorage.setItem("token", JSON.stringify(data));
      
      this.tokenExpiryTime = jwtDecode(data).exp;

      sessionStorage.setItem("disallowCopy", JSON.stringify(true));
    });

    //if waitingList is non empty, stockprice fetching is incomplete. Hence spinner is turned on.
    if(this.waitingList.size > 0) {
      this.setState({ isStartupSpinnerOn: true });
    }
  }

  logOut = () => {
    this.setState({ authToken : "" }, () => {
      sessionStorage.removeItem("token");
    })
  }

  companiesThisSession = new Set();
  waitingList = new Set();
  cachedCompanies = new Set();
  callCacheUpdaterAt = 0;
  timer1 = 0;
  timer2 = 0;

  componentDidMount() {
    //for first load of main
    if (JSON.parse(sessionStorage.getItem("disallowCopy")) === null || undefined) {
      sessionStorage.setItem("disallowCopy", JSON.stringify(false));
    }

    //preventRender is true for duplicate tabs
    if (this.state.preventRender === true) {
      this.forceLogOut();
    }

    //allows page to be refreshed just once
    if (JSON.parse(sessionStorage.getItem("wasRefreshed"))) {
      sessionStorage.removeItem("wasRefreshed");
    }
    this.allowPageReloads();

    if (sessionStorage.getItem("cache")) {
      this.getCacheFromSessionStorage();
    }

    //tokenExpiryTime value is lost during page reload
    //hence we re-apply it
    if (this.state.authToken) {
      this.tokenExpiryTime = jwtDecode( this.state.authToken ).exp;
    }

    this.receiveCompanyNamesDuringStartup()
    .then( ()=> {
      //timer checks every second 
      //if waitingList has items and whether one minute has passed since the last time that cacheUpdater finished execution
      //if true, cacheUpdater gets called
      this.timer1 = setInterval( () => {
        if (Date.now() > this.callCacheUpdaterAt && this.waitingList.size > 0) {
          this.cacheUpdater()
          .then( () => this.callCacheUpdaterAt = Date.now() + 60000)
        }

        //current time in seconds below
        if (Math.floor(new Date().getTime() / 1000) > this.tokenExpiryTime && this.state.authToken) {
          this.logOut();
          alert("Session duration is over. Log in again to continue.");
        }

        }, 1000)
    });
  }

  componentWillUnmount(){
    //clear timers
    clearInterval(this.timer1);
    clearInterval(this.timer2);
  }

  allowPageReloads = () => {
    window.addEventListener("beforeunload", (e) => {
      // preventRender is true for duplicate pages
      if( !this.state.preventRender ) {
        sessionStorage.setItem('wasRefreshed', JSON.stringify(true));
      }
      return ""
    });
  }

  getCacheFromSessionStorage() {
    this.setState({ cache: JSON.parse(sessionStorage.getItem("cache")) }, () => {
        this.cachedCompanies = new Set( Object.keys(this.state.cache) );
        //this.waitingList gets updated accordingly in receiveCompanyNamesDuringStartup
        this.companiesThisSession = new Set();

        //timer2 is set at the end of cacheUpdater
        //but if cache exists, then cacheUpdater isn't called as all companies are already cached
        //then timer2 will not be set, which is a problem
        //hence we run foll. func. after we get cache from session storage
        this.startAdditionalTimers();
      }
    );
  }

  //populates the waitingList on startup
  receiveCompanyNamesDuringStartup = async () => {
    let initialCompanies = new Set();

    //this is a public route, unlike all the other API routes
    fetch(`${API}/main/show_all_companies`)
    .then(response => {
      response.json()
      .then( allCompanies => {
        allCompanies.map(element => initialCompanies.add( (element.company).toLowerCase() ));

        //waitingList will only contain the company names which are in initialCompanies but not the ones which are already cached
        //this runs during startup. So how are companies already cached? Because we got them from the session storage in which we had saved the cache.
        this.waitingList = setDifference(initialCompanies, this.cachedCompanies);
      })
    })
  }
      
  receiveCompanyNamesDuringRuntime = companies => {
    let deduplicatedInput = new Set( companies.map(elem => elem.toLowerCase()) );
    this.companiesThisSession = setUnion(this.companiesThisSession, deduplicatedInput);

		// below, new companies is a misnomer. It consists of new companies AND the companies which were earlier cached 
		// but were cleared from cachedCompanies because we do that every 5 minutes for freshness of data
		let newCompanies = setDifference(this.companiesThisSession, this.cachedCompanies);
		this.waitingList = setUnion(this.waitingList, newCompanies);
  }

  cacheUpdater = async() => {
    if(this.waitingList.size === 0) { return null; }

    //therefore, below code executes when elements ARE present in waitingList
    let n = this.waitingList.size > 30 ? 30 : this.waitingList.size;
		let ApiInput = [...this.waitingList].slice(0,n);
		let ApiOutput = {};
    let priceFoundCompanies = new Set();

    Promise.all( ApiInput.map(elem => getPrice(elem)) )
		.then( responses => {
			responses.forEach( resp => {
				if (resp.price !== null) {
					ApiOutput[resp.company] = resp.price;
					priceFoundCompanies.add(resp.company);
				}
      })
      
      //update variables

      //merging of two objects and setting cache in local storage
      this.setState(
        { cache: {...this.state.cache, ...ApiOutput} }, 
        () => sessionStorage.setItem("cache", JSON.stringify(this.state.cache))
      ); 
      this.cachedCompanies = setUnion(this.cachedCompanies, priceFoundCompanies);
      this.waitingList = setDifference(this.waitingList, priceFoundCompanies);
  
      //below code disables the loading spinner when all companies prices
      //are done caching during startup
      if (this.state.isStartupSpinnerOn && this.waitingList.size === 0) {
        this.setState({ isStartupSpinnerOn: false });
      }

      //turn on timer2 during the first time cacheUpdater is called
      if (this.timer2 === 0) {
        this.startAdditionalTimers();
      }

    })
  }

  //this function is called after all companies are cached during startup
  //at that time, we begin the timers which are responsible for 
  //(i) periodically emptying cachedCompanies set
  //(ii) periodically calling the get_order_from_email API
  startAdditionalTimers = () => {
    this.timer2 = setInterval( () => {
      // (i)
      this.cachedCompanies.clear();

      //(ii)
      fetch(`${API}/main/get_order_from_email`, prepareGETOptions(this.state.authToken))
      .then( response => 
        response.text()
        .then( text => {
          if (text === "Inserted") {alert(" New orders received from email. Refresh page to view changes.")}
        })
      )

    }, 300000);
  }

  render() {
    if(this.state.preventRender) {
      return (
        <div> Please close this tab and return to the original to continue. </div>
      );
    }

    return(
      <AuthProvider value={this.state.authToken}>
        <Backdrop className="spinner-backdrop" open={this.state.isStartupSpinnerOn}>
          <CircularProgress color="primary" />
          <p style={{ fontWeight: 800 }}> &nbsp; Loading stock prices </p>
        </Backdrop>

        <Router>
          <div>
            
            {this.state.authToken ?
              <nav>
                <ul>
                  <li>
                    {/* Home is replaced by the term Home only in the linking */}
                    <Link to="/home"> Home </Link> 
                  </li>
                  <li>
                    <Link to="/accounts"> Accounts </Link>
                  </li>
                  <li>
                    <Link to="/leads"> Leads </Link>
                  </li>
                  <li>
                    <Link to="/pipeline"> Pipeline </Link>
                  </li>

                  <div className="user-icon"> 
                    <LargeTooltip 
                      title={"Logged in as: " + jwtDecode(this.state.authToken).first_name + " " + jwtDecode(this.state.authToken).last_name} 
                      arrow
                    >
                      <AccountCircleIcon fontSize="large" color="primary"/>
                    </LargeTooltip>
                  </div>

                  <div className="logout-button">
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="medium"
                      onClick={this.logOut}
                    >
                      Log Out
                    </Button>
                  </div>
                </ul>  
              </nav>
              :
              null
            }

            <Switch>

              {/* Login is the only public route meaning it doesn't require a successful login */}
              <Route
                exact path="/"
                render={() =>
                  <Login setToken={this.setToken} />
                }
              />

              <PrivateRoute 
                path="/home" 
                component={Home}
                cache = {this.state.cache}
              />

              <PrivateRoute 
                path="/accounts" 
                component={Accounts}
              />

              <PrivateRoute 
                path="/accountprofile"
                component={AccountProfile}
                cache = {this.state.cache}
                receiveCompanyNamesDuringRuntime = {this.receiveCompanyNamesDuringRuntime}
              />

              <PrivateRoute 
                path="/leads" 
                component={Leads} 
              />

              <PrivateRoute 
                path="/leadprofile" 
                component={LeadProfile} 
              />

              <PrivateRoute 
                path="/pipeline" 
                component={Pipeline}  
                cache = {this.state.cache} 
                receiveCompanyNamesDuringRuntime = {this.receiveCompanyNamesDuringRuntime}
              />

            </Switch>
          </div>
        </Router>
      </AuthProvider>
    );
  }
}