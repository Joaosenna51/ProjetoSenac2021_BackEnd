CREATE DATABASE ti0120db;
use ti0120db;

CREATE TABLE tbcliente(
idcliente bigint auto_increment primary key,
nomecliente varchar(100) not null,
email varchar(100) not null unique,
telefone varchar(20) not null,
usuario varchar(30) not null unique,
senha varchar (200) not null
)engine InnoDB character set="utf8mb4";

insert into tbcliente set
nomecliente="Joao",
email="joa@email.com",
telefone="11901020304",
usuario="s3nn4",
senha="senac@123";

select * from tbcliente;