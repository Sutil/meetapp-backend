[Desafio da Rocketseat](https://github.com/Rocketseat/bootcamp-gostack-desafio-02/blob/master/README.md#desafio-02-iniciando-aplica%C3%A7%C3%A3o)

conceitos importantes:

# Sucrase

Ajuda usar funcionalidades do javascript, como sintaxe de import e export

```
yarn add sucrase nodemon -D
```

# sequelize

ORM para node com bancos relacionais.

```
yarn add sequelize
yarn add sequelize -D
```

configurar o banco de dados em src/config/database.js

```module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'gobarber',
  port: 5433,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
```

criar `.sequelizarc` na raiz

conteúdo do arquivo

```
const { resolve } = require('path');

module.exports = {
  config: resolve(__dirname, 'src', 'config', 'database.js'),
  'models-path': resolve(__dirname, 'src', 'app', 'models'),
  'migrations-path': resolve(__dirname, 'src', 'database', 'migrations'),
  'seeders-path': resolve(__dirname, 'src', 'database', 'seeds')
}
```


# Criar uma migration
```
yarn sequelize migration:create --name=<nome-da-migration>
```
