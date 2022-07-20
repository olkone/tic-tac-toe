const GameBoard = (() => {

    const _board = ["1", "2", "3","4","5","6","7","8","9"];

    const _box = {marker: '',};

    const getBoard = () => {return _board;};

    const makeBoard = () => {
        for(let i=0; i < 10; i++) {
            _board.push(_box);
        };
        DOM.displayBoard();
    };

    const newMark = (mark, index) => {
        _board[index] = { mark };
        DOM.displayBoard();
    };

    return {
        getBoard,
        makeBoard,
        newMark
    };

})(); // IIFE

const DOM = (() => {
    // function that takes board array, each box marker property, 
    // then displays them on the board

    const boardDisplay = document.querySelector("#gameboard");
    const startBtn = document.querySelector("#start-btn");

    const displayBoard = () => {
        for (box in GameBoard.getBoard()) {
            const newBox = document.createElement("div");
            newBox.classList.add("box");
            newBox.innerText = GameBoard.getBoard()[box];
            boardDisplay.appendChild(newBox);
        };
    };

    const startGame = () => {
        displayBoard();
        startBtn.style.display = "none";
    };

    startBtn.addEventListener("click", () => {
        startGame();
    });

    return {
        displayBoard,
    };

})();

const Game = (() => {
    return;
})();