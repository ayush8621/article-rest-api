const { MongoClient } = require("mongodb");
const assert = require('assert');
// Connection URI
const uri =
    "mongodb://localhost:27017";
const dbName = 'fruitsDB';
// Create a new MongoClient
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();

    // Establish and verify connection
    await client.db(dbName).command({ ping: 1 });
    console.log("Connected successfully to server");

       const db = await client.db(dbName);
       const result = await insertDocuments(db);
       console.log(`${result.insertedCount} documents were inserted`);

     } catch (e) {
       console.log(e);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


const insertDocuments = function(db) {
  return new Promise((resolve, reject) => {
    const fruits = db.collection("fruits");
    // create an array of documents to insert
    const docs = [{
        name: "Apple",
        score: 8,
        review: "Great fruit"
      },
      {
        name: "Orange",
        score: 6,
        review: "Kinda sour"
      },
      {
        name: "Banana",
        score: 9,
        review: "Great stuff!"
      }
    ];
    // this option prevents additional documents from being inserted if one fails
    const options = {
      ordered: false
    };
    const result = fruits.insertMany(
      docs, options,
      function(err, result) {
        try {
          assert.equal(err, null);
          assert.equal(3, result.result.n);
          assert.equal(3, result.ops.length);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      }
    );
  });
};
