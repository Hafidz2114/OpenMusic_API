const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistsongsService {
  constructor(collaborationService, cacheService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
    this._cacheService = cacheService;
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

    await this._cacheService.delete(`playlist_songs:${playlistId}`);
    return result.rows[0].id;
  }

  async getPlaylistsongs(playlistId) {
    try {
      const result = await this._cacheService.get(`playlist_songs:${playlistId}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: `SELECT musics.id, musics.title, musics.performer FROM musics 
               LEFT JOIN musicsplaylist ON musicsplaylist.music_id = musics.id 
               LEFT JOIN playlists ON playlists.id = musicsplaylist.playlist_id
               WHERE playlists.id = $1`,
        values: [playlistId],
      };

      const result = await this._pool.query(query);
      await this._cacheService.set(`playlist_songs:${playlistId}`, JSON.stringify(result.rows));
      return result.rows;
    }
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

    await this._cacheService.delete(`playlist_songs:${playlistId}`);
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak memiliki hak untuk mengakses resource ini!');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsongsService;
