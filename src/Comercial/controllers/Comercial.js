import axios from "axios";
let url = `http://164.152.245.77:8000/quality/concentrador`;
class CormercialControllers {

    async getListaEmpresaComercial(req, res) {
        let { idMarca, idEmpresa, ufProd, page, pageSize } = req.query;
       
          
            try {
                const apiUrl = `${url}/api/comercial/empresa.xsjs?idmarca=${idMarca}`;
                // const response = await getEmpresas(idMarca, idEmpresa, ufProd, page, pageSize)
                const response = await axios.get(apiUrl)
                return res.json(response.data); // Retorna
            } catch (error) {
                console.error("Unable to connect to the database:", error);
                throw error;
            }
        
    }

}

export default new CormercialControllers();
