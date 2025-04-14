'use client'

import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";
import { AuthToken, User } from "./types";
import { LoginResponseI } from "@/interfaces/login.interface";

interface AuthProviderProps {
    children :ReactNode
}

interface AuthContextProps {
    user :User | undefined
    setUser :Dispatch<SetStateAction<User | undefined>>
    token :AuthToken | undefined
    setToken :Dispatch<SetStateAction<AuthToken | undefined>>
    loginResponse :LoginResponseI | undefined
    setLoginResponse :Dispatch<SetStateAction<LoginResponseI | undefined>>
}

export const AuthContext = createContext({} as AuthContextProps)

export function AuthProvider({ children } :AuthProviderProps) {

    const [ user, setUser ] = useState<User>()
    const [ token, setToken ] = useState<AuthToken>()
    const [ loginResponse, setLoginResponse ] = useState<LoginResponseI>()
    

    return(
        <AuthContext.Provider value={{
            user, setUser,
            token, setToken,
            loginResponse, setLoginResponse
        }}>
            { children }
        </AuthContext.Provider>
    )
}