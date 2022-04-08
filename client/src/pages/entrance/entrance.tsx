import React, {FormEvent, useState, useEffect } from "react";

import { useAppSelector } from '../../redux/hooks';

import TextField from '@mui/material/TextField';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Button } from '@mui/material';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';


import {
    useMutation,
    gql
} from "@apollo/client";

import { Navigate } from "react-router";
import { Link } from "react-router-dom"

import { moneyTypeList, currencyList } from '../../service'
import SavingsTable from "./components/table";


const UPDATE_USER = gql`
mutation($id: ID , $value: Float, $currencyName: String ,$type: String , $date: String) {
    addInitialIncome(_id: $id , userInput:{incomes:
     {title: "Initial Savings", date: $date, amount:{value:$value,currencyName:$currencyName,type:$type}, category:{categoryName:"Initial Savings"}}
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
        currency: "",
    }
    const [state, setState] = useState(initialState);

    const [showTable, setShowTable] = useState('none');
    const [formWidth, setFormWidth] = useState(6);
    const [btn, setBtn] = useState({ width: '50%', showBtn1: "block", showBtn2: "none" });
    const [text, setText] = useState('Add your savings here');
    const [skipStep, setSkipStep] = useState(false);



    const addSavingsHandler = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (state.amount && state.type && state.currency) {

            let match = false;
            let matchIndex: number = -1;

            savings.map((item, index) => {
                if (item.savingsType == state.type && item.savingsCurrency == state.currency) {
                    match = true;
                    matchIndex = index;
                }
            })

            if (match) {
                savings[matchIndex].savingsAmount = state.amount;
            } else {
                let savingItems = {
                    savingsAmount: state.amount,
                    savingsType: state.type,
                    savingsCurrency: state.currency,
                    id: Math.random()
                }
                savings.push(savingItems)
            }

            setState({ ...state, savings: savings });
            setState({ ...state, amount: '', type: '', currency: '' });

            setShowTable('block');
            setFormWidth(4);
            setBtn({ width: '100%', showBtn1: "none", showBtn2: "block" });
            setText('Add more savings')
        }
    }


    useEffect(() => {
        console.log(state);
        savings = state.savings;
    }, [state, skipStep])



    const getInputValue = (event: React.ChangeEvent<HTMLInputElement>) => {

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

    const removeHandler = (id: number) => {

        console.log('id:   ', id);
        let newSavings = state.savings.filter(item => item.id !== id)
        setState({ ...state, savings: newSavings });
    }

    let y = new Date().getFullYear();
    let m = new Date().getMonth();
    let d = new Date().getDate();
    let initialDate = `${d}/${m + 1}/${y}`;

    const confirmHandler = () => {

        if (state.savings.length > 0) {
            state.savings.map((item) => {

                if (item.savingsAmount !== null) {

                    addInitialIncome(
                        {
                            variables: {
                                id: ID,
                                value: +item.savingsAmount,
                                currencyName: item.savingsCurrency,
                                type: item.savingsType,
                                date: initialDate
                            }
                        }
                    )
                }
            })
        } else {
            setSkipStep(true);
        }
    }

    if (data) {
        return <Navigate to="/dashboard" />
    }


    return (
        <Container fixed>

            <div>{skipStep && <Navigate to="/dashboard" />}</div>

            <Grid container spacing={5}>
                <Grid item xs={12} sm={formWidth} mt={5} mx="auto">
                    <form onSubmit={addSavingsHandler}>
                        <Box textAlign="center">
                            <h2>{text}</h2>
                        </Box>
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

                        <Button variant="contained" type="submit" fullWidth >Add</Button>
                    </form>
                </Grid>
                <Grid item sm={8} xs={12} mt={16} display={showTable}>
                    <SavingsTable rowsData={state.savings} handler={removeHandler} />
                </Grid>
                <Grid item xs={12} mt={3} mx="auto">
                    <Box mx="auto" width={btn.width} display={btn.showBtn1}>
                        <Link to={"/dashboard"} style={{ textDecoration: 'none' }}>
                            <Button variant="contained" type="button" color="secondary" fullWidth>Continue (skip this step)</Button>
                        </Link>

                    </Box>
                    <Box mx="auto" width={btn.width} display={btn.showBtn2}>
                        <Button variant="contained" type="button" color="success" fullWidth onClick={confirmHandler}>Confirm</Button>
                    </Box>

                </Grid>
            </Grid>

        </Container>
    );
}

export default EntrancePage;