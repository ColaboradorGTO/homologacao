import conn from "../../config/dbConnection.js";
import 'dotenv/config';
const databaseSchema = process.env.HANA_DATABASE;

export const incluirMecanicaResumoPromocao = async (idResumoPromocao, tpAplicada, tpFatorPromo, tpApartirde) => {
    try {
        const queryId = `
            SELECT IFNULL(MAX(TO_INT("IDMECANICARESUMOPROMOCAOMARKETING")),0) + 1 AS NEXT_ID
            FROM "${databaseSchema}"."MECANICARESUMOPROMOCAOMARKETING" WHERE 1 = ?
        `;

        const queryInsert = `INSERT INTO "${databaseSchema}"."MECANICARESUMOPROMOCAOMARKETING" 
            ( 
                "IDMECANICARESUMOPROMOCAOMARKETING",
                "IDRESUMOPROMOCAOMARKETING",
                "TPAPLICADOA", 
                "TPFATORPROMO", 
                "TPAPARTIRDE",
                "STATIVO" 
            ) 
            VALUES(?,?,?,?,?, 'True')
        `;

        const statementId = await conn.prepare(queryId);
        const statementEstilo = await conn.prepare(queryInsert);

        const idResult = await statementId.exec([1]);
        const id = idResult[0].NEXT_ID;

        await statementEstilo.exec([
            id,
            idResumoPromocao,
            tpAplicada,
            tpFatorPromo,
            tpApartirde,
        ]);
 
        conn.commit();
        return {
            status: 'success',
            message: 'Mecânica de promoção incluída com sucesso',
            id: id 
        };
    } catch (e) {
        console.error('Erro ao incluir mecânica de promoção:', e);
        throw new Error(`Erro ao incluir mecânica de promoção: ${e.message}`);
    }
}

export const incluirDetalheEmpresaPromocaoMarketing = async (idResumoPromocao, idEmpresas, stEmpresaPromocao) => {
    try {
        const queryId = `
            SELECT IFNULL(MAX(TO_INT("IDEMPRESAPROMOCAOMARKETING")),0) + 1 AS NEXT_ID
            FROM "${databaseSchema}"."EMPRESAPROMOCAOMARKETING" WHERE 1 = ?
        `;
        const queryInsert = `INSERT INTO "${databaseSchema}"."EMPRESAPROMOCAOMARKETING" 
            ( 
                "IDRESUMOPROMOCAOMARKETING", 
                "IDEMPRESAPROMOCAOMARKETING", 
                "IDEMPRESA", 
                "STATIVO" 
            ) 
            VALUES(?,?,?,?) 
        `;

        const statementId = conn.prepare(queryId);
        const statementEstilo = conn.prepare(queryInsert);

        for (const idEmpresa of idEmpresas) {
            const idResult = await (await statementId).exec([1]);
            const id = idResult[0].NEXT_ID;
          
            await (await statementEstilo).exec([
                idResumoPromocao,
                id,
                idEmpresa,
                stEmpresaPromocao,
            ]);
        }

        conn.commit();
        return {
            status: 'success',
            message: 'Promoção criada com sucesso',
        };
    } catch (e) {
        throw new Error(`Erro ao criar Promoção: ${e.message}`);
    }
}

export const incluirDetalhePromocaoMarketingDestino = async (idResumoPromocao, idGrupo, idSubGrupo, idMarca, idFornecedor, idProdutos, stEmpresaDestino) => {
    try {
        const queryId = `
            SELECT IFNULL(MAX(TO_INT("IDDETALHEPROMOCAOMARKETINGDESTINO")),0) + 1 AS NEXT_ID
            FROM "${databaseSchema}"."DETALHEPROMOCAOMARKETINGDESTINO" WHERE 1 = ?
        `;
        const queryInsert = `INSERT INTO "${databaseSchema}"."DETALHEPROMOCAOMARKETINGDESTINO" 
            ( 
                "IDDETALHEPROMOCAOMARKETINGDESTINO", 
                "IDRESUMOPROMOCAOMARKETING", 
                "IDGRUPOEMDESTINO", 
                "IDSUBGRUPOEMDESTINO", 
                "IDMARCAEMDESTINO", 
                "IDFORNECEDOREMDESTINO", 
                "IDPRODUTODESTINO", 
                "STATIVO" 
            ) 
            VALUES(?,?,?,?,?,?,?,?) 
        `;

        const statementId = await conn.prepare(queryId);
        const statementEstilo = await conn.prepare(queryInsert);

        for (const idProduto of idProdutos) {
            const idResult = await statementId.exec([1]);
            const id = idResult[0].NEXT_ID;

            await statementEstilo.exec([
                id,
                idResumoPromocao,
                idGrupo || -1,
                idSubGrupo || -1,
                idMarca || -1,
                idFornecedor || -1,
                idProduto || 'NULL',
                stEmpresaDestino,
            ]);
        }

        conn.commit();
        return {
            status: 'success',
            message: 'Promoção criada com sucesso',
        };
    } catch (e) {
        throw new Error(`Erro ao criar Promoção: ${e.message}`);
    }
}

