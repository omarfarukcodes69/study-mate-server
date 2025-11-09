const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion } = require('mongodb');

// ======url =======
// const uri = "mongodb+srv://<db_username>:<db_password>@cluster0.zfo7i3z.mongodb.net/?appName=Cluster0";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zfo7i3z.mongodb.net/?appName=Cluster0`;
console.log()

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
// Middleware to parse JSON bodies
app.use(cors())
app.use(express.json());

// Create a MongoClient with a MongoClientOptions object to set the Stable API version

app.get('/', (req, res) => {
    res.send("StudyMate Server is running");
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const StudyMateDB = client.db('Study_Mate');
        const partnerCollection = StudyMateDB.collection('partners');

        // database related api here
        app.post('/partners', async (req, res) => {
            const newPartner = req.body
            console.log('partener info', newPartner)
            const result = await partnerCollection.insertOne(newPartner)
            res.send(result)

        })
        app.get('/partners', async (req, res) => {
            const cursor = partnerCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        // top rated partener 
        app.get('/partners', async (req, res) => {
            const cursor = partnerCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);
// Home route


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
