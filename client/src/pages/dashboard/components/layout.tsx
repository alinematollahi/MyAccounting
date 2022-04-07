import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid/Grid';
import Paper from '@mui/material/Paper';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import InputIcon from '@mui/icons-material/Input';
import IosShareIcon from '@mui/icons-material/IosShare';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import CategoryIcon from '@mui/icons-material/Category';

import Balance from "./balance";
import ADD_EXP_INC from "./add_exp_inc";
import IncomeTable from "./incomeTable";
import ExpenseTable from './expenseTable';
import TransactionsTable from './transactions';
import ExpenseCategoryTable from './expenseCategoryTable';
import AddExpenseCategoryBox from './addExpenseCategoryBox';
import IncomeCategoryTable from './incomeCategoryTable';
import AddIncomeCategoryBox from './addIncomeCategoryBox';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(9)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

export default function Layout() {

    const [state, setState] = React.useState({ option: 'Assets' })
    React.useEffect(() => { }, [state])

    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const iconHandler = (index: any) => {
        switch (index) {
            case 0:
                return <AttachMoneyIcon />
            case 1:
                return <InputIcon />
            case 2:
                return <IosShareIcon />
            case 3:
                return <ImportExportIcon />
            default:
                break;
        }
    }

    const iconHandlerPart2 = (index: any) => {
        switch (index) {
            case 0:
                return <CategoryIcon />
            case 1:
                return <CategoryOutlinedIcon />
            default:
                break;
        }
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: '36px',
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        DASHBOARD
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {['Assets', 'Income History', 'Expense History', 'Transactions'].map((text, index) => (
                        <ListItem button key={text}>
                            <ListItemIcon onClick={() => { setState({ option: text }) }}>
                                {iconHandler(index)}
                            </ListItemIcon>
                            <ListItemText primary={text} onClick={() => { setState({ option: text }) }} />
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    {['Income Category Page','Expense Category Page'].map((text, index) => (
                        <ListItem button key={text}>
                            <ListItemIcon onClick={() => { setState({ option: text }) }}>
                                {iconHandlerPart2(index)}
                            </ListItemIcon>
                            <ListItemText primary={text} onClick={() => { setState({ option: text }) }} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <Content option={state.option} />
            </Box>
        </Box>
    );
}

function Content(props: { option: any }) {

    const [state, setState] = React.useState({ exInOption: 'btn' })
    let handleADD_EXP_INC = (item: string) => {
        setState({ exInOption: item })
    }


    switch (props.option) {
        case 'Assets':
            return (
                <Grid container spacing={10}>
                    <Grid item xs={12} md={7}>
                        <Paper elevation={3}>
                            <Box textAlign='center' fontWeight={775} py={1.5} >
                                YOUR ASSETS
                            </Box>
                            <Balance />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Paper elevation={3}>
                            <Box textAlign='center' fontWeight={775} py={1.5} >
                                ADD A TRANSACTION
                            </Box>
                            <Box mx={5} py={5}>
                                <ADD_EXP_INC option={state.exInOption} handler={handleADD_EXP_INC} />
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            );
        case 'Income History':
            return (
                <Paper>
                    <Box textAlign='center' fontWeight={775} py={1.5} >
                        Incomes History
                    </Box>
                    <IncomeTable />
                </Paper>
            );

        case 'Expense History':
            return (
                <Paper>
                    <Box textAlign='center' fontWeight={775} py={1.5} >
                        Expenses History
                    </Box>
                    <ExpenseTable />
                </Paper>
            );

        case 'Transactions':
            return (
                <Paper>
                    <Box textAlign='center' fontWeight={775} py={1.5} >
                        Transactions
                    </Box>
                    <TransactionsTable />
                </Paper>
            );

        case 'Expense Category Page':
            return (
                <Grid container spacing={5}>
                    <Grid item xs={12} md={7}>
                        <Paper elevation={3}>
                            <Box textAlign='center' fontWeight={775} py={1.5} >
                                CATEGORYS OF YOUR EXPENSES
                            </Box>
                            <ExpenseCategoryTable />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={5} mt={3.5}>
                        <AddExpenseCategoryBox />
                    </Grid>
                </Grid>
            );

            case 'Income Category Page':
                return (
                    <Grid container spacing={5}>
                        <Grid item xs={12} md={7}>
                            <Paper elevation={3}>
                                <Box textAlign='center' fontWeight={775} py={1.5} >
                                    CATEGORYS OF YOUR INCOMES
                                </Box>
                                <IncomeCategoryTable />
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={5} mt={3.5}>
                            <AddIncomeCategoryBox />
                        </Grid>
                    </Grid>
                );
    

        default:
            return <></>
    }
}
