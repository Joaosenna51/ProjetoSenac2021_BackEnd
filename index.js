// importação do módulo express para gerenciar o servidor de aplicação em node
const express = require ("express");

// importaçãoi do modulo CORS para nos ajudar no tartamento de protocolos de requisição diferentes,
//tais como: http;https; file; ftp 

const cors =require("cors");

// importação do modulo My SQL

const mysql= require("mysql");
 

//importaçõ do modulo do jsonwebtoken para nos ajudar
// a trabalhar com a seção segura

const jwt = require("jsonwebtoken");

//para criptografia as senhas será utilizado o bcrypt
//vamos importar o modulo

const bcrypt = require ("bcrypt");

// criando uma instancia do servidor para carega-lo
// faremos isso usando a constante App

const app = express();

// configurar o servidor express para aceitar dados em formato JSON.
app.use(express.json());

// configurar o servidor para lidar com as requisições 
// de varias origens. Para isso iremos usar o cors

app.use(cors());

/// configuração para comunicaçãoi com o banco de dados
const con =mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"ti0120db",
    port:"3306"
});

// executar a conexão com o banco de dados
con.connect((erro)=>{
    if(erro){
        console.error(`Erro ao tentar carregar o servidor de banco de dados ->${erro}`);
        return;
    }
    console.log(`Servidor de banco de dados Conectado -> ${con.threadId}`)


});


// vamos criar as rotas com os endpoints para realizar o gerenciamento dos dados dos clientes

app.get("/api/cliente/listar",(req,res)=>{
    //vamos consultar os clientes cadastrados em banco
    con.query("Select * from tbcliente",(erro,result)=>{
        if(erro){
            return res.status(400).send({output:`Erro ao tentar carregar dados->${erro}`});
        }
        res.status(200).send({output:result});
    });
});

app.get("/api/cliente/listar/:id",(req,res)=>{
    con.query("Select * from tbcliente where idcliente=?",[req.params.id],(erro,result)=>{
        if(erro){
            return res.status(400).send({output:`Erro ao tentar localizar o cliente->${erro}`});
        }
        res.status(200).send({output:result});
    });
});

    app.post("/api/cliente/cadastro",(req,res)=>{

        bcrypt.hash(req.body.senha,10,(erro,result)=>{
            if(erro){
                return res.status(503).send({output:`Erro interno ao gerar  a senha->${erro}`});
            }
            req.body.senha=result;
        


        con.query("INSERT INTO tbcliente SET ?", [req.body],(erro,result)=>{
            if(erro){
                return res.status(400).send({output:`Erro ao tentar Cadastro ->${erro}`,})
            }
            res.status(201).send({output:`Cadastro Realizado`, payload:result});
        });

    });
});


    app.post("/api/cliente/login",(req,res)=>{
        const us = req.body.usuario;
        const sh = req.body.senha;


        console.log(`Usuario enviado->${us}`);


        con.query("Select * from tbcliente where usuario=?",[us],(erro,result)=>{
            if(erro){
                return res.status(400).send({output:`Erro ao tentar logar ->${erro}`});
            }
            if (!result){
                return res.status(404).send({output:`Usuário não localizado`});
            }


            console.log(`dados do banco${result.senha}`);

            // linha que faz a comparação de senha criptografada no banco de dados
            bcrypt.compare(sh,result[0].senha,(erro,igual)=>{
                if(erro){
                return res.status(503).send({output:`Erro interno ->${erro}`});
                }
                if(!igual){
                    return res.status(400).send({output:`Sua senha está incorreta`});
                }

                res.status(200).send({output:`Logado`,payload:result});
            });

            
        });
    });

    app.put("/api/cliente/atualizar/:id",(req,res)=>{
        con.query("Update tbcliente set ? where idcliente=?", [req.body,req.params.id],(erro,result)=>{
            if(erro){
                return res.status(400).send({output:`Erro ao tentar atualizar ->${erro}`});
            }
            res.status(200).send({output:`Dados atulizados com sucesso`,payload:result});
        });
        
    });
    app.delete("/api/cliente/apagar/:id",(req,res)=>{
        con.query("Delete from tbcliente where idcliente=?",[req.params.id],(erro,result)=>{
            if(erro){
                return res.status(400).send({output:`Erro ao tentar deletar ->${erro}`});
            }
            res.status(204).send({});
        });
    });

    app.listen(3000,()=>console.log(`Servidor online em http://localhost:3000`));
