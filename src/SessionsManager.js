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

		console.log('Game created! gameCode, hostCode', gameCode, hostCode);
	}

	joinGame(gameCode, playerName, socket) {
		const playerCode = this.gameHelper.generatePlayerCode();
		if (!this.sessions[gameCode]) {
			throw new Error('Session with game code "' + gameCode + '" does not exist');
		}
		const { players } = this.sessions[gameCode];
		if (players.some((player) => player.playerName === playerName)) {
			throw new Error(`Player with name "${playerName}" is already in this game`);
		}

		if (playerName.length < 3 || playerName.length > 20) {
			throw new Error(`Player name must be between 3 and 20 chars - "${playerName}" is invalid`);
		}

		const isVip = players.length === 0;
		const score = 0;
		players.push({ playerCode, playerName, socket, isVip, score });

		return { playerCode, isVip };
	}

	getPlayerBySocketId(socketId) {
		return this.sessions.map((session) => {
			return session.players.map((player) => {
				if (player.socketId === socketId) {
					return player;
				}
			});
		});
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

		console.log('start round: ', categoryList, letter);

		this.getHostSocket(gameCode).emit('start-round', { categoryList, letter });
		this.getPlayerSockets(gameCode).forEach((socket) => socket.emit('start-round', { categoryList, letter }));
	}

	submitAnswers(gameCode, playerCode, playerName, answers) {
		const { activeRound, players } = this.getGame(gameCode);
		if (!activeRound.submissions) activeRound.submissions = {};
		activeRound.submissions[playerCode] = {
			playerCode,
			playerName,
			answers,
			marks: {},
		};
		console.log('active round: ', activeRound);

		this.getHostSocket(gameCode).emit('player-has-submitted', { playerName });

		// Check if all players have submitted
		const allPlayersHaveSubmitted = players.every((player) =>
			activeRound.submissions.hasOwnProperty(player.playerCode)
		);
		if (allPlayersHaveSubmitted) {
			this.getHostSocket(gameCode).emit('submissions-ready', {
				activeRound,
			});
			this.getPlayerSockets(gameCode).forEach((socket) => socket.emit('submissions-ready', { activeRound }));
		}
	}

	roundTimesUp(gameCode) {
		console.log('sending time is up to players!');

		this.getPlayerSockets(gameCode).forEach(
			(socket) => socket.emit('times-up') // force player clients to submit
		);
	}

	reviewNext(gameCode, currentIndex) {
		console.log('sending review next to players!');

		this.getPlayerSockets(gameCode).forEach((socket) => socket.emit('review-next-toplayer', { currentIndex }));
	}

	markAnswer(gameCode, playerCode, mark) {
		const game = this.getGame(gameCode);
		const ownPlayerName = game.players.find((p) => p.playerCode === playerCode).playerName;

		console.log('gars', game, game.activeRound, game.activeRound.submissions);
		const submission = Object.values(game.activeRound.submissions).find(
			({ playerName }) => playerName === mark.playerName
		);

		if (!submission.marks.hasOwnProperty(mark.questionIndex)) {
			submission.marks[mark.questionIndex] = {};
		}

		submission.marks[mark.questionIndex][ownPlayerName] = mark.isApproved;

		this.getHostSocket(gameCode).emit('marked-answer', {
			submissions: game.activeRound.submissions,
		});
	}

	updatePlayerScores(gameCode, players) {
		const game = this.getGame(gameCode);

		players.forEach((player) => {
			game.players.find((p) => p.playerName === player.playerName).score = player.score;
		});
	}
};
