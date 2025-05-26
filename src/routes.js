import { Router } from 'express';
import ApiPing from './controllers/ApiPing.js';
import AuthentiCationController from './Auth/controllers/Auth.js';
import InformaticaControllers from './Informatica/controllers/Informatica.js';
import ComercialControllers from './Comercial/controllers/Comercial.js';
import ComprasControllers from './Compras/controllers/Compras.js';
import LogsControllers from './LogsUsuario/controllers/log.js';
import PromocaoControllers from './Promocao/controllers/Promocao.js';

const routes = new Router();
// routes.use(authMiddleware)

routes.get('/', (req, res) => {
    res.send('Hello World! Myltiane');
});

routes.get('/ping', ApiPing.index);

routes.post('/login', AuthentiCationController.login);
routes.post('/login2', AuthentiCationController.login2);
routes.get('/marcasLista', InformaticaControllers.getListaMarcas)
routes.get('/listaEmpresaComercial', ComercialControllers.getListaEmpresaComercial)
routes.get('/fornecedor-produto', ComprasControllers.getListaFornecedorProduto)
routes.get('/subGrupoEstrutura', ComprasControllers.getListaSubGrupoEstrutura)
routes.get('/promocoes-ativas', PromocaoControllers.getListaPromocoesAtivas)
routes.post('/criar-promocoes-ativas', PromocaoControllers.postPromocao)
routes.put('/promocoes-ativas/:id', PromocaoControllers.putPromocao)

// // Logs
// routes.get('/log-web', LogsControllers.getListaLogsUsuario)
routes.post('/log-web', LogsControllers.createLogsUsuario)


 
export default routes;

    