import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8010';


class Login extends React.Component {

  constructor() {
    super();
    this.state = {
      field_user: "",
      field_pass: "",
      error: false
    };
  }
  componentWillMount = () => {
    console.log("componentWillMount()");
    var retrievedObject = sessionStorage.getItem('userInfo');
    if(retrievedObject != null) {
      window.alert(retrievedObject + '\nYou are logged in, redirect to chat...');
      window.location = '/chatroom';
    }
  };
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
      error: false
    });
  };

  toggleLogin = e => {
    const _self = this;
    // Math.random().toString(36).substr(2, 5);
    axios.post('/user/login', {
      username: this.state.field_user,
      password: this.state.field_pass,
      updateTime: Date.now()
    })
    .then(function (res) {
      if(res.data != 'not found') { // no error

        sessionStorage.clear(); // clear old data
        var userInfo = { 'username': _self.state.field_user, 
          'password': _self.state.field_pass};
        sessionStorage.setItem('userInfo', JSON.stringify( userInfo ));
        // var retrievedObject = sessionStorage.getItem('userInfo');
        // console.log('retrievedObject: ', JSON.parse(retrievedObject));

        window.alert(userInfo['username'] + ': sign in suceesfully！');
        window.location = '/chatroom';
      } else { // _message is ERROR message, error occurs!
        console.log(res.data);
        window.alert(res.data);
        _self.setState({
          error: true,
          field_user: "",
          field_pass: ""
        });
      }
    })
    .catch(function (error) {
      console.log(error);
    })
    

  };

  signUpPage = e => {
    axios.get('/redirect?page=signup')
    .then(function (res) {
      console.log(res);
      window.location = '/signup';
    })
    .catch(function (error) {
      console.log(error);
    });  
  }

  render() {
    return (
      <Dialog 
        open 
        onRequestClose={this.toggleLogin}
        fullScreen={this.props.fullScreen}>
        <DialogTitle>login</DialogTitle>
        <DialogContent>
          <DialogContentText>
          Please enter your nickname and password.
          </DialogContentText>
          <TextField
            autoFocus
            error={this.state.error}
            margin="dense"
            id="username"
            label="Nick name"
            type="username"
            value={this.state.field_user}
            onChange={this.handleChange('field_user')}
            fullWidth
          />
          <TextField
            autoFocus
            error={this.state.error}
            margin="dense"
            id="password"
            label="password"
            type="password"
            value={this.state.field_pass}
            onChange={this.handleChange('field_pass')}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.signUpPage} color="secondary">            
            register
          </Button>
          <Button onClick={this.toggleLogin} color="primary">
            confirmation
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default Login;