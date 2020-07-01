import React, {useState, useContext} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Redirect } from "react-router-dom";
import AuthContext from './Other/AuthContext.js';

const API = process.env.REACT_APP_API;

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  submit: {
    margin: theme.spacing(3, 0, 0.5),
  },
}));

export default function Login(props) {
  const authToken = useContext(AuthContext);

  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const postLogin = async (e) => {
    if(email === "" || password === "") {
      return null
    }

    setPassword("");

    fetch(`${API}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify( {username: email, password: password} )
    })
    .then(response => {
      if (response.status === 200) {
        response.json().then( data => {
          props.setToken(data.token);
        })
      }
      else {
        throw new Error("Incorrect credentials: Non 200 Response")
      }
    })
    .catch(e => alert(e));
  }

  // if user is already logged in
  if (authToken) {
    return <Redirect to="/home" />
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        
        <h1>
          Sign in
        </h1>

        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(event) => setEmail(event.target.value)}  
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          value={password}
          autoComplete="current-password"
          onChange={(event) => setPassword(event.target.value)}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={postLogin}
        >
          Sign In
        </Button>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="secondary"
          onClick={() => alert("Contact the developers.")}
        >
          Register
        </Button>

      </div>
      <Box mt={8}>
        <Typography variant="body2" color="textSecondary" align="center">
          {'Copyright © '}
          <Link color="inherit" href="https://material-ui.com/">
            Your Website
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      </Box>
    </Container>
  );
}
