import express from "express";   
import chalk from "chalk"; 
import cors from 'cors'; 
import { MongoClient, ObjectId  } from "mongodb"; 
import 'dayjs/locale/pt-br.js'; 
import dayjs from 'dayjs'; 
import dotenv from "dotenv"; 
import joi from "joi"; 
import bcrypt from "bcrypt"; 
import { v4 as uuid } from "uuid";


const app = express(); 
app.use(cors()); 
app.use(express.json()); 
dotenv.config();  

const mongoClient = new MongoClient(process.env.MONGO_URI); 
var db; 

mongoClient.connect(() => { 
    db = mongoClient.db(process.env.DATABASE_NAME); 
});    

app.post("/registration", async (req,res) => { 
    const tamanho = await db.collection('registration').find().toArray();
    console.log(tamanho.length);
    const userData = {
        id: tamanho.length + 1,
        name: req.body.name, 
        email: req.body.email, 
        password: req.body.password, 
        confirmPassword: req.body.confirmPassword
    }; 

    const registrationSchema = joi.object({ 
        name: joi.string().required(), 
        email: joi.string().email().required(), 
        password: joi.string().required(), 
        confirmPassword: joi.string().required()
    });    

    const validationData = registrationSchema.validate(req.body, { abortEarly: true });  
    
    
    if(validationData.error) { 
        res.status(422).send("Dados Inválidos"); 
        return;
    } else if (req.body.password !== req.body.confirmPassword) { 
        res.status(404).send("Senha não confere com a confirmação da senha"); 
        return; 
    } 

    const criptografPassword = bcrypt.hashSync(req.body.password, 10);
    const criptografConfirmPassword = bcrypt.hashSync(req.body.confirmPassword, 10);
    console.log(criptografPassword);

    try {
        const findRepetead = await db.collection('registration').findOne({email: req.body.email}); 
        if(findRepetead) { 
            res.status(409).send("Já registrado"); 
            return; 
        }
        await db.collection('registration').insertOne({...userData, password: criptografPassword, confirmPassword: criptografConfirmPassword});  
        const registrations = await db.collection('registration').find().toArray();
        console.log(registrations);
    } catch (error) {
        console.log(error); 
        res.status(500).send("Erro ao criar usuário"); 
        return;
    } 

    res.sendStatus(201);
}); 

app.post("/login", async (req,res) => {  
    const loginData = req.body; 
    const token = req.headers.token; 

    const loginSchema = joi.object({
        email: joi.string().email().required(), 
        password: joi.string().required()
    });  

    const validationLogin = loginSchema.validate(req.body, { abortEarly: true });  

    if(validationLogin.error) { 
        res.status(422).send("Dados Inválidos"); 
        return;
    } 

    try { 
         
        const verifUser = await db.collection('registration').findOne({email: req.body.email});
        if(!verifUser) {
            res.status(409).send("Email não cadastrado, digite novamente ou faça o cadastro!"); 
            return;
        }  
        const comparePassword = bcrypt.compareSync(req.body.password, verifUser.password);
        if(!comparePassword) {
            res.status(401).send("Senha errada"); 
            return;
        } 
        await db.collection('login').insertOne(loginData);
    } catch(error) { 
        console.log(error); 
        res.status(500).send("Erro ao criar usuário"); 
        return;
    } 

    res.sendStatus(200);
});  

app.get("/records", async (req,res) => {  
    const { authorization } = req.headers; 
    const token = authorization?.replace('Bearer ', ''); 

    try {
        const records = await db.collection('enterExit').find().toArray(); 
        console.log(records); 
        res.status(200).send(records);
        return;
    } catch (error) {
        console.log(error); 
        res.status(500).send("Não foi possível pegar os dados desejados"); 
        return;
    } 
});

app.post("/revenue", async (req,res) => { 
    const { authorization } = req.headers; 
    const token = authorization?.replace('Bearer ', ''); 

    const revenueSchema = joi.object({ 
        value: joi.number().required(), 
        description : joi.string().required()
    });  

    const validationRevenue = revenueSchema.validate(req.body, { abortEarly: true });  

    let now = dayjs().locale('pt-br');
    let hoje = now.format("DD/MM");   

    const revenueData = { 
        value: req.body.value, 
        description: req.body.description, 
        type: "entrada", 
        date: hoje
    }; 

    if(validationRevenue.error) { 
        res.status(422).send("Dados inválidos");
        return;
    } 

    try {
        await db.collection('enterExit').insertOne(revenueData);
        const revenues = await db.collection('enterExit').find().toArray();
        console.log(revenues)
    } catch (error) {
        console.log(error);
        res.status(500).send("Erro ao criar nova entrada");
        return;
    }
    res.sendStatus(201);
}); 

app.post("/outgoing", async (req,res) => { 
    const { authorization } = req.headers; 
    const token = authorization?.replace('Bearer ', '');

    const outgoingSchema = joi.object({ 
        value: joi.number().required(), 
        description : joi.string().required()
    });  

    const validationOutgoing = outgoingSchema.validate(req.body, { abortEarly: true });  

    let now = dayjs().locale('pt-br');
    let hoje = now.format("DD/MM");   

    const outgoingData = {
        value: req.body.value, 
        description: req.body.description, 
        type: "saida", 
        date: hoje
    }; 

    if(validationOutgoing.error) { 
        res.status(422).send("Dados inválidos");
        return;
    } 

    try {
        await db.collection('enterExit').insertOne(outgoingData); 
        const outgoings = await db.collection('enterExit').find().toArray();
        console.log(outgoings)
    } catch (error) {
        console.log(error);
        res.status(500).send("Erro ao criar nova entrada");
        return;
    }
    res.sendStatus(201);
});

app.listen(process.env.PORT, () => {
    console.log(chalk.blue.bold(`\nRodando na porta ${process.env.PORT}`));
});