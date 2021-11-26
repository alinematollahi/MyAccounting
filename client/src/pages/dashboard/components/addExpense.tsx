import React, { ChangeEvent, useEffect, useState } from 'react';

import {
    useMutation,
    gql
} from "@apollo/client";

import { useSelector, useDispatch } from "react-redux";

import { useAppSelector } from '../../../redux/hooks';


import { moneyTypeList, currencyList } from '../../../service';

import { getBalance } from '../../../redux/balance/action';
import TextField from '@mui/material/TextField';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Button, Grid } from '@mui/material';



const ADD_EXPENSE = gql`
mutation($id: ID ,$title: String, $value: Float, $currencyName: String ,$type: String) {
  updateUser(_id: $id , userInput:{expenses:
     {title: $title, amount:{value:$value,currencyName:$currencyName,type:$type}}
    }){
      _id
      name
      balance{
        value
        type
        currencyName
    }
  }
}
`;

export default function AddExpense(props: { handler: any }) {

    const [updateUser, { data, loading, error }] = useMutation(ADD_EXPENSE);

    const ID = useAppSelector(reduxStore => reduxStore.logIn.userID)

    interface StateType {
        title: String | null
        amount: String | null
        type: string
        currency: string
    }

    let initialState: StateType = { title: '', amount: '', type: '', currency: '' }
    const [state, setState] = useState(initialState)


    const dispatch = useDispatch();


    useEffect(() => {
        if (data) {
            console.log(data.updateUser.balance);
            data.updateUser.balance.map(((item: { type: string; currencyName: string; title: any; value: number; }, index: number) => {

                if (item.type === state.type && item.currencyName === state.currency) {

                    let newbalance = data.updateUser.balance;

                    if (state.amount !== null)
                        newbalance[index] = {
                            title: item.title,
                            value: item.value - (+state.amount),
                            currencyName: item.currencyName,
                            type: item.type
                        }
                    dispatch(getBalance(newbalance))
                }
            }))

            setState(initialState);
        }
    }, [data])


    const getInputValue = (event: React.ChangeEvent<HTMLInputElement>) => {

        switch (event.target.name) {
            case "title": setState({ ...state, title: event.target.value })

                break;
            case "amount": setState({ ...state, amount: event.target.value })
                break;
            default:
                break;
        }
    }

    const handleSelectChange = (event: SelectChangeEvent) => {
        switch (event.target.name) {
            case "type": setState({ ...state, type: event.target.value })

                break;
            case "currency": setState({ ...state, currency: event.target.value })
                break;
            default:
                break;
        }
    }


    const addExpenseHandler = (event: { preventDefault: () => void; }) => {

        event.preventDefault();

        if (state.amount !== null)

            updateUser(
                {
                    variables: {
                        id: ID,
                        title: state.title,
                        value: +state.amount,
                        currencyName: state.currency,
                        type: state.type
                    }
                }
            )
    }

    return (
        <div>
            <form onSubmit={addExpenseHandler}>

                <TextField
                    id="outlined-password-input"
                    label="title"
                    type="text"
                    autoComplete="current-password"
                    value={state.title}
                    name="title"
                    onChange={getInputValue}
                    fullWidth
                    margin="normal"
                />

                <TextField
                    id="outlined-password-input"
                    label="amount"
                    autoComplete="current-password"
                    value={state.amount}
                    name="amount"
                    onChange={getInputValue}
                    fullWidth
                    margin="normal"
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                />


                <FormControl fullWidth margin="normal">
                    <InputLabel id="demo-simple-select-label">Type</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={state.type}
                        label="Type"
                        onChange={handleSelectChange}
                        name="type"
                    >

                        {moneyTypeList.map((item, index) => {
                            return <MenuItem value={item} key={index}>{item}</MenuItem>
                        })}

                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="demo-simple-select-label">Currency</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={state.currency}
                        label="Currency"
                        onChange={handleSelectChange}
                        name="currency"
                    >

                        {currencyList.map((item, index) => {
                            return <MenuItem value={item} key={index}>{item}</MenuItem>
                        })}

                    </Select>
                </FormControl>

                <Grid container spacing={3}>
                    <Grid item xs={8}>
                        <Button variant="contained" type="submit" fullWidth> Add Expense</Button>
                    </Grid>
                    <Grid item xs={4}>
                        <Button variant="contained" type="button" onClick={() => {
                            props.handler('btn')
                        }} fullWidth> Cancel</Button>
                    </Grid>
                </Grid>



            </form>
        </div>
    )
}

