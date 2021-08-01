class PlaylistsongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistsongsHandler = this.postPlaylistsongsHandler.bind(this);
    this.getPlaylistsongsHandler = this.getPlaylistsongsHandler.bind(this);
    this.deletePlaylistsongByIdHandler = this.deletePlaylistsongByIdHandler.bind(this);
  }

  async postPlaylistsongsHandler(request, h) {
    this._validator.validatePlaylistsongPayload(request.payload);
    const { songId } = request.payload;
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.addPlaylistsong({
      playlistId, songId,
    });

    const response = h.response({
      status: 'success',
      message: 'Lagu telah ditambahkan ke playlist!',
    });

    response.code(201);
    return response;
  }

  async getPlaylistsongsHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { playlistId } = request.params;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    const songs = await this._service.getPlaylistsongs(credentialId);

    return {
      status: 'success',
      data: {
        songs: songs.map((song) => ({
          id: song.id,
          title: song.title,
          performer: song.performer,
        })),
      },
    };
  }

  async deletePlaylistsongByIdHandler(request) {
    const { songId } = request.payload;
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.deletePlaylistsongById(playlistId, songId);

    return {
      status: 'success',
      message: 'Lagu telah terhapus dari playlist!',
    };
  }
}

module.exports = PlaylistsongsHandler;
