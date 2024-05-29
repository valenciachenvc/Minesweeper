var board = [];
var rows = 8;
var columns = 8;

// get user input for number of mines
// var minesCount = prompt("Number of Mines for this Game (1-10):");

let minesCount;

while (true) {
    minesCount = prompt("Number of Mines for this Game (1-10):");

    // Convert input to a number
    minesCount = Number(minesCount);

    // Check if the input is a whole number and within the range 1-10
    if (Number.isInteger(minesCount) && minesCount >= 1 && minesCount <= 10) {
        break;
    } else {
        alert("Please write a whole number from 1-10.");
    }
}

var minesLocation = []; // for mines bombs, "row-column", "r-c" e.g. "2-3", "5-5", "4,1"

var tilesClicked = 0; //goal of game: click all tiles except ones containing mines bombs
var flagEnabled = false;

var gameOver = false;

window.onload = function() {
    startGame();
}

function setMines(){
    // minesLocation.push("2-2");
    // minesLocation.push("2-3");
    // minesLocation.push("5-6");
    // minesLocation.push("3-4");
    // minesLocation.push("1-1");

    let minesLeft = minesCount; // to randomise mines location
    while (minesLeft > 0){
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();

        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}


function startGame() {
    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("flag-button").addEventListener("click", setFlag);
    setMines();

    //populate our board with mines
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            //<div id="0-0"></div>
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickTile);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }

    console.log(board);
}

function setFlag() {
    if (flagEnabled) {
        flagEnabled = false;
        document.getElementById("flag-button").style.backgroundColor = "lightgray"; // when player doesn't want to add flag (wants to open tiles)
    }
    else {
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "darkgray"; // when player wants to add or remove flag (doesn't want to open tiles)
    }
}

function clickTile() {
    if (gameOver || this.classList.contains("tile-clicked")) {
        return;
    }

    let tile = this;
    if (flagEnabled) { // when player wants to add or remove flag
        if(tile.innerText == ""){
            tile.innerText = "🚩";
        }
        else if (tile.innerText == "🚩"){
            tile.innerText = "";
        }
        return; // so that when player put flag on a mine, it won't accidentally trigger the mine bomb
    }

    if(minesLocation.includes(tile.id)) {
        alert("GAME OVER");
        gameOver = true;
        revealMines();
        return;
    }


    let coords = tile.id.split("-"); // "0-0" -> ["0","0"]
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c);

}

function revealMines() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";
            }
        }
    }
}

function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) { // make sure r and c are within boundaries of the board
        return;
    }
    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    } // code will not do lines 107-125 (no additional recursive calls)

    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1; 

    let minesFound = 0;

    // top 3 of the cliked tile
    minesFound += checkTile(r-1, c-1) // top left
    minesFound += checkTile(r-1, c) // top middle
    minesFound += checkTile(r-1, c+1) // top right

    // left and right, same row
    minesFound += checkTile(r, c-1); // left
    minesFound += checkTile(r, c+1); // right

    // bottom 3
    minesFound += checkTile(r+1, c-1) // bottom left
    minesFound += checkTile(r+1, c) // bottom middle
    minesFound += checkTile(r+1, c+1) // bottom right

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    }
    else {
        // top 3
        checkMine(r-1, c-1); //top left
        checkMine(r-1, c); //top middle
        checkMine(r-1, c+1); //top right

        // left and right
        checkMine(r, c-1); //left
        checkMine(r, c+1); //right

        // bottom 3
        checkMine(r+1, c-1); //bottom left
        checkMine(r+1, c); //bottom middle
        checkMine(r+1, c+1); //bottom right
    }

    if (tilesClicked == rows * columns - minesCount) { // if all tiles are cliked except for the mines, game won
        document.getElementById("mines-count").innerText = "Cleared";
        gameOver = true;
        alert("YOU WIN");
    }

}


function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) { // check for out of bounds
        return 0;
    }
    if (minesLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}