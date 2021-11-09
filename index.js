const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 7000;

app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5mrxq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
    }
    finally {
        //await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Niche!');
})

app.listen(port, () => {
    console.log(`listening at ${port}`);
})