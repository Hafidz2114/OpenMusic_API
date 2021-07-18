const routes = (handler) => [
  {
    // postSongHandler hanya menerima dan menyimpan "satu" musik.
    method: 'POST',
    path: '/songs',
    handler: handler.postMusicHandler,
  },
  {
    // getSongsHandler mengembalikan "banyak" musik.
    method: 'GET',
    path: '/songs',
    handler: handler.getMusicsHandler,
  },
  {
    // getSongByIdHandler mengembalikan "satu" musik.
    method: 'GET',
    path: '/songs/{id}',
    handler: handler.getMusicByIdHandler,
  },
  {
    // putSongByIdHandler hanya menerima dan mengubah "satu" musik.
    method: 'PUT',
    path: '/songs/{id}',
    handler: handler.putMusicByIdHandler,
  },
  {
    // deleteSongByIdHandler hanya menghapus "satu" musik.
    method: 'DELETE',
    path: '/songs/{id}',
    handler: handler.deleteMusicByIdHandler,
  },
];

module.exports = routes;
