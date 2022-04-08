import React, { useEffect, useState } from 'react'

import {
    useMutation,
    useLazyQuery,
    gql
} from "@apollo/client";

import { useSelector, useDispatch } from "react-redux";

import { useAppSelector } from '../../../redux/hooks';


import { moneyTypeList, currencyList } from '../../../service';

import { getBalance } from '../../../redux/balance/action'
import TextField from '@mui/material/TextField';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Button, Grid } from '@mui/material';
import MyDatePicker from './myDatePicker';
import { Box } from '@mui/system';
import AddIncomeCategory from './addIncomeCategory';
import FetchIncomeCategory from '../fetch data/fetchIncomeCategory';

const ADD_INCOME = gql`
mutation($id: ID ,$title: String, $date: String, $value: Float, $currencyName: String ,$type: String ,$categoryName: String) {
  updateUser(_id: $id , userInput:{incomes:
     {title: $title, date: $date, amount:{value:$value,currencyName:$currencyName,type:$type}, category:{categoryName:$categoryName}}
    }){
      _id
      name
      incomes{
          amount{
            value
            type
            currencyName
          }
      }
      balance{
          value
          type
          currencyName
      }
  }
}
`;

const RE_GET_USER = gql`
  query($_id: ID) {
    getUserById(_id : $_id){
      balance{
          value
          currencyName
          type
      }
    }
  }
  `

export default function AddIncome(props: { handler: any }) {
    const [updateUser, { data, loading, error }] = useMutation(ADD_INCOME);

    FetchIncomeCategory();

    const incomeCategory: any[] = useAppSelector(reduxStore => reduxStore.balance.incomeCategory);
    console.log('::::::incomeCategory:::::::::',incomeCategory);
    

    const ID = useAppSelector(reduxStore => reduxStore.logIn.userID)


    interface StateType {
        title: String | null
        date: String
        amount: String | null
        type: string
        currency: string
        category: string
    }

    let initialState: StateType = { title: '', date: '', amount: '', type: '', currency: '', category: '' }
    const [state, setState] = useState(initialState);
    const [refreshDate, setRefreshDate] = useState(false);

    const dispatch = useDispatch();

    console.log(data)


    useEffect(() => {
        if (data) {

            let matchItem = false;

            data.updateUser.balance.map(((item: { type: string; currencyName: string; title: any; value: number; }, index: number) => {

                console.log("balance---item", item);


                if (item.type === state.type
                    && item.currencyName === state.currency) {


                    matchItem = true;

                    if (state.amount !== null) {
                        let newbalance = data.updateUser.balance;
                        newbalance[index] = {
                            title: item.title,
                            value: item.value + (+state.amount),
                            currencyName: item.currencyName,
                            type: item.type
                        }
                        dispatch(getBalance(newbalance))
                    }
                }
            }))

            if (!matchItem && state.amount !== null) {
                // income has new currency-type
                let newbalance = data.updateUser.balance;
                newbalance.push({
                    title: state.title,
                    value: +state.amount,
                    currencyName: state.currency,
                    type: state.type
                })
                dispatch(getBalance(newbalance))

                setState(initialState);
            } else {
                setState(initialState);
                setRefreshDate(true);
            }

        }
    }, [data])


    const getInputValue = (event: React.ChangeEvent<HTMLInputElement>) => {

        console.log(event.target);

        switch (event.target.name) {
            case "title": setState({ ...state, title: event.target.value })
                break;
            case "amount":
                setState({ ...state, amount: event.target.value })
                break;
            default:
                break;
        }

    }

    const handleDateInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event) {
            let y = new Date(event.toString()).getFullYear();
            let m = new Date(event.toString()).getMonth();
            let d = new Date(event.toString()).getDate();
            let date = `${d}/${m + 1}/${y}`;
            setState({ ...state, date: date })
        } else {
            let y = new Date().getFullYear();
            let m = new Date().getMonth();
            let d = new Date().getDate();
            let date = `${d}/${m + 1}/${y}`;
            setState({ ...state, date: date })
        }
    }

    const handleSelectChange = (event: SelectChangeEvent) => {
        switch (event.target.name) {
            case "type": setState({ ...state, type: event.target.value })

                break;
            case "currency": setState({ ...state, currency: event.target.value })
                break;
            case "category": setState({ ...state, category: event.target.value })
                break;
            default:
                break;
        }
    }


    const addIncomeHandler = (event: { preventDefault: () => void; }) => {

        event.preventDefault();

        let categoryValue : string ;
        state.category == '' ? (categoryValue = 'Other') : (categoryValue = state.category)

        if (state.title !== '' && state.date !== '' && state.amount !== null && state.currency !== '' && state.type !== '') {

            updateUser(
                {
                    variables: {
                        id: ID,
                        title: state.title,
                        date: state.date,
                        value: +state.amount,
                        currencyName: state.currency,
                        type: state.type,
                        categoryName: categoryValue
                    }
                }
            )
        } else {
            alert('Please fill out all required fields')
        }
    }

    const [openAddCategory,setOpenAddCategory] = useState(false);

    const handleAddCategory = () =>{
        setOpenAddCategory(true);
    }

    const closeAddCategory = () =>{
        setOpenAddCategory(false);
    }

    return (
        <div>
            <form onSubmit={addIncomeHandler}>

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

                <Box width="100%">
                <MyDatePicker event={handleDateInput}
                     refresh={refreshDate}
                     handleRefreshDate={()=>setRefreshDate(false)}
                     />
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

                <Grid container spacing={1}>
                    <Grid item xs={7}>
                        <FormControl margin="normal" fullWidth>
                            <InputLabel id="demo-simple-select-label">Category</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={state.category}
                                label="Category"
                                onChange={handleSelectChange}
                                name="category"
                            >

                                {incomeCategory.map((item, index) => {
                                    return <MenuItem value={item.categoryName} key={index}>{item.categoryName}</MenuItem>
                                })}

                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={5}>
                        <Box mt={3}>
                            <Button variant="contained" type="button" fullWidth onClick={handleAddCategory}>new Category</Button>
                        </Box>
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    <Grid item xs={8}>
                        <Button variant="contained" type="submit" fullWidth color="success"> Add Income </Button>
                    </Grid>
                    <Grid item xs={4}>
                        <Button variant="contained" type="button" onClick={() => {
                            props.handler('btn')
                        }} fullWidth> Cancel</Button>
                    </Grid>
                </Grid>
            </form>
            <AddIncomeCategory active={openAddCategory} deactive={closeAddCategory}/>
        </div>
    )
}
