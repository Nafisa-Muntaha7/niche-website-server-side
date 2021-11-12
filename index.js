const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const app = express();
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config();
const port = process.env.PORT || 7000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5mrxq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('albums_db');
        const albumCollection = database.collection('albums');
        const homeAlbumCollection = database.collection('homealbums');
        const upcomingCollection = database.collection('upcomings');
        const reviewCollection = database.collection('reviews');


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

        //Add Reviews
        app.post('/review', async (req, res) => {
            const result = await reviewCollection.insertOne(req.body)
            res.send(result);
        });

        //Get all reviews
        app.get('/allReviews', async (req, res) => {
            const result = await reviewCollection.find({}).toArray();
            res.send(result);
            console.log(result);
        });

        //Get purchase product
        app.get('/purchaseProduct/:id', async (req, res) => {
            console.log(req.params.id)
            const result = await albumCollection.find({ _id: ObjectId(req.params.id) }).toArray();
            res.send(result[0]);
        })

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