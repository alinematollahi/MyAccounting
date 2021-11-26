import React , {FormEvent,useState} from "react";

import {
    useLazyQuery,
    gql
} from "@apollo/client";


import { useDispatch , useSelector } from "react-redux";
import {logIn} from '../../../redux/logIn/actions'
import { Navigate } from "react-router";

import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";



const GET_USER = gql`
query ($email: String , $password : String){
getUser(email:$email,password:$password){
_id
name
email
}
}
`;

function Login() {

    const [getUser, { loading, error, data }] = useLazyQuery(GET_USER);

    const dispatch = useDispatch();
    //const ID = useSelector((state)=>state.logInReducer.userID)
    //const isLogedIn = useSelector((state)=>state.logInReducer.isLogedIn)

    interface StateType {
        email: String | null
        password: String | null
    }

    let initialState: StateType = { email: '', password: ''}
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



    var  submitHandler = (event : FormEvent<HTMLFormElement>) => {

        event.preventDefault();

        getUser({ variables: { email: state.email, password: state.password } })
            
    }


    if (loading) return <p>Loading ...</p>;
    if (error) return <p>error : {error}</p>;

    if(data) {   
 
        let userID = data.getUser._id;
        dispatch(logIn(userID));
        return(<Navigate to="/dashboard" />)
    }
    
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
                 <Button variant="contained"  type="submit" fullWidth> LOG IN </Button>
            </form>

        </div>
    );

}

export default Login;