export const incluirDetalhePromocaoMarketingOrigem = async (idResumoPromocao, idGrupo, idSubGrupo, idMarca, idFornecedor, idProdutosOrigem, stEmpresaOrigem) => {

    try {
        const queryId = `
            SELECT IFNULL(MAX(TO_INT("IDDETALHEPROMOCAOMARKETINGORIGEM")),0) + 1 AS NEXT_ID
            FROM "${databaseSchema}"."DETALHEPROMOCAOMARKETINGORIGEM" WHERE 1 = ?
        `;

        const queryInsert = `INSERT INTO "${databaseSchema}"."DETALHEPROMOCAOMARKETINGORIGEM" 
            ( 
                "IDDETALHEPROMOCAOMARKETINGORIGEM", 
                "IDRESUMOPROMOCAOMARKETING", 
                "IDGRUPOEMORIGEM", 
                "IDSUBGRUPOEMORIGEM", 
                "IDMARCAEMORIGEM", 
                "IDFORNECEDOREMORIGEM", 
                "IDPRODUTOORIGEM", 
                "STATIVO" 
            ) 
            VALUES(?,?,?,?,?,?,?,?) 
        `;

        const statementId = await conn.prepare(queryId);
        const statementEstilo = await conn.prepare(queryInsert);

        for (const idProdutoOrigem of idProdutosOrigem) {
            const idResult = await statementId.exec([1]);
            const id = idResult[0].NEXT_ID;

            await statementEstilo.exec([
                id,
                idResumoPromocao,
                idGrupo || -1,
                idSubGrupo || -1,
                idMarca || -1,
                idFornecedor || -1,
                idProdutoOrigem || 'NULL',
                stEmpresaOrigem
            ]);
        }

        conn.commit();
        return {
            status: 'success',
            message: 'Promoção criada com sucesso',
        };
    } catch (e) {
        throw new Error(`Erro ao criar Promoção: ${e.message}`);
    }
}

export const incluirDetalhePromocao = async (idResumoPromocao, idProdutos) => {
    try {
        const queryId = `
            SELECT IFNULL(MAX(TO_INT("IDDETALHEPROMO")),0) + 1 AS NEXT_ID
            FROM "${databaseSchema}"."DETALHEPROMOCAO" WHERE 1 = ?
        `;

        const queryInsert = `INSERT INTO "${databaseSchema}"."DETALHEPROMOCAO" 
            ( 
                "IDDETALHEPROMO", 
                "IDRESUMOPROMO", 
                "IDPRODUTO" 
            ) 
            VALUES(?,?,?) 
        `;

        const statementId = await conn.prepare(queryId);
        const statementEstilo = await conn.prepare(queryInsert);

        for (const idProduto of idProdutos) {
            const idResult = await statementId.exec([1]);
            const id = idResult[0].NEXT_ID;

            await statementEstilo.exec([
                id,
                idResumoPromocao,
                idProduto || 'NULL',
            ]);
        }

        conn.commit();
        return {
            status: 'success',
            message: 'Promoção criada com sucesso',
        };
    } catch (e) {
        throw new Error(`Erro ao criar Promoção: ${e.message}`);
    }
}

