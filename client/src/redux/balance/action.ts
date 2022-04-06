export const GET_BALANCE = 'GET_BALANCE';
export const GET_INCOME = 'GET_INCOME';
export const GET_EXPENSE = 'GET_EXPENSE';
export const GET_EXPENSE_CATEGORY = 'GET_EXPENSE_CATEGORY';
export const GET_INCOME_CATEGORY = 'GET_INCOME_CATEGORY';

interface actionType {
    type :String
    payload : number | null
}

interface actionCategoryType {
    type :String
    payload : string | null
}

export function getBalance(balance: number|null):actionType{
    return{
        type: GET_BALANCE,
        payload: balance
    }
}

export function getIncome(income: number|null):actionType{
    return{
        type: GET_INCOME,
        payload: income
    }
}

export function getExpense(expense: number|null):actionType{
    return{
        type: GET_EXPENSE,
        payload: expense
    }
}

export function getExpenseCategory(category: string|null):actionCategoryType{
    return{
        type: GET_EXPENSE_CATEGORY,
        payload: category
    }
}

export function getIncomeCategory(category: string|null):actionCategoryType{
    return{
        type: GET_INCOME_CATEGORY,
        payload: category
    }
}