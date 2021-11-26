
import { configureStore } from '@reduxjs/toolkit'
import  balanceReducer from './balance/reducer';
import logInReducer from './logIn/reducer';

const store = configureStore({
  reducer: {
    logIn: logInReducer,
    balance: balanceReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store;




/*

import {createStore , combineReducers} from 'redux';


const rootReducer = combineReducers({
    logInReducer,
    balanceReducer
  })

const store = createStore(rootReducer);


export default store;

*/