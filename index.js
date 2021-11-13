const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
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
        const reviewCollection = database.collection('reviews');
        const usersCollection = database.collection('users');
        const addProductsCollection = database.collection('addProducts');


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

        //Get all reviews added by users and show on the home page
        app.get('/allReviews', async (req, res) => {
            const result = await reviewCollection.find({}).toArray();
            res.send(result);
            console.log(result);
        });

        //Check if the user is admin
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })

        //Add users to database
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });

        //Set users role to admin
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            console.log('put', user);
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        });

        //Add Products by Admin
        app.post('/addProducts', async (req, res) => {
            const result = await addProductsCollection.insertOne(req.body)
            res.send(result);
        });

        //Get all products added by admin and show on the website
        app.get('/allProducts', async (req, res) => {
            const result = await addProductsCollection.find({}).toArray();
            res.send(result);
            console.log(result);
        });

        //Get purchase product
        app.get('/purchaseProduct/:id', async (req, res) => {
            const result = await albumCollection.find({ _id: ObjectId(req.params.id) }).toArray();
            res.send(result[0]);
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