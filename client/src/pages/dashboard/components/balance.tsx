import React from 'react';

import { useAppSelector } from '../../../redux/hooks';

/*

export function Balanuytrce() {



    const balance = useAppSelector(reduxStore => reduxStore.balance.balance);



    if (balance) {
        console.log(balance);
        return (
            <div>
                <ul>
                    {balance.map((item: { value: string; currencyName: string; type: string; }, index: number) => {
                        return <li key={index}>{item.value + " " + item.currencyName + " " + item.type}</li>
                    })}
                </ul>
            </div>
        );
    } else {
        console.log("balance not found");

        return <p>LOADING</p>

    }

}

*/

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import FetchBalance from '../fetchBalance';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));



export default function Balance() {

    FetchBalance();


    const balance = useAppSelector(reduxStore => reduxStore.balance.balance);

    function createData(
        value: string,
        currencyName: string,
        type: string,

    ) {
        return { value, currencyName, type };
    }

    var rows: any[] | [] = [];

    balance.map((item: { value: string; currencyName: string; type: string; }, index: number) => {
        rows[index] = createData(item.value, item.currencyName, item.type)
    });

    /*  sx={{ minWidth: 700 }}   */

    if (balance) {

        console.log('balance is:', balance);

        return (
            <TableContainer component={Box} >
                <Table aria-label="customized table">
                    <TableBody>
                        {rows.map((row, index) => (
                            <StyledTableRow key={index}>
                                <StyledTableCell component="th" scope="row">
                                    {row.value}
                                </StyledTableCell>
                                <StyledTableCell align="right">{row.currencyName}</StyledTableCell>
                                <StyledTableCell align="right">{row.type}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    } else {
        console.log("balance not found");

        return <p>LOADING</p>
    }
}
