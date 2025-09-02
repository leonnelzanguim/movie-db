CREATE DATABASE movie_db;
USE movie_db;

CREATE TABLE Movies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  year INT
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO Movies (title, year) VALUES
('Iron Man', 2008),
('Thor', 2011),
('Captain America', 2011);
