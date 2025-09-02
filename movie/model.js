import { createClient } from 'redis';

const client = createClient({ url: 'redis://localhost:6379' });

export async function initDb() {
  await client.connect();

  // seed si vide : on regarde l'index
  const count = await client.zCard('movies:index');
  if (count === 0) {
    // démarrer le compteur à 0
    await client.set('movies:nextId', 0);
    await Promise.all([
      add({ title: 'Iron Man', year: 2008 }),
      add({ title: 'Thor', year: 2011 }),
      add({ title: 'Captain America', year: 2011 }),
    ]);
    console.log('Données initiales Redis insérées ✅');
  }
}

export async function getAll() {
  const ids = await client.zRange('movies:index', 0, -1); // strings
  const multi = client.multi();
  ids.forEach((id) => multi.hGetAll(`movie:${id}`));
  const rows = await multi.exec();
  // injecter l'id dans chaque row
  return rows.map((row, i) => ({
    id: Number(ids[i]),
    title: row.title,
    year: Number(row.year),
  }));
}

export async function get(id) {
  const data = await client.hGetAll(`movie:${id}`);
  if (!data || Object.keys(data).length === 0) return null;
  return { id: Number(id), title: data.title, year: Number(data.year) };
}

export async function save(movie) {
  // update si id fourni, sinon insert
  if (movie.id) {
    await client.hSet(`movie:${movie.id}`, {
      title: movie.title,
      year: String(movie.year ?? ''),
    });
    // s’assurer que l’id est dans l’index
    await client.zAdd('movies:index', [
      { score: Number(movie.id), value: String(movie.id) },
    ]);
    return get(movie.id);
  }
  return add(movie);
}

export async function remove(id) {
  const k = `movie:${id}`;
  const existed = await client.exists(k);
  await client.del(k);
  await client.zRem('movies:index', String(id));
  return existed === 1;
}

// — helpers —
async function add({ title, year }) {
  const id = await client.incr('movies:nextId');
  const key = `movie:${id}`;
  await client.hSet(key, { title, year: String(year ?? '') });
  await client.zAdd('movies:index', [{ score: id, value: String(id) }]);
  return { id, title, year };
}
