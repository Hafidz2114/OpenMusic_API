class MusicsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postMusicHandler = this.postMusicHandler.bind(this);
    this.getMusicsHandler = this.getMusicsHandler.bind(this);
    this.getMusicByIdHandler = this.getMusicByIdHandler.bind(this);
    this.putMusicByIdHandler = this.putMusicByIdHandler.bind(this);
    this.deleteMusicByIdHandler = this.deleteMusicByIdHandler.bind(this);
  }

  async postMusicHandler(request, h) {
    this._validator.validateMusicPayload(request.payload);
    const {
      title = 'untitled', year, performer, genre, duration,
    } = request.payload;

    const songId = await this._service.addSong({
      title, year, performer, genre, duration,
    });

    const response = h.response({
      status: 'success',
      message: 'Musik berhasil ditambahkan',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  async getMusicsHandler() {
    const songs = await this._service.getSongs();
    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async getMusicByIdHandler(request) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);
    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  async putMusicByIdHandler(request) {
    this._validator.validateMusicPayload(request.payload);
    const {
      title, year, performer, genre, duration,
    } = request.payload;
    const { id } = request.params;

    await this._service.editSongById(id, {
      title, year, performer, genre, duration,
    });

    return {
      status: 'success',
      message: 'Musik berhasil diperbarui',
    };
  }

  async deleteMusicByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteSongById(id);

    return {
      status: 'success',
      message: 'Musik berhasil dihapus',
    };
  }
}

module.exports = MusicsHandler;
