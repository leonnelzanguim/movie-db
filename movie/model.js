// mongoModel.js
import { MongoClient, ObjectId } from 'mongodb';

let collection = null;

async function connect() {
  if (collection) {
    return collection;
  }
  const client = new MongoClient('mongodb://localhost:27017');
  await client.connect();
  const db = client.db('moviedb');
  collection = db.collection('Movie');
  return collection;
}

export async function initDb() {
  const movies = await connect(); // ✅ récupère la collection
  if ((await movies.estimatedDocumentCount()) === 0) {
    await movies.insertMany([
      { id: 1, title: 'Iron Man', year: 2008 },
      { id: 2, title: 'Thor', year: 2011 },
      { id: 3, title: 'Captain America', year: 2011 },
    ]);
    console.log('Seed MongoDB ✅');
  }
}

export async function getAll() {
  const collection = await connect();
  const docs = await collection.find({});
  return docs.toArray();
}

async function insert(movie) {
  movie.id = Date.now();
  const collection = await connect();
  const data = collection.insertOne(movie);
  return data;
}

export function save(movie) {
  if (!movie.id) {
    return insert(movie);
  } else {
    return update(movie);
  }
}

export async function get(id) {
  const collection = await connect();
  const doc = await collection.findOne({ id });
  return doc;
}

async function update(movie) {
  movie.id = parseInt(movie.id, 10);
  const collection = await connect();
  await collection.updateOne({ id: movie.id }, { $set: movie });
  return movie;
}

export async function remove(id) {
  const collection = await connect();
  return collection.deleteOne({ id });
}
