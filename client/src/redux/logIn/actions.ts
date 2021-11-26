export const LOG_IN = 'LOG_IN';

interface actionType {
    type :String
    payload : String | null
}

export function logIn(userID:String | null):actionType{
    return {
        type : LOG_IN,
        payload: userID
    }
}