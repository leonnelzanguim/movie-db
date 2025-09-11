// db.js
import sqlite3 from 'sqlite3';

export const db = new sqlite3.Database('movie.db', (err) => {
  if (err) {
    console.error('❌ Erreur ouverture DB:', err.message);
  } else {
    console.log('✅ Connexion SQLite OK');
  }
});

export function initDb() {
  // Création table Movies
  db.run(
    `CREATE TABLE IF NOT EXISTS Movies (
       id INTEGER PRIMARY KEY,
       title TEXT,
       year INTEGER
     )`,
    (err) => {
      if (err) return console.error('Erreur création Movies:', err.message);

      // Insérer seulement si table vide
      db.get(`SELECT COUNT(*) as count FROM Movies`, (err, row) => {
        if (row.count === 0) {
          db.run(
            `INSERT INTO Movies (title, year) VALUES
             ('Iron Man', 2008),
             ('Thor', 2011),
             ('Captain America', 2011)`
          );
          console.log('Films insérés ✅');
        }
      });
    }
  );

  // Création table Users
  db.run(
    `CREATE TABLE IF NOT EXISTS Users (
       id INTEGER PRIMARY KEY,
       firstname TEXT,
       lastname TEXT,
       username TEXT,
       password TEXT
     )`,
    (err) => {
      if (err) return console.error('Erreur création Users:', err.message);

      // Insérer seulement si table vide
      db.get(`SELECT COUNT(*) as count FROM Users`, (err, row) => {
        if (row.count === 0) {
          db.run(
            `INSERT INTO Users (firstname, lastname, username, password)
             VALUES ('Sebastian', 'Springer', 'sspringer', '098f6bcd4621d373cade4e832627b4f6')`
          );
          console.log('Utilisateur inséré ✅');
        }
      });
    }
  );
}

export default db;
