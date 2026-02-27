import { createContext, useContext, useState ,useEffect } from "react"
import { ROLES } from "../app/roles";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(ROLES.ADVISOR);
    
    useEffect(()=>{
        console.log(user)
    },[user])

    return (
        <AuthContext.Provider value={{user, setUser}}>
            {children}
        </AuthContext.Provider>
    )   
}

export const useAuth = () => useContext(AuthContext);