export const customStyles = {
    option: (provided, state) => ({
        ...provided,
        borderBottom: '1px dotted pink',
        color: state.isSelected ? 'red' : 'blue',
        fontSize: '11px'
      })
}

export const customStylesControl = {
    borderRadius: "7px", 
    padding:"3px", 
    backgroundColor:'#e5e7eb', 
    marginBottom: '20px'
}