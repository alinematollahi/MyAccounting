import React, { useEffect, useState } from 'react';

import {
    useMutation,
    gql
} from "@apollo/client";

import { useDispatch } from "react-redux";
import { useAppSelector } from '../../../redux/hooks';
import { getIncomeCategory } from '../../../redux/balance/action';
import TextField from '@mui/material/TextField';
import { Box, Button, Grid } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import { green } from '@mui/material/colors';
import Fab from '@mui/material/Fab';
import CheckIcon from '@mui/icons-material/Check';

const ADD_INCOME_CATEGORY = gql`
mutation($id: ID , $categoryName: String) {
    updateUser(_id: $id , userInput:{incomeCategorys:
       {categoryName:$categoryName}
    }){
        incomeCategorys{             
            categoryName
        }
    }
}
`;


export default function AddIncomeCategoryBox() {

    const [updateUser, { data, loading, error }] = useMutation(ADD_INCOME_CATEGORY);

    const ID = useAppSelector(reduxStore => reduxStore.logIn.userID)
    const categoryList = useAppSelector(reduxStore => reduxStore.balance.incomeCategory);

    const [newCategory, setNewCategory] = useState('');
    const [showCheckIcon, setShowCheckIcon] = useState(true);
    const [showAlertMessage, setShowAlertMessage] = useState('hidden');

    const getInputValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewCategory(event.target.value);
        setShowAlertMessage('hidden');
    }

    const addIncomeCategoryHandler = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (newCategory !== '')
            if (!categoryList.find((item: any) => item.categoryName == newCategory)) {
                updateUser(
                    {
                        variables: {
                            id: ID,
                            categoryName: newCategory
                        }
                    }
                )
                setShowCheckIcon(true);
            } else {
                setShowAlertMessage('visible');
            }
    }

    const dispatch = useDispatch();

    useEffect(() => {
        if (data) {
            dispatch(getIncomeCategory(data.updateUser.incomeCategorys));

            setTimeout(() => {
                setShowCheckIcon(false);
            }, 2000)

            setNewCategory('');
        }
    }, [data])

    return (
        <Paper elevation={3}>
            <Grid container spacing={3} p={5} pt={1}>
                <Grid item xs={12}>
                    <Box textAlign="center" pt={0.5}>
                        <h2>Add a new Category</h2>
                    </Box>
                </Grid>
                <Grid item xs={12} sx={{minHeight:'90px'}}>
                    {loading && (
                        <CircularProgress
                            size={68}
                            sx={{
                                color: green[500],
                                position: 'relative',
                                top: '0%',
                                left: '50%',
                                marginTop: '-12px',
                                marginLeft: '-12px',
                                zIndex: 1,
                            }}
                        />
                    )}

                    {data && showCheckIcon && (
                        <Fab
                            aria-label="save"
                            color='primary'
                            sx={{
                                bgcolor: green[500],
                                '&:hover': {
                                    bgcolor: green[700],
                                },
                                position: 'relative',
                                top: '0%',
                                left: '50%',
                                marginTop: '-12px',
                                marginLeft: '-12px',
                                zIndex: 1,
                            }}
                        >
                            <CheckIcon sx={{ fontSize: 50 }} />
                        </Fab>
                    )
                    }
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="New Category"
                        type="text"
                        value={newCategory}
                        name="title"
                        onChange={getInputValue}
                        fullWidth
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" type="submit" fullWidth
                        disabled={loading}
                        onClick={addIncomeCategoryHandler}>
                        Add
                    </Button>
                </Grid>
                <Grid item xs={12} sx={{ visibility: showAlertMessage }}>
                    <Box textAlign='center' sx={{ color: 'red' }}>
                        The category already exists
                    </Box>
                </Grid>

            </Grid>
        </Paper>
    );

}