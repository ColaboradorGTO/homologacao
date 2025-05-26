
import { getGrupoEmpresa } from "../Marcas/grupoEmpresa.js";
let url = `http://164.152.245.77:8000/quality/concentrador`;

class InformaticaControllers {

    async getListaMarcas(req, res) {
         let {  } = req.query;
        try {
            // const apiUrl = `${url}/api/grupo-empresarial.xsjs`
            // const response = await axios.get(apiUrl)
            const response = await getGrupoEmpresa()
            
            return res.json(response); 
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }
}

export default new InformaticaControllers();