export const GET_BALANCE = 'GET_BALANCE';

interface actionType {
    type :String
    payload : number | null
}

export function getBalance(balance: number|null):actionType{
    return{
        type: GET_BALANCE,
        payload: balance
    }
}
