import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'topSecret',
  database: 'movie_db',
});

await connection.connect();

export async function getAll() {
  const query = 'SELECT * FROM Movies';
  const [data] = await connection.query(query);
  return data;
}

export async function remove(id) {
  const query = 'DELETE FROM Movies WHERE id = ?';
  await connection.query(query, [id]);
  return;
}

export async function get(id) {
  const query = 'SELECT * FROM Movies WHERE id = ?';
  const [data] = await connection.query(query, [id]);
  return data.pop();
}

export function save(movie) {
  if (!movie.id) {
    return insert(movie);
  } else {
    return update(movie);
  }
}

async function update(movie) {
  const query = 'UPDATE Movies SET title = ?, year = ? WHERE id = ?';
  await connection.query(query, [movie.title, movie.year, movie.id]);
  return movie;
}

async function insert(movie) {
  const query = 'INSERT INTO Movies (title, year) VALUES (?, ?)';
  const [result] = await connection.query(query, [movie.title, movie.year]);
  return { ...movie, id: result.insertId };
}

function getNextId() {
  return data.reduce((max, { id }) => Math.max(max, Number(id) || 0), 0) + 1;
}
