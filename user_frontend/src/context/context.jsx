import { createContext, useState } from "react";

export const Context = createContext();

const ContextProvider = (props) => {
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : "");

    const value = {
        token, setToken
    }
    return (
        <Context.Provider value={value}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;