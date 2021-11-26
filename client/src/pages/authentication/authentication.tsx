import Login from "./components/logIn";
import SignUp from "./components/signUp";


function AuthenticationPage() {
    return (
        <div>
            <div>

            <Login/>
            </div>
            <div>
            <SignUp />
            </div>    
        </div>
    );
}

export default AuthenticationPage;