const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 7000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5mrxq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('albums_db');
        const albumCollection = database.collection('albums');
        const homeAlbumCollection = database.collection('homealbums');
        const upcomingCollection = database.collection('upcomings');


        app.get('/albums', async (req, res) => {
            const cursor = albumCollection.find({});
            const albums = await cursor.toArray();
            res.send(albums);
        });

        app.get('/homealbums', async (req, res) => {
            const cursor = homeAlbumCollection.find({});
            const homealbums = await cursor.toArray();
            res.send(homealbums);
        });

        app.get('/upcomings', async (req, res) => {
            const cursor = upcomingCollection.find({});
            const upcomings = await cursor.toArray();
            res.send(upcomings);
        });

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