[Desafio da Rocketseat](https://github.com/Rocketseat/bootcamp-gostack-desafio-02/blob/master/README.md#desafio-02-iniciando-aplica%C3%A7%C3%A3o)

# MeetApp Backend


# Configurações de ambiente

Para executar esse projeto:

* Tenha o `node.js` instalado.
* Tenha o `yarn` instalado.
* Tenha do `docker` instalado.

## Crie uma base de dados no postgres usando o docker

```sh
  docker run --name <container name> -e POSTGRES_PASSWORD=<password> -e POSTGRES_USER=<user> -e POSTGRES_DB=<db name> -d postgres

```

## Crie uma instancia do Redis para enfileiramento dos e-mails

```
docker run --name <container name> -e -d redis-alpine

```

## Configure o arquivo .env com as variáveis de ambiente

Renomeie o arquivo `.env.example` para `.env` e substitua o valor de cada variável com seu respectivo valor correto.


## Execute

```
yarn dev
```
