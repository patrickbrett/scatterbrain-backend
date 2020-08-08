module.exports = class SessionsManager {
  sessions;
  gameHelper;

  constructor(gameHelper) {
    this.sessions = {}
    this.gameHelper = gameHelper;
  }

  createGame(gameCode, hostCode, hostSocket) {
    this.sessions[gameCode] = {
      gameCode,
      hostCode,
      hostSocket,
      players: []
    }

    console.log('Game created! gameCode, hostCode', gameCode, hostCode)
  }

  joinGame(gameCode, playerName, socket) {
    const playerCode = this.gameHelper.generatePlayerCode();
    if (!this.sessions[gameCode]) {
      throw new Error('Session with game code "' + gameCode + '" does not exist')
    }
    const { players } = this.sessions[gameCode];
    if (players.some(player => player.playerName === playerName)) {
      throw new Error(`Player with name "${playerName}" is already in this game`);
    }

    const isVip = (players.length === 0);
    players.push({ playerCode, playerName, socket, isVip });

    return { playerCode, isVip };
  }

  getHostSocket(gameCode) {
    return this.sessions[gameCode].hostSocket;
  }

  getVip(gameCode) {
    return this.sessions[gameCode].players.find((p => p.isVip));
  }

  getPlayerSockets(gameCode) {
    return this.sessions[gameCode].players.map(p => p.socket);
  }
}