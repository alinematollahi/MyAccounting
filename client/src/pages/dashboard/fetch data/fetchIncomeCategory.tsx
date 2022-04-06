import React, { useEffect } from 'react';

import { useAppSelector, useAppDispatch } from '../../../redux/hooks';

import {
    useLazyQuery,
    gql
} from "@apollo/client";

import { getIncomeCategory } from '../../../redux/balance/action'


const GET_USER_INCOME_CATEGORY = gql`
  query($_id: ID) {
    getUserById(_id : $_id){
        incomeCategorys{             
            categoryName
        }
    }
  }
  `

export default function FetchIncomeCategory() {

    const ID = useAppSelector(reduxStore => reduxStore.logIn.userID)

    const dispatch = useAppDispatch();

    const [getUserById, { loading, error, data }] = useLazyQuery(GET_USER_INCOME_CATEGORY)

    useEffect(() => {
        getUserById({ variables: { _id: ID } })

        let incomeCategory = [];
        if (data) {            
            incomeCategory = data.getUserById.incomeCategorys;
            dispatch(getIncomeCategory(incomeCategory));
        }
        return incomeCategory;
    }, [data])
}