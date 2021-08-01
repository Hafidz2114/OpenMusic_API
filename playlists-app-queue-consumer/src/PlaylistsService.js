const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylist(playlistId, userId) {
    const query = {
      text: `SELECT musics.* FROM musicsplaylist
             LEFT JOIN playlists ON playlists.id = musicsplaylist.playlist_id
             LEFT JOIN musics ON musics.id = musicsplaylist.music_id
             LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
             WHERE musicsplaylist.playlist_id = $1 AND (playlists.owner = $2 OR collaborations.user_id = $2)`,
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows) {
      throw new InvariantError('Nama playlist gagal diambil');
    }

    return result.rows;
  }
}

module.exports = PlaylistsService;
