import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export const useUser = () => {
    const context = useContext(UserContext);

    if(context === undefined){
        throw new Error(`useUser() must be used inside a UserProvdider`)
    }

    return context;
}