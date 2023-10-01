
export const Alerta = ({ children, ...props }) => {
    return (
      <div  { ...props }>
          <span className="text-xs text-red-700">
              { children }
          </span>
      </div> 
    )
  }
  