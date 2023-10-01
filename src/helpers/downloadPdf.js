import { fetchConToken } from "./fetch";

export const downloadPdf = async( endpoint, pallet ) => {
        //--->Descargar Pdf<------//

        const url = `pdf/${ endpoint }`;
        const resp = await fetchConToken( url, pallet, 'POST' );
        
        const resObj = await resp.blob();
        
        const urlPdf = window.URL.createObjectURL(new Blob([resObj]))
        const link = document.createElement('a')
        link.href= urlPdf
        link.setAttribute('download','etiqueta.pdf')
        document.body.appendChild(link)
        link.click();
}

export const dowloadPdfGet = async(url,archiveName) => {
        console.log(url,archiveName);
        const resp = await fetchConToken( url );
        
        const resObj = await resp.blob();
        
        const urlPdf = window.URL.createObjectURL(new Blob([resObj]))
        const link = document.createElement('a')
        link.href= urlPdf
        link.setAttribute('download',`${archiveName}.pdf`)
        document.body.appendChild(link)
        link.click();
}