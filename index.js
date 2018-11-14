//modulos
const express = require('express')
const app = express()
const port = process.env.PORT || 3456
const gtts = require('node-gtts')('pt-br')
const mysql = require('mysql')

//
app.get('/', function (req, res) {

    res.send('servidor_TSS_oline!')

});


app.get('/Produto/:codBarras?', (req, res) =>{

    console.log('Parametro req: '+req.params.codBarras)

    let filter = '';
    if(req.params.codBarras) filter = ' WHERE cod_barra = ' + parseInt(req.params.codBarras);
    execSQLQuery('SELECT * FROM PRODUTO' + filter, res);

})

function execSQLQuery(sqlQry, res){
    const connection = mysql.createConnection({
        host: '191.252.193.192',
        port     : 3306,
        user     : 'root',
        password: '6code384',
        database : 'SUPERMERCADO'
    });
   
    connection.query(sqlQry, function(error, results, fields){
        if(error) 
          res.json(error);
        else
        
        //verifica se a resposa não é nula
        if(results[0] != null){

        //montando a resposta
        res.writeHead(200, { 'Content-Type': 'audio/mp3' }) //ogg/wav/mp4/mpeg
        
        //respondendo com streaming
        gtts.stream(results[0].descricao+ ", valor R$: " + results[0].valor).pipe(res)
        connection.end();
        console.log("\n Resultado sql: "+results[0].descricao  + ", valor R$: " + results[0].valor)
        
        }else{
           
            res.writeHead(200, { 'Content-Type': 'audio/mp3' }) 
            gtts.stream('produto não encontrado no banco de dados').pipe(res)
            connection.end();
            console.log('error')
    
        }
    });
  }

//servidor rodando na porta 3000
app.listen(port, function () {
    console.log(`Servidor rodando na porta: ${port}`)
})