import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useAppSelector, useAppDispatch } from '../../../redux/hooks';


import {
    useLazyQuery,
    gql
} from "@apollo/client";

import { getExpense } from '../../../redux/balance/action'


const GET_USER = gql`
  query($_id: ID) {
    getUserById(_id : $_id){
        expenses{
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

export default function FetchExpense() {

    const ID = useAppSelector(reduxStore => reduxStore.logIn.userID)

    const dispatch = useAppDispatch();

    const [getUserById, { loading, error, data }] = useLazyQuery(GET_USER)

    useEffect(() => {
        getUserById({ variables: { _id: ID } })

        let expense = [];
        if (data) {
            console.log("::::::::data.getUserById:::::::",data.getUserById);
            
            expense = data.getUserById.expenses;
            dispatch(getExpense(expense));
        }
        return expense;
    }, [data])
}