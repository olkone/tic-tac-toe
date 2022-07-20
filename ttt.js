const GameBoard = (() => {
    const _board = [];
    const _box = {mark: ''};

    const getBoard = () => {return _board;};

    const makeBoard = () => {
        for(let i=0; i < 9; i++) {
            _board.push(_box.mark);
        };
    };

    const newMark = (mark, index) => {
        _board[index] = { mark };
    };

    return {
        getBoard,
        makeBoard,
        newMark
    };

})(); // IIFE

const Game = (() => {

    // TO DO: make player factory function

    const playerOne = {
        name: 'Player One',
        marker: 'X',
        score: 0,
        turn: true,
    }

    const playerTwo = {
        name: 'Player Two',
        marker: 'O',
        score: 0,
        turn: false,
    };

    const switchTurns = () => {
        if (playerOne.turn === true) {
            playerOne.turn = false;
            playerTwo.turn = true;
        } else {
            playerOne.turn = true;
            playerTwo.turn = false;
        }
    };

    const addMark = (e) => {
        switch(true) {
            case playerOne.turn:
                e.target.innerText = playerOne.marker;
                // updates gameboard object
                GameBoard.newMark(playerOne.marker, e.target.getAttribute("data-index"));
                break;

            case playerTwo.turn:
                e.target.innerText = playerTwo.marker;
                GameBoard.newMark(playerTwo.marker, e.target.getAttribute("data-index"));
                break;
        }
        // TO DO: add game logic so already-marked boxes can't be marked again
    };

    return {
        playerOne,
        playerTwo,
        addMark,
        switchTurns,
    }
})();

const DOM = (() => {
    const boardDisplay = document.querySelector("#gameboard");
    const startBtn = document.querySelector("#start-btn");
    const gameBoard = GameBoard.getBoard();

    const displayBoard = () => {
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
                Game.addMark(e);
                Game.switchTurns();
            });
        });
    };

    const startGame = () => {
        GameBoard.makeBoard();
        displayBoard();
        boardDisplay.style.display = "grid";
        startBtn.style.display = "none";
    };

    startBtn.addEventListener("click", () => {
        startGame();
    });

    return {
        displayBoard,
    };

})();
