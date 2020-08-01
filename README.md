# restful-api
This project was created as an implementation proposal
for a [DevPleno](https://github.com/devpleno) course challange.
It's a RESTful API that's implements a basic API 
witch is connected with a database server. 
For this project I decided to implement features 
beyond the original challenge.

## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Database](#database)
* [Features](#features)
* [Status](#status)
* [Setup](#setup)
* [Self-Promotion](#self-promotion)

## General info
Based on a course module the tutor ask us to just 
continue implementing a CRUD wasn't implemented 
along the classes. But I wanted to rewrite what 
a learned on my own from scratch and try to go 
beyond that. I want to allow this API to connect 
with three differents databases: **MySQL**, 
**PostgreSQL** and **MongoDB**. Not simultaneously, 
but building some modules to each approach.

## Technologies
Techs used to build this application:
* [Express.js](https://expressjs.com) - Fast, unopinionated, minimalist web framework for [Node.js](https://nodejs.org/en/)
* [MariaDB](https://mariadb.org) - The open source relational database
* [PostgreSQL](https://www.postgresql.org) - Advanced Open Source Relational Database
* [MongoDB](https://www.mongodb.com) - A general purpose, document-based, distributed database
* [Docker](https://www.docker.com) - A complete container solution

## Database
Descriptions about the database implementations.

### Products:
#### Attributes
- `name`, `price`, `categories` and `images`;
-  **images** have: `description` and `url`.

#### Filters
- findAll
- findAllByCategory
- findAllPaginated
- findById

---
### Categories:
#### Attributes
- `name`;
- 
#### Filters
- findAll
- findById

---
### Entities
#### Product
- `id`: primary key, auto increment, not null
- `name`: string, default null
- `price`: number (float), default null

---
#### Categories
- `id`: primary key, auto increment, not null
- `name`: string, default null

--- 
#### Images
- `id`, primary key, auto increment, not null
- `description`: string (text), default null
- `url`: string, default null
- `product_id`: integer, foreign key, not null
**constraint:** will be deleted when it's relationed product is deleted.

---
#### Products/Categories
- `product_id`: int, foreign key, not null
- `category_id`: int, foreign key, not null
**constraints:** will be deleted when it's relationed product is deleted.

## Features
A few things of what this API can do:
- [x] Connection with MySQL database service
- [ ] Connection with PostgresSQL database service
- [ ] Connection with MongoDB database service
- [x] Products CRUD
- [x] Categories CRUD
- [x] Add Images to products
- [ ] Add Categories to products
- [x] `OrdeBy` filter for Products
- [x] Paginate filter with `limit` and `offset`for Products
- [x] Custom error handling
- [ ] Ready for work on production environment

## Status
Project is:[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/Naereen/StrapDown.js/graphs/commit-activity)


## Setup
If you want to run this application locally, follow the steps.

#### 1. Cloning repository
```sh
$ git clone https://github.com/sineto/restful-api
```

#### 2. Install dependencies
```sh
$ cd restful-api
$ yarn install
```
#### 3. Running development server
```sh
$ yarn dev
```

#### 4. Running database with Docker
```sh
$ docker-compose up -d
```
`-d`: will *detached* docker logs.

## Self-Promotion
Do you like this plugin? Come on:
- Star and follow the repository on [GitHub](https://github.com/sineto/restful-api).
- Follow me on
  - [GitHub](https://github.com/sineto)

## License
[MIT License](LICENSE)
