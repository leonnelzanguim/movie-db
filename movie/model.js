import { db } from './../db.js';

export async function getAll(userId) {
  return new Promise((resolve, reject) => {
    const query = `SELECT Movies.*,
                    count(Ratings.rating) AS numOfRatings,
                    sum(Ratings.rating) AS sumOfRatings,
                    r.rating AS userRating
                    FROM Movies
                    LEFT JOIN Ratings ON Movies.id = Ratings.movie
                    LEFT JOIN Ratings AS r ON Movies.id = r.movie AND r.user = ?
                    WHERE Movies.user = ? OR public = 1
                    GROUP BY Movies.id;`;
    db.all(query, [userId, userId], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

function insert(movie, userId) {
  return new Promise((resolve, reject) => {
    const query =
      'INSERT INTO Movies (title, year, public, user) VALUES (?, ?, ?, ?)';
    db.run(
      query,
      [movie.title, movie.year, movie.public, userId],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
}

export async function save(movie, userId) {
  if (!movie.id) {
    return insert(movie, userId);
  } else {
    return update(movie, userId);
  }
}

function update(movie, userId) {
  return new Promise((resolve, reject) => {
    const query =
      'UPDATE Movies SET title = ?, year = ?, public = ?, user = ? WHERE id = ?';
    db.run(
      query,
      [movie.title, movie.year, movie.public, userId, movie.id],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
}

export async function get(id, userId) {
  return new Promise((resolve, reject) => {
    const query =
      'SELECT * FROM Movies WHERE id = ? AND (user = ? OR public = 1)';
    db.get(query, [id, userId], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

export async function remove(id, userId) {
  return new Promise((resolve, reject) => {
    const query =
      'DELETE FROM Movies WHERE id = ? AND (user = ? OR public = 1)';
    db.run(query, [id, userId], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

export async function rate(rating) {
  const deleteQuery = 'DELETE FROM Ratings WHERE movie = ? AND user = ?';
  await db.run(deleteQuery, [rating.movie, rating.user]);
  const insertQuery =
    'INSERT INTO Ratings (movie, user, rating) VALUES (?, ?, ?)';
  return db.run(insertQuery, [rating.movie, rating.user, rating.rating]);
}
