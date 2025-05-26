import axios from "axios";

let url = `http://164.152.245.77:8000/quality/concentrador_homologacao`;
class ComprasControllers {

    async getListaFornecedorProduto(req, res) {
        let { idMarca, idFornecedor, idProduto, page, pageSize } = req.query;
        idFornecedor = idFornecedor ? idFornecedor : '';
        idMarca = idMarca ? idMarca : '';
        page = page ? page : '';
        pageSize = pageSize ? pageSize : '';
        idProduto = idProduto ? idProduto : '';

        try {
            const apiUrl = `${url}/api/compras/fornecedor-produto.xsjs?idFornecedor=${idFornecedor}&idProduto=${idProduto}`
            const response = await axios.get(apiUrl)
            // const response = await  getFornecedorProduto(idMarca, idFornecedor, page, pageSize)

            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("um erro de conexão no controller Compras GetListaFornecedor:", error);
            throw error;
        }
    }

    async getListaSubGrupoEstrutura(req, res) {
        let {idSubGrupoEstrutura, descricao, page, pageSize } = req.query;
            idSubGrupoEstrutura = idSubGrupoEstrutura ? idSubGrupoEstrutura : '';
            descricao = descricao ? descricao : '';
            page = page ? page : '';
            pageSize = pageSize ? pageSize : '';
        try {
            const apiUrl = `${url}/api/compras/subgrupoestrutura.xsjs?idSubGrupoExt=${idSubGrupoEstrutura}&descSubGrupoExt=${descricao}`;
            const response = await axios.get(apiUrl)
            // const response = await getSubGrupoEstrutura(idSubGrupoEstrutura, descricao, page, pageSize)

            return res.json(response.data); // Retorna
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            throw error;
        }
    }
}

export default new ComprasControllers();