const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistsongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistsong({ playlistId, songId }) {
    const id = `plysg-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO musicsplaylist VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu telah gagal di tambahkan ke playlist.');
    }

    return result.rows[0].id;
  }

  async getPlaylistsongs(owner) {
    const query = {
      text: `SELECT musics.id, musics.title, musics.performer FROM musics 
             RIGHT JOIN musicsplaylist ON musicsplaylist.music_id = musics.id 
             RIGHT JOIN playlists ON playlists.id = musicsplaylist.playlist_id
             WHERE playlists.owner = $1 GROUP BY musicsplaylist.music_id, musics.id`,
      values: [owner],
    };

    const result = await this._pool.query(query);
    return result;
  }

  async deletePlaylistsongById(playlistId, songId) {
    const query = {
      text: 'DELETE FROM musicsplaylist WHERE playlist_id = $1 AND music_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal dihapus. Id tidak ditemukan!');
    }
  }

  async verifyPlaylistOwner(id, verification) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = result.rows[0];

    if (playlist.owner !== verification) {
      throw new AuthorizationError('Anda tidak memiliki hak untuk mengakses resource ini!');
    }
  }

  async verifyPlaylistAccess(id, verification) {
    try {
      await this.verifyPlaylistOwner(id, verification);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundError('Playlist tidak ditemukan!');
      }
      try {
        await this._collaborationService.verifyCollaborator(id, verification);
      } catch {
        throw new AuthorizationError('Anda tidak memiliki hak untuk mengakses resource ini!');
      }
    }
  }
}

module.exports = PlaylistsongsService;
