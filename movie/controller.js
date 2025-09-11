import { getAll, remove, get, save, rate } from './model.js';
import { render } from './view.js';
import { render as form } from './form.js';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { readFileSync } from 'fs';

export async function listAction(request, response) {
  const movies = await getAll(request.user.id);
  response.render(dirname(fileURLToPath(import.meta.url)) + '/views/list', {
    movies,
  });
}

export async function removeAction(request, response) {
  const id = parseInt(request.params.id, 10);
  await remove(id, request.user.id);

  response.redirect(request.baseUrl);
}

export async function formAction(request, response) {
  let movie = { id: '', title: '', year: '', public: '' };
  if (request.params.id) {
    movie = await get(parseInt(request.params.id, 10), request.user.id);
  }
  const body = form(movie);
  response.send(body);
}

export async function saveAction(request, response) {
  const movie = {
    id: request.body.id,
    title: request.body.title,
    year: request.body.year,
    public: request.body.public === '1' ? 1 : 0,
  };
  await save(movie, request.user.id);
  response.redirect(request.baseUrl);
}

export async function rateAction(request, response) {
  const rating = {
    movie: parseInt(request.params.movie, 10),
    user: request.user.id,
    rating: parseInt(request.params.rating, 10),
  };
  await rate(rating);
  response.redirect(request.baseUrl);
}
