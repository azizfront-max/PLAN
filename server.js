require("dotenv").config();
const http = require("http");
const { MongoClient } = require("mongodb");

const ConnectionString = process.env.MONGO_URI;

async function startServer() {
    const client = new MongoClient(ConnectionString);
    
    try {
        await client.connect();
        console.log("MongoDB connection successful");

        const db = client.db("Reja"); 
        const collections = await db.listCollections().toArray();
        console.log("Collections:", collections.map(c => c.name));

        const app = require("./app");
        const server = http.createServer(app);
        const PORT = 3000;

        server.listen(PORT, () => {
            console.log(`Server running: http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
}

startServer();
