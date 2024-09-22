if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
  
  }
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URI

const client = new MongoClient(uri,{
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

async function connect() {
    try {
        client.db(process.env.MONGODB_DATABASE);
    
    } catch (error) {
        await client.close();
    }
}
connect()
async function getDB() {
    return client.db(process.env.MONGODB_DATABASE);
}

module.exports = {
    connect, getDB
}