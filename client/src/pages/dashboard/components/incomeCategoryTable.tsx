import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useAppSelector } from '../../../redux/hooks';
import FetchIncomeCategory from '../fetch data/fetchIncomeCategory';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditCategoryBox from './editCategoryBox';
import { useMutation, gql } from "@apollo/client";
import { useDispatch } from 'react-redux';
import { getIncomeCategory } from '../../../redux/balance/action';
import RemoveIncomeCategory from './removeIncomeCategory';

const EDIT_INCOME_CATEGORY = gql`
mutation($id: ID , $newCategoryName: String ,$oldCategoryName: String) {
    editUser(_id: $id , userEdit:{
        oldIncomeCategorys:{categoryName:$oldCategoryName}
        newIncomeCategorys:{categoryName:$newCategoryName}
    }){
        incomeCategorys{             
            categoryName
        }
    }
}
`;


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

export default function IncomeCategoryTable() {

    const [editUser, { data, loading, error }] = useMutation(EDIT_INCOME_CATEGORY);
    const ID = useAppSelector(reduxStore => reduxStore.logIn.userID)

    FetchIncomeCategory();

    const categoryList = useAppSelector(reduxStore => reduxStore.balance.incomeCategory);

    const [selectedCategory, setSelectedCategory] = React.useState('');
    const [showAlertMessage, setShowAlertMessage] = React.useState('hidden');
    const [showCheckIcon, setShowCheckIcon] = React.useState(true);


    const [openEditCategory, setOpenEditCategory] = React.useState(false);
    const [openRemoveCategory, setOpenRemoveCategory] = React.useState(false);

    const dispatch = useDispatch();

    React.useEffect(() => {
        if (data) {
            console.log("data==========>>", data);

            dispatch(getIncomeCategory(data.editUser.incomeCategorys));

            setTimeout(() => {
                setShowCheckIcon(false);
            }, 2000)

            //setPreviewCategory('');
        }
    }, [data])


    function createData(
        category: string,
    ) {
        return { category };
    }

    var rows: any[] | [] = [];

    console.log(":::::::::::categoryList::::::::::::;", categoryList);


    if (categoryList) {

        categoryList.map((item: { categoryName: string }, index: number) => {
            //   let categoryValue;
            //   item.category ? (categoryValue = item.category.categoryName) : (categoryValue = '---')
            rows[index] = createData(item.categoryName)
        });

        const handleEdit = (category: any) => {
            console.log(':::::category::::;;', category);
            setSelectedCategory(category);
            setOpenEditCategory(true);
        }

        const handleRemove = (category: any) => {
            console.log(':::::category::::;;', category);
            setSelectedCategory(category);
            setOpenRemoveCategory(true);
        }

        const editCategoryHandler = (newCategory: any) => {
            console.log(newCategory);
            if (newCategory !== '')
                if (!categoryList.find((item: any) => item.categoryName == newCategory)) {
                    editUser(
                        {
                            variables: {
                                id: ID,
                                oldCategoryName: selectedCategory,
                                newCategoryName: newCategory
                            }
                        }
                    )
                    setShowCheckIcon(true);
                } else {
                    setShowAlertMessage('visible');
                }
        }

        return (
            <div>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center">CATEGORY NAME</StyledTableCell>
                                <StyledTableCell align="center">EDIT</StyledTableCell>
                                <StyledTableCell align="center">REMOVE</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell component="th" scope="row" align="center">
                                        {row.category}
                                    </StyledTableCell>
                                    <StyledTableCell align="center"
                                        onClick={() => handleEdit(row.category)}
                                        sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#bbb' } }}>
                                        <ModeEditOutlinedIcon />
                                    </StyledTableCell>
                                    <StyledTableCell align="center"
                                        onClick={() => handleRemove(row.category)}
                                        sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#bbb' } }}>
                                        <DeleteOutlineIcon />
                                    </StyledTableCell>

                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <EditCategoryBox
                    active={openEditCategory}
                    deactive={()=>setOpenEditCategory(false)}
                    oldCategory={selectedCategory}
                    loading={loading}
                    data={data}
                    handler={editCategoryHandler}
                    showAlertMessage={showAlertMessage}
                    setShowAlertMessage={(arg: string) => setShowAlertMessage(arg)}
                    showCheckIcon={showCheckIcon}
                    categoryList={categoryList}
                />
                <RemoveIncomeCategory
                    active={openRemoveCategory}
                    deactive={()=>setOpenRemoveCategory(false)}
                    categoryName={selectedCategory}
                />
            </div>
        );
    } else {
        return <p>LOADING</p>
    }
}