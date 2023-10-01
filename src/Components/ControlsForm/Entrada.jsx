
import { utcToZonedTime, toDate} from 'date-fns-tz'

export const Entrada = ({ entrada, _setProducto, setListEntradas }) => {

  const handlesEdit = () =>{
    _setProducto( entrada )
    setListEntradas ( [] )
  }

  const { idEntrada, idProducto, lote, caducidad, unidades, dateRegistro, pallet, totalUnidadesSalidas, codigoProducto, descripcionProducto, descripcionUbicacion,precio,iva } = entrada
  return (
    <tr className={`border-b text-center hover:bg-gray-100 font-light ${toDate(utcToZonedTime(caducidad,'')) <= toDate(utcToZonedTime(new Date(),'')) && ' text-red-700' }` }>
        <td className="p-3">{ `${codigoProducto}-${descripcionProducto}` }</td>
        <td className="p-3">{ dateRegistro }</td>
        <td className="p-3">{ lote }</td>
        <td className={"p-3"}>{ caducidad }</td>
        <td className={"p-3"}>{ precio }</td>
        <td className="p-3">{ unidades - (!!totalUnidadesSalidas ? totalUnidadesSalidas : 0) }</td>
        <td className="p-3 bg-green-700 text-white hover:bg-green-500 transition "><button type="button" onClick={ handlesEdit } >SELECCIONAR</button></td>
    </tr>
  )
}