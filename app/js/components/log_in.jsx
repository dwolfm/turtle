'use strict';

var React   = require('react'                );
var Fluxxor = require('fluxxor'              );
var auth    = require('../stores/user_stores');

var FluxMixin       = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
import { Router, Route, Link, Navigation } from 'react-router';

var Login = React.createClass({
  mixins: [FluxMixin, Navigation],

  getInitialState: function() {
    return {user: {username: '', password: ''}};
  },

  handleChange: function(event) {
    var stateCopy = this.state;
    stateCopy.changed = true;
    if (event.target.name === 'user-username')
      stateCopy.user.username = event.target.value;
    if (event.target.name === 'user-password')
      stateCopy.user.password = event.target.value;

    this.setState(stateCopy);
  },

  handleSubmit: function(event) {
    event.preventDefault();

    var email = findDOMNode(this.refs.email).value;
    var pass = findDOMNode(this.refs.pass).value;

    auth.onLogin(email, pass, function(loggedIn){
      if(!loggedIn)
        return this.setState({error: true});

      var {location} = this.props;

      if(location.state && location.state.nextPathname){
        this.replaceWith(location.state.nextPathname);
      } else {
        this.replaceWith('/dashboard');
      }
    });

    this.getFlux().actions.login(this.state.user);
  },

  render: function() {
    var usernameError;
    var passwordError;
    var submitButton;
    if (this.state.user.username.length < 1 && this.state.changed)
      usernameError = <span>user name cannot be blank</span>;
    if (this.state.user.password.length < 1 && this.state.changed)
      passwordError = <span>password cannot be blank</span>;
    if (usernameError || passwordError && !this.state.changed)
      submitButton = <button type="submit" disabled>Log In to Exising User</button>;
    else
      submitButton = <button type="submit" >Log In to Exising User</button>;

    return (
      <form name="signinform" onSubmit={this.handleSubmit}>
        <label htmlFor="username">User Name:</label>{usernameError}<br/>
        <input type="text" name="user-username" id="username" value={this.state.user.username} onChange={this.handleChange} />
        <br/>
        <label htmlFor="password">Password:</label>{passwordError}<br/>
        <input type="password" name="user-password" id="password" value={this.state.user.password} onChange={this.handleChange} /><br/>
        {submitButton}
      </form>
    )
  }
});

module.exports = Login;
