import React, { useState, FormEvent } from "react";

import {
    useMutation,
    gql
} from "@apollo/client";

import { useDispatch } from "react-redux";
import { logIn } from '../../../redux/logIn/actions'
import { Navigate } from "react-router";

import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";




const ADD_USER = gql`
mutation($name: String , $email: String , $password : String) {
  addUser(userInput:{name: $name, email: $email, password: $password}){
      _id
      name
      email
  }
}
`;

function SignUp() {

    const [addUser, { data, loading, error }] = useMutation(ADD_USER);

    const dispatch = useDispatch();

    interface StateType {
        name: String | null
        email: String | null
        password: String | null
        re_password: String | null
    }

    let initialState: StateType = { name: '', email: '', password: '', re_password: '' }
    const [state, setState] = useState(initialState)

    const getInputValue = (event: React.ChangeEvent<HTMLInputElement>) => {

        switch (event.target.name) {
            case "name": setState({ ...state, name: event.target.value })
                break;
            case "email": setState({ ...state, email: event.target.value })
                break;
            case "password": setState({ ...state, password: event.target.value })
                break;
            case "re_password": setState({ ...state, re_password: event.target.value })
                break;
            default:
                break;
        }
    }

    var submitHandler = (event: FormEvent<HTMLFormElement>) => {

        event.preventDefault();

        if (state.password === state.re_password) {
            addUser({
                variables: {
                    name: state.name,
                    password: state.password,
                    email: state.email
                }
            })

        } else {
            alert("Invalid password");
        }
    }


    if (data) {
        console.log(data);
        let userID = data.addUser._id;
        dispatch(logIn(userID));

        return (<Navigate to="/enter" />)
    }

    

    return (
        <div>
            <form onSubmit={submitHandler}>

                <TextField
                    id="outlined-password-input"
                    label="Name"
                    type="text"
                    autoComplete="current-password"
                    value={state.name}
                    name="name"
                    onChange={getInputValue}
                    fullWidth
                    margin="normal"
                />

                <TextField
                    id="outlined-password-input"
                    label="Email"
                    type="text"
                    autoComplete="current-password"
                    value={state.email}
                    name="email"
                    onChange={getInputValue}
                    fullWidth
                    margin="normal"
                />

                <TextField
                    id="outlined-password-input"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    value={state.password}
                    name="password"
                    onChange={getInputValue}
                    fullWidth
                    margin="normal"
                />

                <TextField
                    id="outlined-password-input"
                    label="Repeat Password"
                    type="password"
                    autoComplete="current-password"
                    value={state.re_password}
                    name="re_password"
                    onChange={getInputValue}
                    fullWidth
                    margin="normal"
                />

                <Button variant="contained" type="submit" fullWidth> Sign UP </Button>


                {/*name : <input type="text" ref={node => { if (node) { name = node } }} />
                <br />
                email : <input type="email" ref={node => { if (node) { email = node } }} />
                <br />
                pass : <input type="password" ref={node => { if (node) { password = node } }} />
                <br />
                repeat pass : <input type="password" ref={node => { if (node) { re_password = node } }} />
                <br />
                <button type="submit">Sign UP</button>*/}


            </form>
        </div>
    );

}

export default SignUp;