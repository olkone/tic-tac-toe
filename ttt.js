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

    const addMark = (e) => {
        const p1 = Game.playerOne;
        const p2 = Game.playerTwo;

        switch(true) {
            case p1.turn:
                e.target.innerText = p1.marker;
                // updates gameboard object
                newMark(p1.marker, e.target.getAttribute("data-index"));
                break;

            case p2.turn:
                e.target.innerText = p2.marker;
                newMark(p2.marker, e.target.getAttribute("data-index"));
                break;
        }
        // TO DO: add game logic so already-marked boxes can't be marked again
    };

    return {
        getBoard,
        makeBoard,
        addMark
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

    const _switchTurns = () => { // Add to Player object?
        if (playerOne.turn === true) {
            playerOne.turn = false;
            playerTwo.turn = true;
        } else {
            playerOne.turn = true;
            playerTwo.turn = false;
        }
    };

    const checkEntry = (e) => {
        if (e.target.innerText === "") {
            GameBoard.addMark(e);
            _switchTurns();
        }
    };

    return {
        playerOne,
        playerTwo,
        checkEntry,
    }
})();

const DOM = (() => {
    const boardDisplay = document.querySelector("#gameboard");
    const startBtn = document.querySelector("#start-btn");
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
                Game.checkEntry(e);
            });
        });
    };

    const startGame = () => {
        GameBoard.makeBoard();
        _initBoard();
        boardDisplay.style.display = "grid";
        startBtn.style.display = "none";
    };

    startBtn.addEventListener("click", () => {
        startGame();
    });

    return {
    };

})();
