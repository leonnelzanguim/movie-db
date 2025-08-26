let data = [
  { id: 1, title: 'Iron Man', year: '2008' },
  { id: 2, title: 'Thor', year: '2011' },
  { id: 3, title: 'Captain America', year: '2011' },
];

export function getAll() {
  return Promise.resolve(data);
}

export function remove(id) {
  data = data.filter((data) => data.id !== id);
  return Promise.resolve();
}

export function get(id) {
  return Promise.resolve(data.find((movie) => movie.id === id));
}

export function save(movie) {
  if (movie.id === '') {
    insert(movie);
  } else {
    update(movie);
  }
  return Promise.resolve();
}

function update(movie) {
  movie.id = parseInt(movie.id, 10);
  const index = data.findIndex((item) => item.id === movie.id);
  data[index] = movie;
}

function insert(movie) {
  movie.id = getNextId();
  data.push(movie);
  console.log('data movie insert', movie);
}

function getNextId() {
  return data.reduce((max, { id }) => Math.max(max, Number(id) || 0), 0) + 1;
}
