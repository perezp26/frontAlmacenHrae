import { fetchConToken } from "./fetch";

export const downloadExcelEntradas = async( entradas ) => {
    const data = { entradas }; 
    const url = `excel/excelConsultaEntradas`;
    const resp = await fetchConToken( url, data, 'POST' );
    
    const resObj = await resp.blob();
    
    const urlExcel = window.URL.createObjectURL(new Blob([resObj]))
    const link = document.createElement('a')
    link.href= urlExcel
    link.setAttribute('download','entradas.xlsx')
    document.body.appendChild(link)
    link.click();
}

export const downloadExcelEntradasPanel = async( dateStart, dateEnd ) => {
    const url = `excel/excelEntradasDowload/${dateStart}/${dateEnd}`;
    const resp = await fetchConToken( url );
    
    const resObj = await resp.blob();
    
    const urlExcel = window.URL.createObjectURL(new Blob([resObj]))
    const link = document.createElement('a')
    link.href= urlExcel
    link.setAttribute('download','entradas.xlsx')
    document.body.appendChild(link)
    link.click();
}


export const downloadExcel = async( url, data, nameFile) => {
    const resp = await fetchConToken( url );
    
    const resObj = await resp.blob();
    
    const urlExcel = window.URL.createObjectURL(new Blob([resObj]))
    const link = document.createElement('a')
    link.href= urlExcel
    link.setAttribute('download', nameFile+'.xlsx')
    document.body.appendChild(link)
    link.click();

        // const resp = await fetchConToken( url )
        // const resul = await resp.json()
        // console.log( resul );
}
