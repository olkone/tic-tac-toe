const GameBoard = (() => {
    let _board = [];
    let _box = {mark: ''};

    const getBoard = () => {return _board;};

    const makeBoard = () => {
        for(let i=0; i < 9; i++) {
            _board[i] = _box.mark;
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
    const board = GameBoard.getBoard();

    const getMark = () => {
        return;

    };

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

    const _addPoint = (mark) => {
        getPlayerWithMark(mark).score ++;
    }

    // This helps avoid hard-coding a mark to each player
    const getPlayerWithMark = (mark) => {
        for (player of players) {
            if (player.mark === mark) {
                return player;
            };
        };
    };

    const checkTie = () => {
        const numEmptyBoxes = board.length - board.filter(String).length;
        
        if (numEmptyBoxes === 0) {
            return true;
        }
    };

    const checkWinner = () => {
        const Os = _getIndices().OIndices;
        const Xs = _getIndices().XIndices;

        for (pattern of _winPatterns) {

            if (_checkPattern(pattern, Xs) === false && _checkPattern(pattern, Os) === false && checkTie() === true) {
                console.log('tied!!!!!!');
            } else if (_checkPattern(pattern, Xs)) {
                _addPoint('X');
                DOM.displayWinner('X'); // instead, return 'X' then write another function that checks results
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
        checkTie,
        getPlayerWithMark,
    };

})();

const DOM = (() => {
    const startArea = document.querySelector(".start-area");
    const gameArea = document.querySelector(".game-area");
    const winDisplay = document.querySelector("#player-wins");
    const turnContainer = document.querySelector("#turn-cont");

    const startBtn = document.querySelector("#start-btn");
    const nextBtn = document.querySelector("#next-btn");
    const againBtn = document.querySelector("#play-again-btn");

    const _displayTurn = () => {
        const playerTurn = document.querySelector("#player-turn");
        turnContainer.style.display = "flex";

        if (Game.playerOne.turn === true) {
            playerTurn.innerText = Game.playerOne.name;
        } else {
            playerTurn.innerText = Game.playerTwo.name;
        };
    };

    const _initBoard = () => {
        const gameBoard = GameBoard.getBoard();
        const boardDisplay = document.querySelector("#gameboard");

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
                Game.checkEmpty(e);
                _displayTurn();
                Game.checkWinner();
                Game.checkTie();
            }); 
        });
    };

    const _displayScore = () => {
        const p1Score = document.querySelector("#p1-score");
        const p2Score = document.querySelector("#p2-score");
        p1Score.innerText = Game.playerOne.score;
        p2Score.innerText = Game.playerTwo.score;
    };

    const startGame = () => {
        GameBoard.makeBoard();
        _initBoard();
        _displayScore();
        gameArea.style.display = "flex";
        startArea.style.display = "none";
    };

    const _resetGame = () => {
        GameBoard.clearBoard();
        Game.playerOne.score = 0;
        Game.playerTwo.score = 0;
        _displayScore();
        _displayTurn();
        againBtn.style.display = "none";
        winDisplay.style.display = "none";
    };

    const endGame = () => {
        if (Game.playerOne.score > 2 || Game.playerTwo.score > 2) {
            againBtn.style.display = "block";
            againBtn.addEventListener("click", () => {
                _resetGame();
            });

        } else {
            nextBtn.style.display = "block";
            nextBtn.addEventListener("click", () => {
                _displayTurn();
                GameBoard.clearBoard();
                nextBtn.style.display = "none";
                winDisplay.style.display = "none";
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
        _displayTurn();
    });

    return {
        startGame,
        endGame,
        displayWinner,
    };

})();