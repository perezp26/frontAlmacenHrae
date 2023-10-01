import { format, utcToZonedTime, toDate} from 'date-fns-tz'

export const BitacoraEntrada = ({ bitacora }) => {

    const { unidades, punidad, pesoTotal, userUpdate, dateUpdate } =bitacora
    const date = format(utcToZonedTime(new Date(dateUpdate),''),"yyyy-MM-dd HH:mm:ss").toString()

  return (
        <tr className={`border-b hover:bg-gray-100 font-light text-xs `}>
            <td className="p-3">{ Number(unidades).toFixed(2) }</td>
            <td className={`p-3`}>{  userUpdate }</td>
            <td className="p-3">{ date }</td>
        </tr>
      )
}
