import { User } from "firebase/auth"
import React from "react"

interface UserStateController {
    user: User | null
    setUser: (user: User | null) => void
}

export const AuthUserContext = React.createContext<UserStateController | null>(
    null
)

export const AuthUserProvider = AuthUserContext.Provider
