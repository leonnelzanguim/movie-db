import express from 'express';
import morgan from 'morgan';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { createWriteStream } from 'fs';

import { router as movieRouter } from './movie/index.js';

const app = express();

const accesLogStream = createWriteStream('access.log', { flag: 'a' });

app.use(express.static(`${dirname(fileURLToPath(import.meta.url))}/public`));

app.use(morgan('common', { immediate: true, stream: accesLogStream }));

app.use(express.urlencoded({ extended: false }));

app.use('/movie', movieRouter);

app.get('/', (request, response) => response.redirect('/movie'));

app.listen(8080, () => {
  console.log('server is listening to http://localhost:8080');
});