export const createPromocao = async (dados) => {
    try {
        const queryId = `
            SELECT IFNULL(MAX(TO_INT("IDRESUMOPROMOCAOMARKETING")),0) + 1 AS NEXT_ID
            FROM "${databaseSchema}"."RESUMOPROMOCAOMARKETING" WHERE 1 = ?
        `;

        const queryInsert = `INSERT INTO "${databaseSchema}"."RESUMOPROMOCAOMARKETING" 
            ( 
                "IDRESUMOPROMOCAOMARKETING", 
                "DSPROMOCAOMARKETING", 
                "DTHORAINICIO", 
                "DTHORAFIM", 
                "TPAPLICADOA", 
                "APARTIRDEQTD", 
                "APARTIRDOVLR", 
                "TPFATORPROMO", 
                "FATORPROMOVLR", 
                "FATORPROMOPERC", 
                "TPAPARTIRDE", 
                "VLPRECOPRODUTO", 
                "STEMPRESAPROMO",
                "STDETPROMOORIGEM",
                "STDETPROMODESTINO",
                "IDMECANICARESUMOPROMOCAOMARKETING"
            ) 
            VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) 
        `;

        const statementId = await conn.prepare(queryId);
        const statementEstilo = await conn.prepare(queryInsert);

        for (const registro of dados) {
            const idResult = await statementId.exec([1]);
            const id = idResult[0].NEXT_ID;

            const mecanicaResponse = await incluirMecanicaResumoPromocao(
                id,
                registro.TPAPLICADOA,
                registro.TPFATORPROMO,
                registro.TPAPARTIRDE
            );
            
            const idMecanica = mecanicaResponse.id;

            const params = [
                id,
                registro.DSPROMOCAOMARKETING,
                registro.DTHORAINICIO,
                registro.DTHORAFIM,
                Number(registro.TPAPLICADOA),
                Number(registro.APARTIRDEQTD), 
                Number(registro.APARTIRDOVLR),
                Number(registro.TPFATORPROMO),
                Number(registro.FATORPROMOVLR),
                Number(registro.FATORPROMOPERC),
                Number(registro.TPAPARTIRDE),
                Number(registro.VLPRECOPRODUTO),
                registro.STEMPRESAPROMO,
                registro.STDETPROMOORIGEM,
                registro.STDETPROMODESTINO,
                idMecanica
            ];

            try {
                await statementEstilo.exec(params);
            } catch (e) {
                console.error('Erro no parametros', params);
                throw e;
            }

            await incluirDetalheEmpresaPromocaoMarketing(
                id, 
                Array.isArray(registro.IDEMPRESA) ? registro.IDEMPRESA : [registro.IDEMPRESA],
                registro.STEMPRESAPROMO
            );

            await incluirDetalhePromocaoMarketingDestino(
                id, 
                Number(registro.IDGRUPOEMDESTINO),
                Number(registro.IDSUBGRUPOEMDESTINO),
                Number(registro.IDMARCAEMDESTINO),
                Number(registro.IDFORNECEDOREMDESTINO),
                registro.IDPRODUTODESTINO,
                registro.STDETPROMODESTINO
            );

            await incluirDetalhePromocaoMarketingOrigem(
                id, 
                Number(registro.IDGRUPOEMORIGEM),
                Number(registro.IDSUBGRUPOEMORIGEM),
                Number(registro.IDMARCAEMORIGEM),
                Number(registro.IDFORNECEDOREMORIGEM),
                registro.IDPRODUTOORIGEM,
                registro.STDETPROMOORIGEM
            );

            await incluirDetalhePromocao(
                id, 
                registro.IDPRODUTO,
            );
        }

        await conn.commit();
        return {
            data: dados,
            status: 'success',
            message: 'Promoção criada com sucesso',
        };
    } catch (e) {
        console.error('Error in createPromocao:', e);
        throw new Error(`Erro ao criar Promoção: ${e.message}`);
    }
};


// SELECT IDRESUMOPROMOCAOMARKETING, DSPROMOCAOMARKETING, DTHORAINICIO, DTHORAFIM, TPAPLICADOA, APARTIRDEQTD, APARTIRDOVLR, TPFATORPROMO, FATORPROMOVLR, FATORPROMOPERC, TPAPARTIRDE, VLPRECOPRODUTO, STEMPRESAPROMO, STDETPROMOORIGEM, STDETPROMODESTINO
// FROM QUALITY_CONC_TST.RESUMOPROMOCAOMARKETING;

// SELECT IDEMPRESAPROMOCAOMARKETING, IDRESUMOPROMOCAOMARKETING, IDEMPRESA, STATIVO
// FROM QUALITY_CONC_TST.EMPRESAPROMOCAOMARKETING;

// SELECT IDDETALHEPROMOCAOMARKETINGDESTINO, IDRESUMOPROMOCAOMARKETING, IDGRUPOEMDESTINO, IDSUBGRUPOEMDESTINO, IDMARCAEMDESTINO, IDFORNECEDOREMDESTINO, IDPRODUTODESTINO, STATIVO
// FROM QUALITY_CONC_TST.DETALHEPROMOCAOMARKETINGDESTINO;

