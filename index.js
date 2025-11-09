const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion } = require('mongodb');

// ======url =======
// const uri = "mongodb+srv://<db_username>:<db_password>@cluster0.zfo7i3z.mongodb.net/?appName=Cluster0";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zfo7i3z.mongodb.net/?appName=Cluster0`;

// Middleware to parse JSON bodies
app.use(cors())
app.use(express.json());

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


// Home route
app.get('/', (req, res) => {
    res.send("StudyMate Server is running");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
