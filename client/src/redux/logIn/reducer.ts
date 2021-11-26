import { AnyAction } from '@reduxjs/toolkit';
import { LOG_IN } from './actions';

interface LogInState {
    userID : String | null
    isLoggedIn: Boolean
}

function logInReducer(state :LogInState = {userID : null, isLoggedIn: false},
     action:AnyAction):LogInState{

         /*{ type: String; payload: String | null; }*/ 

    console.log(action)

    switch (action.type) {
        
        case LOG_IN : return {
            ...state,
            isLoggedIn: true,
            userID : action.payload
        }
        default:
            return state;
    }
}


export default logInReducer;