// SELECT IDDETALHEPROMOCAOMARKETINGORIGEM, IDRESUMOPROMOCAOMARKETING, IDGRUPOEMORIGEM, IDSUBGRUPOEMORIGEM, IDMARCAEMORIGEM, IDFORNECEDOREMORIGEM, IDPRODUTOORIGEM, STATIVO
// FROM QUALITY_CONC_TST.DETALHEPROMOCAOMARKETINGORIGEM;

// SELECT IDDETALHEPROMO, IDRESUMOPROMO, IDPRODUTO
// FROM QUALITY_CONC_TST.DETALHEPROMOCAO;



// Quais as tabelas que são atualizadas quando uma promoção é criada?
// RESUMOPROMOCAOMARKETING e EMPRESAPROMOCAOMARKETING e DETALHEPROMOCAOMARKETINGDESTINO  e DETALHEPROMOCAOMARKETINGORIGEM

// Quais os parametros pra saber se a promoção é ativa ou não?


// estes são os paramatros que são passados para o PDV paara criar a mecanica de promoção

//  TPAPARTIRDE = 0 // aplicação destino por pares
//  TPAPARTIRDE = 1 // aplicação destino em todos os produtos
//  TPAPARTIRDE = 2 // aplicação destino no ultimo após entrada da promoção
//  TPAPARTIRDE = 3 // aplicação destino menos na primeira
//  TPAPARTIRDE = 4 // aplicação destino em 1(um) produto

// TABELAS RESUMOPROMOCAOMARKETING
// TPAPLICADOA = 1->APLICADO A VALOR // 2-> APLICADO A QUANTIDADE
// TPFATORPROMO = USADO PARA O PDV IDENTIFICAR A PROMOCAO
// 	TPFATORPROMO = 0 // por valor final
//  TPFATORPROMO = 1 // por valor desconto
// 	TPFATORPROMO = 2 // por percentual desconto



// CREATE TABLE QUALITY_CONC_TST.MECANICARESUMOPROMOCAOMARKETING (
//     IDMECANICARESUMOPROMOCAOMARKETING INT NOT NULL,
//     TPAPLICADOA1 INT NOT NULL,
//     TPAPLICADOA2 INT NOT NULL,
//     TPFATORPROMO0  INT NOT NULL,
//     TPFATORPROMO1  INT NOT NULL,
//     TPFATORPROMO2 INT NOT NULL,
//     TPAPARTIRDE0 INT NOT NULL,
//     TPAPARTIRDE1 INT NOT NULL,
//     TPAPARTIRDE2 INT NOT NULL,
//     TPAPARTIRDE3 INT NOT NULL,
//     TPAPARTIRDE4 INT NOT NULL,
//     STATIVO VARCHAR(5),
// );

// CRIAÇÃO DA LOGICA DA MECANICA DE PROMOÇÃO NO PDV

/*
pegando por base as regras acima, da mecânica de promoção, o que será feito é o seguinte:
TPAPLICADOA = 1->APLICADO A VALOR // 2-> APLICADO A QUANTIDADE será ou no valor ou na quantidade
depois o usuario irá escolher 
TPAPARTIRDE = 0 aplicação destino por pares, se o usuario escolher
TPAPARTIRDE = 1 aplicação destino em todos os produtos, se o usuario escolher
TPAPARTIRDE = 2 aplicação destino no ultimo após entrada da promoção, se o usuario escolher
TPAPARTIRDE = 3 aplicação destino menos na primeira, se o usuario escolher
TPAPARTIRDE = 4 aplicação destino em um produto 


*/
// 1. CRIAR A TABELA MECANICARESUMOPROMOCAOMARKETING E COLOCAR O ID DA MECANICA NA TABELA RESUMOPROMOCAOMARKETING
// 2. OS CAMPOS DE APILCAÇÕES SERÃO VISIVEL CONFORME A SELEÇÃO DA MECANICA
// 3. CAMPOS PRODUTO ORIGEM SERÁ PARA SALVAR APENAS O IDPRODUTOORIGEM QUE É O IDPRODUTO
// 4. A MECANICA SERÁ SALVA NA TABELA EMPRESAPROMOCAOMARKETING NESTE CASO CASO NÃO SERÁ NECESSARIO SALVAR IDEMPRESADESTINO E IDEMPRESAPROMOCAOMARKETING
// E SALVANDO APENAS OS CAMPOS DE INFORMAÇÕES NA EMPRESAPROMOCAOMARKETING


