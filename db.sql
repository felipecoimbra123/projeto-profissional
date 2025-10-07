create database fotografia_pp;
use fotografia_pp;

create table usuario(
	id int primary key auto_increment,
    nome varchar(255) not null,
    email varchar(255) not null unique,
    senha varchar(255) not null,
    seguidores int,
    imagemPerfil varchar(255),
    criadoEm timestamp default current_timestamp
);

create table seguir(
	seguidor int,
    seguindo int,
    foreign key (seguidor) references usuario(id),
    foreign key (seguindo) references usuario(id)
);

create table artigo(
	id int primary key auto_increment,
    titulo varchar(255),
    conteudo varchar(255),
    imagemArtigo varchar(255),
    categoria varchar(255),
    criadoEm timestamp default current_timestamp,
    autor_id int,
    foreign key (autor_id) references usuario(id)
);

create table fotografia(
	id int primary key auto_increment,
    titulo varchar(255),
    descricao varchar(255) not null,
    url varchar(255) not null,
    media_avaliacao float,
    curtidas int,
    autor_id int,
    foreign key (autor_id) references usuario(id)
);

create table comentario(
	id int primary key auto_increment,
    texto varchar(255) not null,
    fotografia int,
    autor_id int,
    foreign key (fotografia) references fotografia(id),
    foreign key (autor_id) references usuario(id),
    criadoEm timestamp default current_timestamp
);

select * from usuario;

select * from fotografia;

drop database fotografia_pp;