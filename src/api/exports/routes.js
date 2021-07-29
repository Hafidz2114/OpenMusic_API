const routes = (handler) => [
  {
    method: 'POST',
    path: '/export/playlists/{playlistId}',
    handler: handler.postExportPlaylistHandler,
    options: {
      auth: 'openMusicApp_jwt',
    },
  },
];

module.exports = routes;
