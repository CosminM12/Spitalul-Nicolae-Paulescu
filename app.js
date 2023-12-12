const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

//const uri = 'mongodb+srv://murariurusalincosmin:Moisil123@nicolaepaulescu.nejcjki.mongodb.net/?retryWrites=true&w=majority';
const uri = 'mongodb+srv://murariurusalincosmin:Moisil123@nicolaepaulescu.nejcjki.mongodb.net/?retryWrites=true&w=majority'
async function connect() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    } catch(error) {
        console.error(error);
    }
}

connect();

app.use(/*'/web',*/express.static(path.join(__dirname, '/public')));

app.use((req, res) => {
    res.status(404);
    res.send('<h1>Error 404: File not found</h1>');
})

app.listen(3000, () => {
    console.log("App listening on port 3000");
})