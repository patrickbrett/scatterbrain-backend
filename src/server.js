// const express = require('express');
// const cors = require('cors');
// const app = express();
// app.use(express.json());
// app.use(cors());
const APP_PORT = 5050;
const GameHelper = require('./GameHelper');
const SessionsManager = require('./SessionsManager');
const gameHelper = new GameHelper();
const sessionsManager = new SessionsManager(gameHelper);

// app.listen(APP_PORT);
// console.log('listening on port ' + APP_PORT);

const io = require('socket.io')(3000);

io.on('connect', socket => {
  socket.on('create-game', () => {
    const gameCode = gameHelper.generateGameCode();
    const hostCode = gameHelper.generateHostCode();
  
    sessionsManager.createGame(gameCode, hostCode, socket);

    socket.emit('create-game-accepted', { gameCode, hostCode })
  })

  socket.on('join-game', (data) => {
    const { gameCode, playerName } = data;
    try {
      const { playerCode, isVip } = sessionsManager.joinGame(gameCode, playerName, socket)
      console.log('joined as player', gameCode, playerName, playerCode);
      console.log('Send join-game-accepted');
      socket.emit('join-game-accepted', { playerCode, isVip })

      const hostSocket = sessionsManager.getHostSocket(gameCode);
      hostSocket.emit('new-player-joined', { playerName, isVip });
    } catch(err) {
      console.error(err)
    }
  })

  socket.on('start-game', (data) => {
    const { gameCode, playerCode } = data;

    // Confirm that the player is VIP of the given game
    const vip = sessionsManager.getVip(gameCode);
    if (vip.playerCode !== playerCode) {
      console.log(vip, playerCode);
      console.error('Not the VIP!')
      return;
    }

    const hostSocket = sessionsManager.getHostSocket(gameCode);
    const playerSockets = sessionsManager.getPlayerSockets(gameCode);
    [hostSocket, ...playerSockets].forEach(socket => {
      socket.emit('game-started');
    })
  })

  socket.on('reload-host', data => {
    const { gameCode, hostCode } = data;

    // Confirm that the host code is correct
    const game = sessionsManager.getGame(gameCode);
    if (!game) {
      console.error('Game not found', gameCode);
      // TODO: send error down socket
      return;
    }
    if (game.hostCode !== hostCode) {
      console.error('Host code incorrect', hostCode, game.hostCode);
      // TODO: send error down socket
      return;
    }

    // Replace the host socket
    game.hostSocket = socket;

    const players = game.players.map(({ playerName, isVip })=> ({ playerName, isVip }));

    // Send the game info back to the host
    socket.emit('reload-host-accepted', { players });
  })

  socket.on('reload-player', data => {
    console.log('d', data);
    const { gameCode, playerCode } = data;

    // Confirm that the player is in the game
    const game = sessionsManager.getGame(gameCode);
    if (!game) {
      console.error('Game not found', gameCode);
      // TODO: send error down socket
      return;
    }
    const player = game.players.find(player => player.playerCode === playerCode)
    if (!player) {
      console.error('Player code incorrect. gameCode, playerCode', gameCode, playerCode);
      // TODO: send error down socket
      return;
    }

    // Replace the player socket
    player.socket = socket;

    const { isVip, playerName } = player;

    // Send the game info back to the host
    socket.emit('reload-player-accepted', { isVip, playerName });
  })

  socket.on('request-round-start', data => {
    const { gameCode, hostCode } = data;

    // TODO: improve abstraction, this is the same logic as above
    // Confirm that the host code is correct
    const game = sessionsManager.getGame(gameCode);
    if (!game) {
      console.error('Game not found', gameCode);
      // TODO: send error down socket
      return;
    }
    if (game.hostCode !== hostCode) {
      console.error('Host code incorrect', hostCode, game.hostCode);
      // TODO: send error down socket
      return;
    }

    sessionsManager.startRound(gameCode);
  })

  socket.on('send-answers', data => {
    const { answers, playerCode, gameCode } = data;
    console.log(answers);

    // TODO: DRY this out
    // Confirm that the player is in the game
    const game = sessionsManager.getGame(gameCode);
    if (!game) {
      console.error('Game not found', gameCode);
      // TODO: send error down socket
      return;
    }
    const player = game.players.find(player => player.playerCode === playerCode)
    if (!player) {
      console.error('Player code incorrect. gameCode, playerCode', gameCode, playerCode);
      // TODO: send error down socket
      return;
    }

    sessionsManager.submitAnswers(gameCode, playerCode, player.playerName, answers);
  })

  socket.on("round-times-up", data => {
    const { gameCode, hostCode } = data;

    // TODO: improve abstraction, this is the same logic as above
    // Confirm that the host code is correct
    const game = sessionsManager.getGame(gameCode);
    if (!game) {
      console.error('Game not found', gameCode);
      // TODO: send error down socket
      return;
    }
    if (game.hostCode !== hostCode) {
      console.error('Host code incorrect', hostCode, game.hostCode);
      // TODO: send error down socket
      return;
    }

    sessionsManager.roundTimesUp(gameCode);
  })
});