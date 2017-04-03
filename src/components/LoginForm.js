import React, { Component } from 'react';

import TextField from 'material-ui/TextField';

class LoginForm extends Component {
    // <div className='login-form'>
    //   <TextField 
    //     id='login-username' 
    //     name='username' 
    //     floatingLabelText='username'
    //   />
    //   <TextField
    //     id='login-password'
    //     name='password'
    //     floatingLabelText='password'
    //   />
    // <input type='text' name='username2' placeholder='username' />
    // <input type='text' name='password2' placeholder='password' />
  render() {
    const loginFailed =  this.props.failure? <div className='error'>{this.props.failReason || 'login attempt failed'}</div>: null;
    return (
      <div className='login-form'>
        {loginFailed}
        <form action='/api/login' method='post'> 
          <TextField name='username' floatingLabelText='username' />
          <br />
          <TextField name='password' floatingLabelText='password' type='password' />
          <br />
          <input type='submit' value='Submit' />
        </form>
      </div>
    );
  }
}

export default LoginForm;