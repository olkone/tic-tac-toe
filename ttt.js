const GameBoard = (() => {
    let _board = [];
    let _box = {mark: ''};

    const getBoard = () => {return _board;};

    const makeBoard = () => {
        for(let i=0; i < 9; i++) {
            _board.push(_box.mark);
        };
    };

    const clearBoard = () => {
        const boxes = document.querySelectorAll(".box");

        boxes.forEach((box) => {
            box.innerText = "";
        });

        for(let i=0; i < 9; i++) {
            _board[i] = "";
        };
    };

    const _newMark = (mark, index) => {
        _board[index] = { mark };
    };

    const addMark = (e) => {
        const p1 = Game.playerOne;
        const p2 = Game.playerTwo;

        switch(true) {
            case p1.turn:
                e.target.innerText = p1.mark;
                _newMark(p1.mark, e.target.getAttribute("data-index"));
                break;

            case p2.turn:
                e.target.innerText = p2.mark;
                _newMark(p2.mark, e.target.getAttribute("data-index"));
                break;
        };
    };

    return {
        getBoard,
        clearBoard,
        makeBoard,
        addMark
    };

})(); // IIFE

const Game = (() => {

    // TO DO: make player factory function
    const playerOne = {
        name: 'Player One',
        mark: 'X',
        score: 0,
        turn: true,
        win: false,
    }

    const playerTwo = {
        name: 'Player Two',
        mark: 'O',
        score: 0,
        turn: false,
        win: false,
    };

    const players = [playerOne, playerTwo];

    const _winPatterns = [
        [0, 1, 2], // Horizontal
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6], // Vertical
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8], // Diagonal
        [2, 4, 6]
    ];

    const _switchTurns = () => { // Add to player factory function?
        if (playerOne.turn === true) {
            playerOne.turn = false;
            playerTwo.turn = true;
        } else {
            playerOne.turn = true;
            playerTwo.turn = false;
        }
    };

    const _getIndices = () => {
        const board = GameBoard.getBoard();
        let XIndices = [];
        let OIndices = [];

        for (box in board) {
            if (board[box].mark === 'X') {
                XIndices.push(Number(box));
            } else if (board[box].mark === 'O') {
                OIndices.push(Number(box));
            }
        }
        return {XIndices, OIndices}
    };

    const _checkPattern = (pattern, mark) => {
        return pattern.every(indices => mark.includes(indices));

    }

    // This helps avoid hard-coding a mark to each player
    const getPlayerWithMark = (mark) => {
        for (player of players) {
            if (player.mark === mark) {
                return player;
            };
        };
    };

    const _addPoint = (mark) => {
        getPlayerWithMark(mark).score ++;
    }

    const checkWinner = () => {
        const Os = _getIndices().OIndices;
        const Xs = _getIndices().XIndices;

        for (pattern of _winPatterns) {
            if (_checkPattern(pattern, Xs)) {
                _addPoint('X');
                DOM.displayWinner('X');
                DOM.endGame();

            } else if (_checkPattern(pattern, Os)) {
                _addPoint('O');
                DOM.displayWinner('O');
                DOM.endGame();
            }
        };
    };

    const checkEmpty = (e) => {
        if (e.target.innerText === "") {
            GameBoard.addMark(e);
            _switchTurns();
        }
    };

    return {
        playerOne,
        playerTwo,
        checkEmpty,
        checkWinner,
        getPlayerWithMark,
    }
})();

const DOM = (() => {
    const gameArea = document.querySelector(".game-area");
    const boardDisplay = document.querySelector("#gameboard");
    const winDisplay = document.querySelector("#player-wins");

    const turnContainer = document.querySelector("#turn-cont");
    const playerTurn = document.querySelector("#player-turn");

    const startBtn = document.querySelector("#start-btn");
    const againBtn = document.querySelector("#again-btn");

    const gameBoard = GameBoard.getBoard();

    const _initBoard = () => {
        for (box in gameBoard) {
            const newBox = document.createElement("div");
            newBox.classList.add("box");
            newBox.setAttribute("data-index", box);
            newBox.innerText = gameBoard[box];
            boardDisplay.appendChild(newBox);
        };

        const boxes = document.querySelectorAll(".box");

        boxes.forEach((box) => {
            box.addEventListener("click", (e) => {
                _displayTurn();
                Game.checkEmpty(e);
                Game.checkWinner();
            }); 
        });
    };

    const _displayScore = () => {
        const p1Score = document.querySelector("#p1-score");
        const p2Score = document.querySelector("#p2-score");
        p1Score.innerText = Game.playerOne.score;
        p2Score.innerText = Game.playerTwo.score;
    };

    const _displayTurn = () => {
        turnContainer.style.display = "flex";

        if (Game.playerOne.turn === true) {
            playerTurn.innerText = Game.playerOne.name;
        } else {
            playerTurn.innerText = Game.playerTwo.name;
        };
    };

    const startGame = () => {
        GameBoard.makeBoard();
        _initBoard();
        _displayTurn();
        _displayScore();
        gameArea.style.display = "flex";
        startBtn.style.display = "none";
    };

    const endGame = () => {
        if (Game.playerOne.score > 2 || Game.playerTwoscore > 2) {
            console.log('end');
        } else {
            againBtn.style.display = "block";
            againBtn.addEventListener("click", () => {
                GameBoard.clearBoard();
                againBtn.style.display = "none";
                winDisplay.style.display = "none";
                _displayTurn();
            });
        };
    };

    const displayWinner = (mark) => {
        winDisplay.innerText = Game.getPlayerWithMark(mark).name + ' wins!';
        _displayScore();
        winDisplay.style.display = "block";
        turnContainer.style.display = "none";
    };

    startBtn.addEventListener("click", () => {
        startGame();
    });

    return {
        startGame,
        endGame,
        displayWinner,
    };

})();
