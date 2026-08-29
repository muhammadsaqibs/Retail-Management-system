import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = "mongodb+srv://softwaredemo17_db_user:ahvZawT3MPHJaitG@cluster0.md5z7qs.mongodb.net/retail_db?appName=Cluster0";
const uri2 = "mongodb://softwaredemo17_db_user:ahvZawT3MPHJaitG@ac-kd8u3ut-shard-00-00.md5z7qs.mongodb.net:27017,ac-kd8u3ut-shard-00-01.md5z7qs.mongodb.net:27017,ac-kd8u3ut-shard-00-02.md5z7qs.mongodb.net:27017/retail_db?ssl=true&replicaSet=atlas-xdvva6-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

async function testConnection(connectionString, name) {
  try {
    console.log(`Testing ${name}...`);
    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`SUCCESS: ${name}`);
    await mongoose.disconnect();
  } catch (error) {
    console.error(`FAILED: ${name}`);
    console.error(error);
  }
}

async function run() {
  await testConnection(uri, "SRV URI");
  await testConnection(uri2, "Standard URI");
  process.exit(0);
}

run();
