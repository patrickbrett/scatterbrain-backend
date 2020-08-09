module.exports = class SessionsManager {
  sessions;
  gameHelper;

  constructor(gameHelper) {
    this.sessions = {};
    this.gameHelper = gameHelper;
  }

  createGame(gameCode, hostCode, hostSocket) {
    this.sessions[gameCode] = {
      gameCode,
      hostCode,
      hostSocket,
      players: [],
    };

    console.log("Game created! gameCode, hostCode", gameCode, hostCode);
  }

  joinGame(gameCode, playerName, socket) {
    const playerCode = this.gameHelper.generatePlayerCode();
    if (!this.sessions[gameCode]) {
      throw new Error(
        'Session with game code "' + gameCode + '" does not exist'
      );
    }
    const { players } = this.sessions[gameCode];
    if (players.some((player) => player.playerName === playerName)) {
      throw new Error(
        `Player with name "${playerName}" is already in this game`
      );
    }

    const isVip = players.length === 0;
    players.push({ playerCode, playerName, socket, isVip });

    return { playerCode, isVip };
  }

  getGame(gameCode) {
    return this.sessions[gameCode];
  }

  getHostSocket(gameCode) {
    return this.sessions[gameCode].hostSocket;
  }

  getVip(gameCode) {
    return this.sessions[gameCode].players.find((p) => p.isVip);
  }

  getPlayerSockets(gameCode) {
    return this.sessions[gameCode].players.map((p) => p.socket);
  }

  startRound(gameCode) {
    const categoryList = this.gameHelper.getRandomCategoryList();
    const letter = this.gameHelper.getRandomLetter();

    this.getGame(gameCode).activeRound = {
      categoryList,
      letter,
    };

    console.log("start round: ", categoryList, letter);

    this.getHostSocket(gameCode).emit("start-round", { categoryList, letter });
    this.getPlayerSockets(gameCode).forEach((socket) =>
      socket.emit("start-round", { categoryList, letter })
    );
  }

  submitAnswers(gameCode, playerCode, playerName, answers) {
    const { activeRound, players } = this.getGame(gameCode);
    if (!activeRound.submissions) activeRound.submissions = {};
    activeRound.submissions[playerCode] = {
      playerCode,
      playerName,
      answers,
    };
    console.log("active round: ", activeRound);

    this.getHostSocket(gameCode).emit("player-has-submitted", { playerName });

    // Check if all players have submitted
    const allPlayersHaveSubmitted = players.every((player) =>
      activeRound.submissions.hasOwnProperty(player.playerCode)
    );
    if (allPlayersHaveSubmitted) {
      this.getHostSocket(gameCode).emit("submissions-ready", {
        activeRound,
      });
      this.getPlayerSockets(gameCode).forEach((socket) =>
        socket.emit("submissions-ready")
      );
    }
  }

  roundTimesUp(gameCode) {
    console.log('sending time is up to players!')
    
    this.getPlayerSockets(gameCode).forEach((socket) =>
      socket.emit("times-up") // force player clients to submit
    );
  }
};
