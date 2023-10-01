import { useState } from "react";

export const UseForm = ( initialState = {} ) => {
    

    const [values, setValues] = useState(initialState);

    const reset = ( dataRest = initialState) => {
        setValues( dataRest );
    }

    const handleInputChange = (name, value) =>{
        setValues({
            ...values,
            [ name ] : value
        })

    }

    return [ values, handleInputChange, reset]

};
