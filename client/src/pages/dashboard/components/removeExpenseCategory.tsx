import React, { useEffect, useState } from 'react';

import {
    useMutation,
    gql
} from "@apollo/client";

import { useDispatch } from "react-redux";
import { useAppSelector } from '../../../redux/hooks';
import { getExpenseCategory } from '../../../redux/balance/action';
import TextField from '@mui/material/TextField';
import { Box, Button, Grid } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import { green } from '@mui/material/colors';
import Fab from '@mui/material/Fab';
import CheckIcon from '@mui/icons-material/Check';

const REMOVE_EXPENSE_CATEGORY = gql`
mutation($id: ID , $categoryName: String) {
    removeUserItem(_id: $id , removeItem:{expenseCategory:
       {categoryName:$categoryName}
    }){
        expenseCategorys{             
            categoryName
        }
    }
}
`;


export default function RemoveExpenseCategory(props: { active: any, deactive: any, categoryName: string }) {

    const [removeUserItem, { data, loading, error }] = useMutation(REMOVE_EXPENSE_CATEGORY);
    const ID = useAppSelector(reduxStore => reduxStore.logIn.userID)

    const [showCheckIcon, setShowCheckIcon] = useState(true);

    const removeExpenseCategoryHandler = (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        removeUserItem(
            {
                variables: {
                    id: ID,
                    categoryName: props.categoryName
                }
            }
        )
        setShowCheckIcon(true);
    }

    const dispatch = useDispatch();

    useEffect(() => {
        if (data) {

            dispatch(getExpenseCategory(data.removeUserItem.expenseCategorys));

            setTimeout(() => {
                setShowCheckIcon(false);
                props.deactive();
            }, 2000)
        }
    }, [data])



    if (props.active) {
        return (
            <div>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={props.active}
                >
                    <Paper elevation={3}>
                        <Grid container spacing={3} p={5}>
                            <Grid item xs={12}>
                                <Box textAlign="center" pt={2}>
                                    <h2>Are You Sure to Remove The Category?? </h2>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                {loading && (
                                    <CircularProgress
                                        size={68}
                                        sx={{
                                            color: green[500],
                                            position: 'absolute',
                                            top: '43%',
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
                                            position: 'absolute',
                                            top: '43%',
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
                            <Grid item xs={6}>

                                <Button variant="contained" type="submit" fullWidth
                                    disabled={loading}
                                    onClick={removeExpenseCategoryHandler}>
                                    Remove
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button variant="contained" type="button" onClick={props.deactive} fullWidth> Cancel</Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Backdrop>
            </div>
        );
    } else {
        return <></>
    }


}