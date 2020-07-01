import React, {useState, useEffect, useRef, useContext} from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Divider from '@material-ui/core/Divider';
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import RefreshIcon from '@material-ui/icons/Refresh';
import ListIcon from '@material-ui/icons/List';
import { Tooltip } from '@material-ui/core';
import '../styles/OrdersDisplay.css'
import AuthContext from '../Other/AuthContext.js';
import { prepareGETOptions } from '../Other/helper.js';

const API = process.env.REACT_APP_API;
export default function OrdersDisplay (props) {
  const [open, setOpen] = useState(false);

  const authToken = useContext(AuthContext);

  const _isMounted = useRef(true);
  useEffect( () => {
    return () => _isMounted.current = false;
  }, []);
  //isMounted is used to prevent rendering after unmount. Here, related to async calls.

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const deleteOrder = (orderId) => {
    props.updateSpinner(true);
    fetch(`${API}/main/delete_order/${orderId}`, prepareGETOptions(authToken))
    .then( () => props.updateAccountDataAndOrdersAndActivities() )
    .then( () => props.updateSpinner(false));
  }

  const convertEligibleFinalizedOrders = async () => {
    props.updateSpinner(true);

    let companyPrices = {company: props.cache};

    fetch(`${API}/main/convert_finalized_orders`, {
      method: "POST",
      withCredentials: true,
      headers: {'Authorization' : 'Bearer ' + authToken, 'Content-Type': 'application/json'},
      body: JSON.stringify(companyPrices)
    })
    .then(response => {
      if (response.ok && _isMounted) {
        props.updateAccountDataAndOrdersAndActivities()
      }
      else {
        throw new Error("Something went wrong");
      }
    })
    .catch( error => console.log(error))
    .then( () => {if (_isMounted) {props.updateSpinner(false)}} );
  }

  return (
    <>
      <span>
        {/* TODO: Make this width percentage based */}
        <Button className="add-new-order-button" variant="outlined" color="primary" onClick={handleOpen}>
          <ListIcon />
          <span style={{ marginLeft: 2 }}> View all orders </span>
        </Button>
      </span>
      {/* button opens the below dialogbox */}


      

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth={"md"}
        className="orders-display-dialog-box"
      >
        

        <DialogTitle id="form-dialog-title">

          <span> View all orders </span>

          <span style={{ float: "right" }}> 
            <IconButton aria-label="close" onClick={convertEligibleFinalizedOrders}>
              <Tooltip title="Check share price and update">
                <RefreshIcon />
              </Tooltip>
            </IconButton> 

            <IconButton aria-label="close" onClick={handleClose}>
              <CloseIcon />
            </IconButton>  
          </span>

        </DialogTitle>
          
        <DialogContent>
          <div className="orders-container">
            <List>

              {/* Display non-archived orders here */}
              {
                props.ordersList.filter( (order) => order.stage !== 0 ).map( (order, i) => {
                  
                  let iconAvatar = ( 
                    (order.trans_type).toLowerCase() === "buy" ? 
                      <Avatar style={{backgroundColor: "#1976d2"}}>
                        B
                      </Avatar> 
                    :
                      <Avatar style={{backgroundColor: "#dc004e"}}>
                        S
                      </Avatar>
                  );

                  let orderLane = (
                    order.stage === 3 ? "To-be-transacted" :
                    order.stage === 2 ? "Finalized" : 
                    order.stage === 1 ? "Received" : ""
                  );

                  let costProduct = (
                    isNaN(order.cost_of_share*order.no_of_shares) ?
                    `${order.no_of_shares} X ${order.cost_of_share}`:
                    `${Math.floor( order.cost_of_share*order.no_of_shares )} (${order.no_of_shares} X ${order.cost_of_share})`
                  )

                  return(
                    <div key={i}>
                      <ListItem>

                        <ListItemAvatar>
                          {iconAvatar}
                        </ListItemAvatar>  
                      
                        <ListItemText
                          primary = {order.company}
                          secondary = {costProduct}
                        />

                        <ListItemSecondaryAction>
                          <span style={{ right:5 }}>
                            {orderLane}
                          </span>

                          <IconButton 
                            edge="end"
                            onClick={() => deleteOrder(order._id)}  
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>

                      </ListItem>
                    </div>  
                  );                     
                })
              }

              <Divider />
              
              {/* Display archived orders here */}
              {
                props.ordersList.filter( (order) => order.stage === 0 ).map( (order, i) => {
                  let iconAvatar = ( 
                    (order.trans_type).toLowerCase() === "buy" ? 
                      <Avatar style={{backgroundColor: "#1976d2"}}>
                        B
                      </Avatar> 
                    :
                      <Avatar style={{backgroundColor: "#dc004e"}}>
                        S
                      </Avatar>
                  );

                  let costProduct = (
                    isNaN(order.cost_of_share*order.no_of_shares) ?
                    `${order.no_of_shares} X Rs. ${order.cost_of_share}`:
                    `${Math.floor( order.cost_of_share*order.no_of_shares )} (${order.no_of_shares} X Rs. ${order.cost_of_share})`
                  )
                  
                  return(
                    <div key={i}>
                      <ListItem>

                        <ListItemAvatar>
                          {iconAvatar}
                        </ListItemAvatar>  
                      
                        <ListItemText
                          primary={order.company}
                          secondary={costProduct}
                        />

                        <ListItemSecondaryAction>
                          <div style={{ right:5 }}>
                            Transacted
                          </div>
                          
                        </ListItemSecondaryAction>

                      </ListItem>
                    </div>  
                  );                     
                })
              }
            </List>
          </div>  
        </DialogContent>
      </Dialog>
    </>
  );
}