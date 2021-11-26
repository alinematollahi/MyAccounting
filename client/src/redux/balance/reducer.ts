import { AnyAction } from '@reduxjs/toolkit';
import {GET_BALANCE} from './action';

interface BalanceState {
    balance : [number] | []
}

function balanceReducer(state: BalanceState = {balance:[]},
    action:AnyAction){
    
    console.log(action)

    switch (action.type) {
        case GET_BALANCE: return {
            ...state,
            balance : action.payload
        }

        default:
            return state;
    }

}


export default balanceReducer;