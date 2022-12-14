/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Ryan Locke Student ID: 034748129 Date: September 16 2022
*  Cyclic Link: https://ill-cyan-rattlesnake-belt.cyclic.app/
*
********************************************************************************/ 

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const env = require('dotenv').config();
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

const HTTP_PORT = process.env.PORT || 8080;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", function(req, res){
    res.json({message: "API Listening"});
});

app.post("/api/movies", (req, res)=>{
    db.addNewMovie(req.body)
    .then(function(data){
        res.status(201).json(data);   
    })
    .catch((err)=>{
        res.status(400).send("400 - Bad Request - Can Not Add New Movie");
    })
})

app.get("/api/movies", (req, res) => {
    if((!req.query.page || !req.query.perPage)){
        res.status(500).json({message: "Missing query parameters"})
    }
    else {
        db.getAllMovies(req.query.page, req.query.perPage, req.query.title)
        .then((data) => {
            res.status(201).json(data);
        })
        .catch((err) => { 
            res.status(500).json({error: err})
         })
    }
});

app.get('/api/movies/:id', (req, res)=>{
    db.getMovieById(req.params.id)
    .then(function(data){
        res.status(200).send(data);
    })
    .catch((error)=>{
        res.status(204).send(error + "204 - No Content");
    })
})

app.put('/api/movies/:id', (req, res)=>{
    db.updateMovieById(res.body, req.params.id)
    .then(function(){
        res.status(204).send("Success - Updated Movie");
    })
    .catch((error)=>{
        res.status(400).send(error + "400 - Error: Could Not Update Movie");
    })
})

app.delete('/api/movies/:id', (req, res)=>{
    db.deleteMovieById(req.params.id)
    .then(function(data){
        res.status(204).send("Success - Deleted Movie");
    })
    .catch((error)=>{
        res.status(400).send(error + "400 - Error: Could not delete Movie")
    })
})

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    res.status(500).send(err+ "500 - Server Error");
});

