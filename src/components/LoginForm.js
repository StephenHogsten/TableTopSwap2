import React, { Component } from 'react';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';

import '../scss/LoginForm.scss';

class LoginForm extends Component {
  constructor({match}) {
    super();
    let error;
    if (match.params.info) {
      error = JSON.parse(decodeURIComponent(match.params.info));
      error = error.hasOwnProperty('message')? error = error.message: JSON.stringify(error);
    }
    this.state = {
      userError: '',
      passwordError: '',
      errorInfo: error
    };
  }
  submitForm(isCreateMode) {
    let username = document.getElementById('form-username').value
    let usernameProblem = (username === '');
    let passwordProblem = (document.getElementById('form-password').value === '');
    if (usernameProblem || passwordProblem) {
      this.setState({
        userError: usernameProblem? 'username field is required': '',
        passwordError: passwordProblem? 'password field is required': ''
      });
      return;
    }
    let form = document.getElementById('login-form');
    if (isCreateMode) {
      form.action = '/api/add_user';
    }
    document.getElementById('login-form').submit();
  }
  render() {
    const loginFailed =  !this.state.errorInfo? null: (
      <Paper style={{backgroundColor:'rgba(255,100,100,0.4)'}} className='login-failed-message'>
        <p className='login-failed-text'>Login Failed: <em>{this.state.errorInfo}</em></p>
      </Paper>
    );
    return (
      <div className='login-body'>
        {loginFailed}
        <form action='/api/login' id='login-form' method='post'> 
          <TextField 
            name='username' 
            id='form-username'
            errorText={this.state.userError} 
            floatingLabelText='username'
            defaultValue={sessionStorage.getItem('login_user')}
          />
          <br />
          <TextField 
            name='password' 
            id='form-password'
            errorText={this.state.passwordError} 
            floatingLabelText='password' 
            type='password'
          />
          <br />
          <RaisedButton 
            id='login-create-button' 
            secondary={true} 
            label='Create new Account'
            onTouchTap={() => this.submitForm(true)}
            style={{margin:'8px'}}
          />
          <RaisedButton 
            id='login-submit-button'
            primary={true} 
            label='Submit' 
            onTouchTap={() => this.submitForm()}
            style={{margin:'8px'}}
          />
        </form>
      </div>
    );
  }
}

export default LoginForm;