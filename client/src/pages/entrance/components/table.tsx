import React from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';




interface PropsType {
    rowsData: {
        savingsAmount: String | null
        savingsType: string
        savingsCurrency: string
        id: number
    }[]
    handler: any
}


export default function SavingsTable(props: PropsType) {


    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell align="right">Currency</TableCell>
                        <TableCell align="right">Type</TableCell>
                        <TableCell align="right">Remove Item</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.rowsData.map((row, index) => (
                        <TableRow
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                Initial Savings
                            </TableCell>
                            <TableCell align="right">{row.savingsAmount}</TableCell>
                            <TableCell align="right">{row.savingsCurrency}</TableCell>
                            <TableCell align="right">{row.savingsType}</TableCell>
                            <TableCell align="right" onClick={() => { props.handler(row.id) }}>remove</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

}