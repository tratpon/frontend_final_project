import { createContext, useContext, useState, useEffect } from "react"
import { auth } from "../firebase";
import { ROLES } from "../app/roles";

const AuthContext = createContext();

export function AuthProvider({ children }) {    

    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const restid = auth.currentUser;
    
    useEffect(() => {            
        console.log(user,restid)
    },[user,restid])
    
    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    )   
}

export const useAuth = () => useContext(AuthContext);