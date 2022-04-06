import { AnyAction } from '@reduxjs/toolkit';
import {GET_BALANCE,GET_INCOME,GET_EXPENSE,GET_EXPENSE_CATEGORY,GET_INCOME_CATEGORY} from './action';

interface BalanceState {
    balance : [number] | [],
    income : [number] | [],
    expense : [number] | [],
    expenseCategory : [string] | [],
    incomeCategory : [string] | [],
}

function balanceReducer(state: BalanceState = {balance:[],income:[],expense:[],expenseCategory:[],incomeCategory:[]},
    action:AnyAction){
    
    console.log("::::::reducer----action:::::::",action)

    switch (action.type) {
        case GET_BALANCE: return {
            ...state,
            balance : action.payload
        }
        case GET_INCOME: return {
            ...state,
            income : action.payload
        }
        case GET_EXPENSE: return {
            ...state,
            expense : action.payload
        }
        case GET_EXPENSE_CATEGORY: return {
            ...state,
            expenseCategory : action.payload
        }
        case GET_INCOME_CATEGORY: return {
            ...state,
            incomeCategory : action.payload
        }
        default:
            return state;
    }
}

export default balanceReducer;