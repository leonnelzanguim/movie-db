import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/moviedb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Movie = mongoose.model('Movie', {
  id: Number,
  title: String,
  year: Number,
});

export async function initDb() {
  const count = await Movie.estimatedDocumentCount();
  if (count === 0) {
    await Movie.insertMany([
      { id: 1, title: 'Iron Man', year: 2008 },
      { id: 2, title: 'Thor', year: 2011 },
      { id: 3, title: 'Captain America', year: 2011 },
    ]);
    console.log('Seed MongoDB (via Mongoose) ✅');
  }
}

export function getAll() {
  return Movie.find({});
}

export async function save(movie) {
  if (!movie.id) {
    const newMovie = new Movie(movie);
    newMovie.id = Date.now();
    return newMovie.save();
  } else {
    const existingMovie = await get(parseInt(movie.id, 10));
    existingMovie.title = movie.title;
    existingMovie.year = movie.year;
    return existingMovie.save();
  }
}

export function get(id) {
  return Movie.findOne({ id });
}

export async function remove(id) {
  const movie = await get(id);
  return movie.deleteOne();
}
