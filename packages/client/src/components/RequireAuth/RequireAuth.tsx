import React, { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthUserContext } from "../../authContext"

export default function RequireAuth({
    children,
}: {
    children: JSX.Element | JSX.Element[]
}) {
    const { user, setUser } = useContext(AuthUserContext) ?? {}

    if (!user) {
        console.log(`No logged in user: ${user}`)
        return (
            <Navigate
                to="/"
                state={{ from: location.pathname }}
                replace={true}
            />
        )
    }
    return <>{children}</>
}
