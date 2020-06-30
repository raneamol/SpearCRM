import React, {useState, useEffect, useRef, useContext} from 'react';
import './styles/Dashboard.css';
import Chart from 'react-google-charts';
import CanvasJSReact from './Other/canvasjs.react';
import TopOpportunitiesWidget from './subcomponents/TopOpportunitiesWidget.js';
import UpcomingTasksWidget from './subcomponents/UpcomingTasksWidget.js';
import AuthContext from './Other/AuthContext.js';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { prepareGETOptions } from './Other/helper.js';

const API = process.env.REACT_APP_API;

export default function Dashboard(props) {
	const [topLeads, setTopLeads] = useState([]);
	const [topAccounts, setTopAccounts] = useState([]);
	const [allActivities, setAllActivities] = useState([]);
	const [pieChartData, setPieChartData] = useState([]);
	const [lineChartData, setLineChartData] = useState([]);
  const [openSpinner, setOpenSpinner] = useState(false);

  const authToken = useContext(AuthContext);

  const _isMounted = useRef(true);
	useEffect( () => {
		Promise.all([
      fetch(`${API}/main/top_leads`, prepareGETOptions(authToken)),
      fetch(`${API}/main/top_accounts`, prepareGETOptions(authToken)),
      fetch(`${API}/main/show_all_activities`, prepareGETOptions(authToken)),
      fetch(`${API}/main/get_line_graph_data`, prepareGETOptions(authToken)),
      fetch(`${API}/main/get_pie_chart_data`, prepareGETOptions(authToken))
    ])
		.then(responses => {
      if (_isMounted.current) {
        responses[0].json().then( data => setTopLeads(data) );
        responses[1].json().then( data => setTopAccounts(data) );
        responses[2].json().then( data => setAllActivities(data) );
        responses[3].json().then( data => setLineChartData(data) );
        responses[4].json().then( data => setPieChartData(data) );
      }
    })
    
    return () => _isMounted.current = false;
	}, [authToken]);

	const updateDashboardAPICall = async () => {
		Promise.all([
      fetch(`${API}/main/top_leads`, prepareGETOptions(authToken)),
      fetch(`${API}/main/top_accounts`, prepareGETOptions(authToken)),
      fetch(`${API}/main/show_all_activities`, prepareGETOptions(authToken)),
      fetch(`${API}/main/get_line_graph_data`, prepareGETOptions(authToken)),
      fetch(`${API}/main/get_pie_chart_data`, prepareGETOptions(authToken))
    ])
		.then(responses => {
			if (_isMounted.current) {
        responses[0].json().then( data => setTopLeads(data) );
        responses[1].json().then( data => setTopAccounts(data) );
        responses[2].json().then( data => setAllActivities(data) );
        responses[3].json().then( data => setLineChartData(data) );
        responses[4].json().then( data => setPieChartData(data) );
      }
		})
  }
  
  const setOpenSpinnerInDashboard = bool => {
    //we introduce delay when turning off spinner, but not when turning it on
    if (bool) {
      setOpenSpinner(bool);
    } else {
      setTimeout(() => {
        if (_isMounted.current) {
          setOpenSpinner(bool);
        }
      }, 1500)
    }
  }

	return(
    <div className="grid-container">
			<TopOpportunitiesWidget 
				topLeads = {topLeads} 
				topAccounts = {topAccounts}
			/>
      
      <LineChart 
        lineChartData = {lineChartData}
      />
      
      <PieChart 
        pieChartData = {pieChartData}
      />
			
      <UpcomingTasksWidget 
				updateDashboard = {updateDashboardAPICall}
        activitiesList = {allActivities.filter( activity => activity["activity_type"] === "future" )}
        cache = {props.cache}
        setOpenSpinnerInDashboard = {setOpenSpinnerInDashboard}
			/>

      <Backdrop className="spinner-backdrop" open={openSpinner}>
        <CircularProgress />
      </Backdrop>
    </div>
	); 
} 

const pieOptions = {
  title: "Lead Size",
  pieHole: 0,
  slices: [
    {
      color: "#2BB673"
    },
    {
      color: "#d91e48"
    },
    {
      color: "#007fad"
    },
    {
      color: "#e9a227"
    }
  ],
  legend: {
    position: "bottom",
    alignment: "center",
    textStyle: {
      color: "233238",
      fontSize: 14
    }
  },
  tooltip: {
    showColorCode: true
  },
  chartArea: {
    left: 0,
    top: 0,
    width: "100%",
    height: "85%"
  },
  fontName: "Roboto"
};

class PieChart extends React.Component {
  state = {
    chartImageURI: ""
  };

  transformOrdersToDataPoints = (orders) => {
    let dataPoints = [
      ['Stage', 'Volume'],
      ['Received', 0],
      ['Finalized', 0],
      ['To-be-transacted', 0],
      ['Transacted', 0],
    ];

    orders.forEach( element => {
      switch(element.stage) {
        case 1:
          dataPoints[1][1] = dataPoints[1][1] + 1;
          break;
        case 2:
          dataPoints[2][1] = dataPoints[2][1] + 1;
          break;
        case 3:
          dataPoints[3][1] = dataPoints[3][1] + 1;
          break;
        case 0:
          dataPoints[4][1] = dataPoints[4][1] + 1;
          break;
        default:
          break;
      }
    });

    return dataPoints;
  }

  render() {
    return (
      <div className="pieChartContainer">
        <div 
          style={{ 
            margin: "auto", 
            fontSize: 28, 
            fontWeight:600, 
            textAlign: "center", 
            fontFamily:'Helvetica', 
            paddingTop: 0, 
            color: "rgba(0,0,0,0.8)",
            height: "10%"
          }}
        >
          Snapshot of Pipeline orders
        </div>

        <Chart
          chartType = "PieChart"
          data = {this.transformOrdersToDataPoints(this.props.pieChartData)}
          options = {pieOptions}
          graph_id = "Distribution of orders currently"
          height = {"90%"}
          width = {"99%"} //sizing errors occur at 100%
          legend_toggle
        />
      </div>
    );
  }
}

var CanvasJSChart = CanvasJSReact.CanvasJSChart;
class LineChart extends React.Component {
  transformOrdersToDataPoints = (orders) => {
    let dataPoints = [	
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 4, y: 0 },
      { x: 5, y: 0 },
      { x: 6, y: 0 },
      { x: 7, y: 0 },
      { x: 8, y: 0 },
      { x: 9, y: 0 },
      { x: 10, y: 0 },
      { x: 11, y: 0 },
      { x: 12, y: 0 },
    ];

    orders.forEach( element=> {
      dataPoints[element.month - 1].y += element.no_of_shares*element.cost_of_share;
    });

    dataPoints.forEach( element => {
      element.y = element.y/1000;
    });

    return dataPoints;
  }

	render() {
		const lineOptions = {
			animationEnabled: true,
			exportEnabled: true,
			theme: "light2",
			title:{
        text: "Revenue generated",
        fontSize: 28,
        fontFamily: "Helvetica",
        color: "rgba(0,0,0,0.8)"
			},
			axisY: {
				title: "Revenue (in Rs.)",
				includeZero: false,
        suffix: "k",
			},
			axisX: {
				title: "Month",
				prefix: "",
				interval: 1
			},
			data: [{
				type: "line",
				toolTipContent: "Month {x}: {y}",
				dataPoints: this.transformOrdersToDataPoints(this.props.lineChartData)
			}]
		}
		return (
		<div className="line-chart-container">
			<CanvasJSChart options = {lineOptions}
			/>
		</div>
		);
	}
} 