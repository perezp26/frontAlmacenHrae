import { Navigate } from "react-router-dom";

export const PrivateRoute = ( {children, isAuthenticated, isValidPermiso = true } ) => {

    if ( isAuthenticated && isValidPermiso) {
        return children
    }else{
       return <Navigate to="/" />
    }

    // return isAuthenticated 
    //         ? children 
    //         : <Navigate to="/" />
};