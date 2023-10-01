import { ErrorMessage, useField } from "formik";


export const MyTextInput = ( { label, labelClassName, ...props} ) => {
    const [ field ] = useField(props);
    
  return (
        <>
            <label 
                htmlFor={ props.id || props.name }
                className= { labelClassName }
            >
                    { label }
            </label>
            <input {...field} {...props} />
            <ErrorMessage name={ props.name} component="span" className="text-xs text-red-700"/>
        </>
  )
}