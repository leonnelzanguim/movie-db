//

import sqlite3 from 'sqlite3';

// ouvre ou crée le fichier data.db
const db = new sqlite3.Database('movie.db', (err) => {
  if (err) {
    console.error('Erreur ouverture DB:', err.message);
  } else {
    console.log('Connexion SQLite OK');
  }
});

db.run(
  `
  CREATE TABLE IF NOT EXISTS Movies (
    id INTEGER PRIMARY KEY,
    title TEXT,
    year INTEGER
  )
`,
  (err) => {
    if (err) return console.error('Erreur création:', err.message);

    console.log('Table prête');

    // l'INSERT est appelé *après* la création
    db.run(
      `
    INSERT INTO Movies (title, year) VALUES
      ('Iron Man', 2008),
      ('Thor', 2011),
      ('Captain America', 2011)
  `,
      (err) => {
        if (err) console.error('Erreur insertion:', err.message);
        else console.log('Films insérés');
      }
    );
  }
);

export async function getAll() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM Movies';
    db.all(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

function insert(movie) {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO Movies (title, year) VALUES (?, ?)';
    db.run(query, [movie.title, movie.year], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

export async function save(movie) {
  if (!movie.id) {
    return insert(movie);
  } else {
    return update(movie);
  }
}

function update(movie) {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE Movies SET title = ?, year = ? WHERE id = ?';
    db.run(query, [movie.title, movie.year, movie.id], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

export async function get(id) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM Movies WHERE id = ?';
    db.get(query, [id], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

export async function remove(id) {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM Movies WHERE id = ?';
    db.run(query, [id], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}
