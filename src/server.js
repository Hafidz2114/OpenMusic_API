require('dotenv').config();

const Hapi = require('@hapi/hapi');
const musics = require('./api/songs');
const MusicsService = require('./services/postgres/MusicsService');
const MusicsValidator = require('./validator/songs');

const init = async () => {
  const musicsService = new MusicsService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: musics,
    options: {
      service: musicsService,
      validator: MusicsValidator,
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
