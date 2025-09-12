// db.js
import sqlite3 from 'sqlite3';

export const db = new sqlite3.Database('movie.db', (err) => {
  if (err) {
    console.error('❌ Erreur ouverture DB:', err.message);
  } else {
    console.log('✅ Connexion SQLite OK');
  }
});
