# <p align = "center">💵 My Wallet 💵</p>

<p align="center">
   <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDNxJqeUBJJYGX35oR0wZNONpdwuIYnKAU7A&s" width="500" height="400" object-fit="cover"/>
</p>

<p align = "center">
   <img src="https://img.shields.io/badge/author-lucasmartinso-4dae71?style=flat-square" />
   <img src="https://img.shields.io/github/languages/count/lucasmartinso/projeto13-mywallet-back?color=4dae71&style=flat-square" />
</p>


##  :clipboard: Description

This is a backend application to control the data flow of online wallet that manages your expenses and controls the flow of your money.
***

## :computer:	 Tecnolgy and Concepts 

- Node.js
- JavaScript
- MongoDB

***

## :rocket: Routes

### 👥 Users 

```yml
POST /registration
    - Route to register acount
    - headers: {}
    - body:{
        "name": "lorem",
        "email": "lorem@domain.com",
        "password": "********",
        "confirmPassword": "********"
}
```
    
```yml 
POST /login
    - Route to make the login to acess personal acount info
    - headers: {}
    - body: {
        "email": "lorem@domain.com",
        "password": "**********"
    }
```

### 🪙​ Wallet  

```yml 
GET /records
    - Route to get personal money flow 
    - headers: { "Authorization": `Bearer $token` }
    - body: {}
```

```yml 
POST /revenue (autentify)
    - Route to add money to flow 
    - headers: { "Authorization": `Bearer $token` }
    - body: {
        "value": 9999,
        "description": "lorem ipsum..."
    }
```

```yml 
POST /outgoing (autentify)
    - Route to remove money to flow 
    - headers: { "Authorization": `Bearer $token` }
    - body: {
        "value": 9999,
        "description": "lorem ipsum..."
    }
``` 

## 🏁 Running the application locally

First, make the clone repository in your machine:

```
git clone https://github.com/lucasmartinso/projeto13-mywallet-back.git
```

After, inside the folder, run the comand to install the dependencies.

```
npm install
```
Config the .env, .env.test and .env.development based on .env.example

To run the tests 
```
npm run test
```

To finish the process, to init the server
```
npm start or npm run dev
```

:stop_sign: Don't forget to repeat the sequence above with [repository](https://github.com/lucasmartinso/projeto13-mywallet-front) that contains the interface of aplication, to test the project per complet.
