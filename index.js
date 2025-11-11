const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
        const connectionsCollection = StudyMateDB.collection('connections');

        // database related api here
        app.post('/partners', async (req, res) => {
            const newPartner = req.body
            console.log('partener info', newPartner)
            const result = await partnerCollection.insertOne(newPartner)
            res.send(result)
        })
        // top rated partener
        app.get('/topPartners', async (req, res) => {
            const cursor = partnerCollection.find().sort({ rating: -1 }).limit(3)
            const result = await cursor.toArray()
            res.send(result)
        })
        // === post data  in email ====
        app.get('/partners', async (req, res) => {
            console.log(req.query)
            const email = req.query.email
            const query = {}
            if (email) {
                query.email = email
            }
            const cursor = partnerCollection.find(query);
            const result = await cursor.toArray()
            res.send(result)
        })
        ////==== find one /search/ partner ====
        app.get('/partner/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await partnerCollection.findOne(query)
            res.send(result)
        })
        //==== connections batabase ===
        // get connection
        app.get('/my-connections', async (req, res) => {
            const email = req.query.email;
            if (!email) {
                return res.status(400).send({ success: false, message: "Email is required" });
            }
            const query = { userEmail: email };
            const result = await connectionsCollection.find(query).toArray();
            res.send(result);
        });

        //// find product bids
        app.get('/connections/:partnerId', async (req, res) => {
            const partnerId = req.params.partnerId
            console.log(partnerId)
            const query = {
                partner: partnerId
            }
            const cursor = connectionsCollection.find(query).sort({ bid_price: -1 })
            const result = await cursor.toArray()
            res.send(result)
        })
        // ===== connection data post ===
        app.post('/connections/sent-request', async (req, res) => {
            const requestData = req.body;
            const result = await connectionsCollection.insertOne(requestData);
            res.send(result)
        })

        /// delete Partner
        app.delete('/connections/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await connectionsCollection.deleteOne(query);
            res.send(result);
        });

        // ====== edit /update connection ===
          app.patch('/connections/:id', async (req, res) => {
                const id = req.params.id;
                const updatePartner = req.body;
                const query = { _id: new ObjectId(id) };
                const update = { $set: updatePartner };
                const result = await connectionsCollection.updateOne(query, update);
                res.send(result);
            });





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
