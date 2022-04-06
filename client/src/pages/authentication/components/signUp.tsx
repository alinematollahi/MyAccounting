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
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Spinner from 'react-bootstrap/Spinner';



const ADD_USER = gql`
mutation($name: String , $email: String , $password : String) {
  addUser(userInput:{name: $name, email: $email, password: $password}){
      _id
      name
      email
  }
}
`;

function SignUp(props: { active: any, deactive: any }) {

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
            .then(result=>console.log(result))
            .catch(err=>console.log(err))

        } else {
            alert("Invalid password");
        }
    }

    const showSignUpForm = (error?: string) => {
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
                    <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>

                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <Button variant="contained" type="submit" fullWidth> SIGN UP </Button>
                        </Grid>
                        <Grid item xs={4}>
                            <Button variant="contained" type="button" fullWidth color="secondary" onClick={props.deactive}> CANCEL </Button>
                        </Grid>
                    </Grid>
                </form>
            </div>
        );
    }

    if (loading) {
        return (
            <Box>
                <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Box>
        );
    }

    if (data) {
        console.log("::::::::data:::::::::",data);
        let userID = data.addUser._id;
        dispatch(logIn(userID));

        return (<Navigate to="/enter" />)
    }

    if (props.active) {
        if (error) {          
            return showSignUpForm("** User exists already **");
        } else {
            return showSignUpForm();
        }
    } else {
        return <></>
    }
}

export default SignUp;