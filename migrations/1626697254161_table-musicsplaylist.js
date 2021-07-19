exports.up = (pgm) => {
  pgm.createTable('musicsplaylist', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      references: 'playlists',
      notNull: true,
    },
    music_id: {
      type: 'VARCHAR(50)',
      references: 'musics',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('musicsplaylist');
};
