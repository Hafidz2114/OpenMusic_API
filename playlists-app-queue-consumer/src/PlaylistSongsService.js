const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async getSongsPlaylistId(playlistId) {
    const query = {
      text: `SELECT musics.id, musics.title, musics.performer FROM musics 
             LEFT JOIN musicsplaylist ON musicsplaylist.music_id = musics.id 
             LEFT JOIN playlists ON playlists.id = musicsplaylist.playlist_id
             WHERE playlists.owner = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows) {
      throw new InvariantError('Playlist Lagu gagal diambil');
    }

    return result.rows;
  }
}

module.exports = PlaylistSongsService;
