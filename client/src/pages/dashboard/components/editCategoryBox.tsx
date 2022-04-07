import React, { useEffect, useState } from 'react';
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

export default function EditCategoryBox(props: { active: any, deactive: any, oldCategory: string,loading: any, data: any,
    handler: any ,showAlertMessage: string ,setShowAlertMessage: any, showCheckIcon: boolean,categoryList: any}) {

    const [newCategory, setNewCategory] = useState(props.oldCategory);

    console.log("props.oldCategory==============>>>>",props.oldCategory);
    
    
    const getInputValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setNewCategory(event.target.value);
        props.setShowAlertMessage('hidden');
    }

    const handleCategoryValeu = () =>{
        if (!props.categoryList.find((item: any) => item.categoryName == newCategory)) {
            setNewCategory('');
        }
    }

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
                                    <h2>Edit Category Name</h2>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Change Category Name"
                                    type="text"
                                    value={newCategory}
                                    name="title"
                                    onChange={getInputValue}
                                    fullWidth
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={8}>


                                {props.loading && (
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

                                {props.data && props.showCheckIcon && (
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

                                <Button variant="contained" type="submit" fullWidth
                                    disabled={props.loading}
                                    onClick={()=>{
                                        handleCategoryValeu();
                                        props.handler(newCategory)}}>
                                    Save Change
                                </Button>
                            </Grid>
                            <Grid item xs={4}>
                                <Button variant="contained" type="button" onClick={props.deactive} fullWidth> Cancel</Button>
                            </Grid>
                            <Grid item xs={12} sx={{ visibility: props.showAlertMessage }}>
                                <Box textAlign='center' sx={{ color: 'red' }}>
                                    The category already exists
                                </Box>
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