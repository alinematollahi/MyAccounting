import React, { useState } from "react";
import { Grid } from "@mui/material";
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import Login from "./components/logIn";
import SignUp from "./components/signUp";


function AuthenticationPage() {
    const [isLogInPushed, setIsLogInPushed] = useState(false);
    const [isSignUpPushed, setIsSignUpPushed] = useState(false);
    const [changeMenuDisplay, setchangeMenuDisplay] = useState('block');


    const loginbtnHandler = () => {
        setIsLogInPushed(true);
        setchangeMenuDisplay('none');
    }
    const cancelLoginHandler = () => {
        setIsLogInPushed(false);
        setchangeMenuDisplay('block');
    }
    const signUpbtnHandler = () => {
        setIsSignUpPushed(true);
        setchangeMenuDisplay('none');
    }
    const cancelSignUpHandler = () => {
        setIsSignUpPushed(false);
        setchangeMenuDisplay('block');
    }

    return (
        <Container fixed>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                    <Box color="" fontSize={30} mt={10} textAlign="center">
                        WELCOME TO MYACCOUNTING APPLICATION
                    </Box>
                </Grid>
                <Grid item xs={12} sm={4} mt={10}>
                    <Paper elevation={3}>
                        <Box textAlign="center" pt={2}>
                            {isLogInPushed ?
                                (<h1>Log In</h1>) :
                                isSignUpPushed ?
                                    (<h1>Sign Up</h1>) :
                                    (<h1>Authentication</h1>)}
                        </Box>

                        <Box m={5} pb={5}>
                            <Stack spacing={4} display={changeMenuDisplay}>
                                <Button variant="contained" fullWidth onClick={loginbtnHandler}>LOG IN </Button>
                                <Box mx="auto" textAlign="center">OR</Box>
                                <Button variant="contained" fullWidth onClick={signUpbtnHandler}>SIGN UP </Button>
                            </Stack>
                            <Login active={isLogInPushed} deactive={cancelLoginHandler} />
                            <SignUp active={isSignUpPushed} deactive={cancelSignUpHandler} />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}

export default AuthenticationPage;