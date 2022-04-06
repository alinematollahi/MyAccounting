import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FetchExpense from '../fetch data/fetchExpense';
import { useAppSelector } from '../../../redux/hooks';

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
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function ExpenseTable() {

  FetchExpense();

  const expense = useAppSelector(reduxStore => reduxStore.balance.expense);

  function createData(
    title: String,
    date: String,
    value: string,
    currencyName: string,
    type: string,
    category: string,
  ) {
    return { title, date, value, currencyName, type, category };
  }

  var rows: any[] | [] = [];

  console.log(":::::::::::expense::::::::::::;", expense);


  if (expense) {

    expense.map((item: { title: String, date: String, amount: { value: string, currencyName: string, type: string }, category: {categoryName:string} }, index: number) => {
      let categoryValue;
      item.category ? (categoryValue = item.category.categoryName) : (categoryValue = '---')
      rows[index] = createData(item.title, item.date, item.amount.value, item.amount.currencyName, item.amount.type, categoryValue)
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

    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
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
              <StyledTableRow key={row.name}>
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
