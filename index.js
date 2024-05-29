const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri =
  'mongodb+srv://jewelmia2330:I8ytPKc6dBDpgcsA@cluster0.r5x3jgy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const doctorCollection = client.db('doctorDB').collection('doctors');
    const usersCollection = client.db('doctorDB').collection('users');
    const servicesCollection = client.db('doctorDB').collection('services');
    const booksCollection = client.db('doctorDB').collection('books');

    app.get('/doctors', async (req, res) => {
      const result = await doctorCollection.find().toArray();
      res.send(result);
    });

    app.get('/doctors/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await doctorCollection.findOne(query);
      res.send(result);
    });

    app.get('/books/:email', async (req, res) => {
      try {
        const email = req.params.email;
        const query = { userEmail: email };
        const result = await booksCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        console.error('Error fetching books:', error);
        res
          .status(500)
          .send({ message: 'An error occurred while fetching books.' });
      }
    });

    app.post('/users', async (req, res) => {
      const item = req.body;
      console.log(item);
      const result = await usersCollection.insertOne(item);
      res.send(result);
    });

    app.get('/users', async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    app.get('/services', async (req, res) => {
      const result = await servicesCollection.find().toArray();
      res.send(result);
    });

    app.get('/api/getSlots', async (req, res) => {
      try {
        const service = req.query.service;
        const serviceData = await servicesCollection.findOne({
          service: service,
        });
        const serviceSlots = serviceData ? serviceData.slots : [];
        res.send(serviceSlots);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    });

    app.post('/services', async (req, res) => {
      const item = req.body;
      console.log(item);
      const result = await servicesCollection.insertOne(item);
      res.send(result);
    });
    app.post('/books', async (req, res) => {
      const item = req.body;
      console.log(item);
      const result = await booksCollection.insertOne(item);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Doctors Coming!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
