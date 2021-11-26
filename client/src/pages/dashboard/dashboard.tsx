import React ,{useEffect, useState} from "react";

import { useAppSelector } from '../../redux/hooks';

import { Navigate } from "react-router";

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { Box } from "@mui/system";

import Balance from "./components/balance";

import ADD_EXP_INC from "./components/add_exp_inc";

function DashboardPage() {


  const isLoggedIn = useAppSelector(reduxStore => reduxStore.logIn.isLoggedIn)

  const [state,setState] = useState({exInOption:'btn'})


  if (!isLoggedIn) {
    return <Navigate to="/auth" />
  }
  
  

let handleADD_EXP_INC = (item:string)=>{
  setState({exInOption:item})
}



  return (
    <Container fixed>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          meno
          
        </Grid>
        <Grid item xs={12} md={6}>
          <Balance />
        </Grid>
        <Grid item xs={12} md={3}>       
          <ADD_EXP_INC option={state.exInOption} handler={handleADD_EXP_INC} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default DashboardPage;