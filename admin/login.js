import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import axios from 'axios'

export class Login extends Component {

    constructor(){
        super();
        this.state = {
            username: '',
            password: '',
            errorMsg: ''
        }
    }

    handleuserName(e){
        this.setState({
            username: e.target.value
        });
    }

    handlepassword(e){
        this.setState({
            password: e.target.value
        });
    }

    login(){
        console.log(this.state)
        axios.post('/maadmin/api/login', {
            username: this.state.username,
            password: this.state.password
        })
        .then((response) => {
            console.log("Login response body:");
            console.log(response.data);
            if (!response.data.success){
                this.setState({
                    errorMsg: 'Username or Password is Incorrect'
                })
            } else {
                this.setState({
                    errorMsg: ''
                })
            }
        });
    }

    render() {
        return (
            <div className="login">
                <h2>System Login</h2>
                <hr></hr>
                <label>Username </label> <input type='text' name='userName' onChange={this.handleuserName.bind(this)}></input>
                <label>Password </label> <input type='password' name='password' onChange={this.handlepassword.bind(this)}></input>
                <br></br>
                <Button variant='info' onClick={this.login.bind(this)}>Log In</Button>
                <p className='error'>{this.state.errorMsg}</p>
            </div>
        )
    }
}

export default Login

const domContainer = document.querySelector('#login');
ReactDOM.render(e(Login), domContainer);