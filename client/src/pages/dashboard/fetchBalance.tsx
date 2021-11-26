import React, {useEffect} from 'react';
import { useSelector , useDispatch} from 'react-redux';

import { useAppSelector , useAppDispatch } from '../../redux/hooks';


import {
    useLazyQuery,
    gql
} from "@apollo/client";

import { getBalance } from '../../redux/balance/action'


const GET_USER = gql`
  query($_id: ID) {
    getUserById(_id : $_id){
      balance{
          value
          currencyName
          type
      }
    }
  }
  `

  export default function FetchBalance(){

    const ID = useAppSelector(reduxStore => reduxStore.logIn.userID)

    const dispatch = useAppDispatch();


    const [getUserById, { loading, error, data }] = useLazyQuery(GET_USER)

    useEffect(()=>{
    getUserById({ variables: { _id: ID } })

    let balance= [];
    if(data){

        balance = data.getUserById.balance;
        dispatch(getBalance(balance));
    }

    return balance;

    },[data]) 
  }