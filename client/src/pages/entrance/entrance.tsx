import React, { useState, useEffect } from "react";

import { useAppSelector } from '../../redux/hooks';

import TextField from '@mui/material/TextField';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Button } from '@mui/material';

import {
    useMutation,
    gql
} from "@apollo/client";

import { Navigate } from "react-router";

import { moneyTypeList, currencyList } from '../../service'
import SavingsTable from "./components/table";


const UPDATE_USER = gql`
mutation($id: ID , $value: Float, $currencyName: String ,$type: String) {
    addInitialIncome(_id: $id , userInput:{incomes:
     {title: "Initial Savings", amount:{value:$value,currencyName:$currencyName,type:$type}}
    }){
      _id
      name
      email
  }
}
`;


function EntrancePage() {

    const ID = useAppSelector(reduxStore => reduxStore.logIn.userID)

    console.log(ID);

    const [addInitialIncome, { data, loading, error }] = useMutation(UPDATE_USER);


    var savings: { savingsAmount: String | null; savingsType: string; savingsCurrency: string; id: number; }[] = [];

    interface StateType {
        amount: String | null
        type: string
        currency: string
        savings: {
            savingsAmount: String | null
            savingsType: string
            savingsCurrency: string
            id: number
        }[]
    }

    const initialState: StateType = {
        savings: [],
        amount: "",
        type: "",
        currency: ""
    }
    const [state, setState] = useState(initialState)



    const addSavingsHandler = () => {

        if (state.amount && state.type && state.currency) {

            let savingItems = {
                savingsAmount: state.amount,
                savingsType: state.type,
                savingsCurrency: state.currency,
                id: Math.random()
            }

            savings.push(savingItems)

            setState({ ...state, savings: savings });

            setState({ ...state, amount: '', type: '', currency: '' });

        }
    }


    useEffect(() => {
        console.log(state);
        savings = state.savings;
    }, [state])



    const getInputValue = (event: React.ChangeEvent<HTMLInputElement>) => {


        console.log("getInputValue");
        

        if (event.target.name == "amount") {
            setState({ ...state, amount: event.target.value })
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

    const removeHandler = (id :number)=>{

        console.log('id:   ',id);
        

        let newSavings = state.savings.filter(item => item.id !== id)
        setState({ ...state, savings: newSavings });

        console.log(state);
        
    }



    const confirmHandler = () => {

        state.savings.map((item) => {

            if (item.savingsAmount !== null)

                addInitialIncome(
                    {
                        variables: {
                            id: ID,
                            value: +item.savingsAmount,
                            currencyName: item.savingsCurrency,
                            type: item.savingsType
                        }
                    }
                )
        })
    }



    if (data) {
        return <Navigate to="/dashboard" />
    }


    return (
        <div>

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

            <Button variant="contained" type="button" fullWidth onClick={addSavingsHandler}>Add</Button>


            <SavingsTable  rowsData={state.savings}  handler={removeHandler}/>
            

            <Button variant="contained" type="button" fullWidth onClick={confirmHandler}>Confirm</Button>

        </div>
    );
}

export default EntrancePage;