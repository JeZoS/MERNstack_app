import React,{Fragment,useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {login} from '../../action/auth';

const Login = ({login,isAuthenticated}) => {
	const [fromData,setFormData]=useState({
		email:'',
		password:'',
	});

	const {email,password} = fromData;

	const onChange = e => setFormData({...fromData, [e.target.name]:e.target.value });
	
	const onSubmit = async e =>{
		e.preventDefault();
      login(email,password);
  };
  //Redirect
  if(isAuthenticated){
    return <Redirect to='/dashboard' />
  }

	return(
		<Fragment>
	 	<section className="container">
      		<h1 className="large text-primary">Sign In</h1>
      		<p className="lead"><i className="fas fa-user"></i> Log into Your Account</p>
         <form className="form" action="create-profile.html" onSubmit={e=>onSubmit(e)} >
        <div className="form-group">
          <input type="email" placeholder="Email Address" name="email"  value={email} onChange={e => onChange(e)} required />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
             value={password} onChange={e => onChange(e)} required
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to='/register'>Sign up</Link>
      </p>
    </section>
	 	</Fragment>
	)
}

login.PropTypes = {
  login : PropTypes.func.isRequired,
  isAuthenticated : PropTypes.bool  
}

const mapStateToProps = state => ({
  isAuthenticated : state.auth.isAuthenticated
});


export default connect(mapStateToProps,{login})(Login) 