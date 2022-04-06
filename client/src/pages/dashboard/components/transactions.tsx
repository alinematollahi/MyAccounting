import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FetchIncome from '../fetch data/fetchIncome';
import { useAppSelector } from '../../../redux/hooks';
import FetchExpense from '../fetch data/fetchExpense';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "gray",
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    /*
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    */
    //backgroundColor: "greenyellow",
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export default function TransactionsTable() {

    FetchIncome();
    FetchExpense();

    const income = useAppSelector(reduxStore => reduxStore.balance.income);
    const expense = useAppSelector(reduxStore => reduxStore.balance.expense);

    function createData(
        trxType: String,
        trxColor: String,
        title: String,
        date: String,
        value: string,
        currencyName: string,
        type: string,
        category: string,
    ) {
        return { trxType, trxColor, title, date, value, currencyName, type, category };
    }

    var rows: any[] | [] = [];



    console.log(":::::::::::income::::::::::::;", income);


    if (income && expense) {

        let transactions: any[] = [];

        income.forEach((element: any) => {
            element = { ...element, trxType: 'income', trxColor: 'rgba(112, 241, 181, 0.3)' }
            transactions.push(element)
        });

        expense.forEach((element: any) => {
            element = { ...element, trxType: 'expense', trxColor: 'rgba(241, 161, 161, 0.3)' }
            transactions.push(element)
        });

        console.log(":::::::::::transactions::::::::::::;", transactions);



        transactions.map((item: { trxType: String, trxColor: String, title: String, date: String, amount: { value: string, currencyName: string, type: string }, category: { categoryName: string } }, index: number) => {
            let categoryValue;
            item.category ? (categoryValue = item.category.categoryName) : (categoryValue = '---')
            rows[index] = createData(item.trxType, item.trxColor, item.title, item.date, item.amount.value, item.amount.currencyName, item.amount.type, categoryValue)
        });

        // set sorting according to date (from new date to old date)
        rows = rows.sort((a, b): any => {
            let t1 = '';
            let t2 = '';
            let firstItem = 0;
            let lastItem = 0;
            if (b.date !== null) {
                t1 = b.date.split('/');
                firstItem = new Date(t1[1] + '/' + t1[0] + '/' + t1[2]).getTime();
            }
            if (a.date !== null) {
                t2 = a.date.split('/');
                lastItem = new Date(t2[1] + '/' + t2[0] + '/' + t2[2]).getTime();
            }
            return firstItem - lastItem
        });

        console.log(":::::::::::rows::::::::::::;", rows);


        return (
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">TRX TYPE</StyledTableCell>
                            <StyledTableCell align="center">TITLE</StyledTableCell>
                            <StyledTableCell align="center">DATE</StyledTableCell>
                            <StyledTableCell align="center">AMOUNT</StyledTableCell>
                            <StyledTableCell align="center">CURRENCY</StyledTableCell>
                            <StyledTableCell align="center">TYPE</StyledTableCell>
                            <StyledTableCell align="center">CATEGORY</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <StyledTableRow key={row.name} style={{ backgroundColor: row.trxColor }} >
                                <StyledTableCell align="center">{row.trxType}</StyledTableCell>
                                <StyledTableCell component="th" scope="row" align="center">
                                    {row.title}
                                </StyledTableCell>
                                <StyledTableCell align="center">{row.date}</StyledTableCell>
                                <StyledTableCell align="center">{row.value}</StyledTableCell>
                                <StyledTableCell align="center">{row.currencyName}</StyledTableCell>
                                <StyledTableCell align="center">{row.type}</StyledTableCell>
                                <StyledTableCell align="center">{row.category}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    } else {
        return <p>LOADING</p>
    }
}
