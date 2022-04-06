import React, { FormEvent, useState } from "react";

import {
    useLazyQuery,
    gql
} from "@apollo/client";

import { useDispatch, useSelector } from "react-redux";
import { logIn } from '../../../redux/logIn/actions'
import { Navigate } from "react-router";

import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
//import Spinner from 'react-bootstrap/Spinner';

const GET_USER = gql`
query ($email: String , $password : String){
getUser(email:$email,password:$password){
_id
name
email
}
}
`;

function Login(props: { active: any, deactive: any }) {

    const [getUser, { loading, error, data }] = useLazyQuery(GET_USER);
    const dispatch = useDispatch();

    interface StateType {
        email: String | null
        password: String | null
    }

    let initialState: StateType = { email: '', password: '' }
    const [state, setState] = useState(initialState)

    const getInputValue = (event: React.ChangeEvent<HTMLInputElement>) => {

        switch (event.target.name) {
            case "email": setState({ ...state, email: event.target.value })
                break;
            case "password": setState({ ...state, password: event.target.value })
                break;
            default:
                break;
        }
    }

    var submitHandler = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        getUser({ variables: { email: state.email, password: state.password } })
    }

    const showLogInForm = (error?: string) => {
        return (
            <div>
                <form onSubmit={submitHandler}>
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
                    <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <Button variant="contained" type="submit" fullWidth> LOG IN </Button>
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
            <Box >
                <CircularProgress />
            </Box>
        );
    }

    if (data) {
        let userID = data.getUser._id;
        dispatch(logIn(userID));
        return (<Navigate to="/dashboard" />)
    }

    if (props.active) {
        if (error) {
            return showLogInForm("** Ivalid Inputs **");
        } else {
            return showLogInForm();
        }
    } else {
        return <></>
    }
}

export default Login;