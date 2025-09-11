import passport from 'passport';
import expressSession from 'express-session';
import LocalStrategy from 'passport-local';

import { get } from './user/model.js';

import { createHash } from 'crypto';

export default function (app) {
  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser(async (id, done) => {
    const user = await get({ id });
    if (!user) {
      done('User not found');
    } else {
      done(null, user);
    }
  });

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const hash = createHash('md5').update(password).digest('hex');
      const user = await get({ username, password: hash });

      if (!user) {
        done(null, false);
      } else {
        done(null, user);
      }
    })
  );

  app.use(
    expressSession({
      secret: 'top secret',
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.post(
    '/login',
    passport.authenticate('local', { failureRedirect: '/login.html' }),
    (request, response) => {
      response.redirect('/');
    }
  );

  app.get('/logout', (request, response, next) => {
    request.logout(function (err) {
      if (err) return next(err);
      response.redirect('/');
    });
  });
}
