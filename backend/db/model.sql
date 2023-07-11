CREATE TABLE auth(
    id serial not null primary key,
    username varchar(32) not null unique,
    password varchar(64) not null
);
CREATE TABLE card(
    id serial not null primary key,
    cardnum integer not null,
    year integer not null,
    balance integer not null,
    card_id int not null
);

CREATE TABLE store(
    id serial not null primary key,
    name varchar(64) not null,
    balance integer not null
);

CREATE TABLE cashback(
    id serial not null primary key,
    balance integer not null,
    user_id integer not null
);

CREATE TABLE cash(
    id serial not null primary key,
    balance integer not null
);