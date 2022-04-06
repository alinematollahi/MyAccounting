import React, { useEffect } from 'react';

import { useAppSelector, useAppDispatch } from '../../../redux/hooks';

import {
    useLazyQuery,
    gql
} from "@apollo/client";

import { getExpenseCategory } from '../../../redux/balance/action'


const GET_USER_EXPENSE_CATEGORY = gql`
  query($_id: ID) {
    getUserById(_id : $_id){
        expenseCategorys{             
            categoryName
        }
    }
  }
  `

export default function FetchExpenseCategory() {

    const ID = useAppSelector(reduxStore => reduxStore.logIn.userID)

    const dispatch = useAppDispatch();

    const [getUserById, { loading, error, data }] = useLazyQuery(GET_USER_EXPENSE_CATEGORY)

    useEffect(() => {
        getUserById({ variables: { _id: ID } })

        let expenseCategory = [];
        if (data) {            
            expenseCategory = data.getUserById.expenseCategorys;
            dispatch(getExpenseCategory(expenseCategory));
        }
        return expenseCategory;
    }, [data])
}