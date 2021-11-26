import React from 'react'
import AddExpense from './addExpense'
import AddIncome from './addIncome'
import { Box, Button } from '@mui/material';


function Btn() {
    return (
        <Box>
            <Button variant="contained" type="button" color="success" fullWidth >Add Income</Button>
            <Button variant="contained" type="button" fullWidth>Add Expense</Button>
        </Box>
    )
}

interface PropsType {
    option: string
    handler: any
}



export default function ADD_EXP_INC(props: PropsType) {

    switch (props.option) {
        case 'exp':
            return <AddExpense handler={()=>props.handler('btn')} />
        case 'inc':
            return <AddIncome handler={()=>props.handler('btn')} />
        case 'btn':
            return (
                <Box>
                    <Button variant="contained" type="button" color="success" fullWidth onClick={()=>{
                    props.handler('inc')}}>Add Income</Button>
                    <Button variant="contained" type="button" fullWidth onClick={()=>{
                    props.handler('exp')}} >Add Expense</Button>
                </Box>
            )
        default:
            return <div>Loading</div>;
    }
}
