import { createContext } from "react";

export const Context = createContext();

const ContextProvider = (props) => {
    const value = {

    }
    return (
        <Context.Provider value={value}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;