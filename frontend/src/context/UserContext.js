import { createContext, useState } from "react";
import jwt_decode from "jwt-decode";

export const UserContext = createContext();

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);

    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
    const tokenValue = tokenCookie ? tokenCookie.split('=')[1] : null;
    if(!user){
        if(tokenValue){
            const decodedToken = jwt_decode(tokenValue);
            setUser(decodedToken);
        }
    }

    return(
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}