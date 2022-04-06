import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useAppSelector, useAppDispatch } from '../../../redux/hooks';


import {
    useLazyQuery,
    gql
} from "@apollo/client";

import { getBalance, getIncome } from '../../../redux/balance/action'


const GET_USER = gql`
  query($_id: ID) {
    getUserById(_id : $_id){
        incomes{
            title
            date  
            amount{
                value
                currencyName
                type
            }
            category{
                categoryName
            }
        }
    }
  }
  `

export default function FetchIncome() {

    const ID = useAppSelector(reduxStore => reduxStore.logIn.userID)

    const dispatch = useAppDispatch();

    const [getUserById, { loading, error, data }] = useLazyQuery(GET_USER)

    useEffect(() => {
        getUserById({ variables: { _id: ID } })

        let income = [];
        if (data) {
            console.log("::::::::data.getUserById:::::::",data.getUserById);
            
            income = data.getUserById.incomes;
            dispatch(getIncome(income));
        }
        return income;
    }, [data])
}