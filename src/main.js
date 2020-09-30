var module = (function () {
    let gameContainer;
    let matrix;
    let totalBombs = 0;
    let isOver = false;

    // Calculate the count of bombs around a tile
    function getAdjBombCount (matrix, i, j) {
        let adjBc = 0;
        if (matrix[i] && matrix[i][j - 1] != undefined && matrix[i][j - 1] == -1) {
            adjBc ++;
        }
        if (matrix[i - 1] && matrix[i - 1][j - 1] != undefined && matrix[i - 1][j - 1] == -1) {
            adjBc ++;
        }
        if (matrix[i - 1] && matrix[i - 1][j] != undefined && matrix[i - 1][j] == -1) {
            adjBc ++;
        }
        if (matrix[i - 1] && matrix[i - 1][j + 1] != undefined && matrix[i - 1][j + 1] == -1) {
            adjBc ++;
        }
        if (matrix[i] && matrix[i][j + 1] != undefined && matrix[i][j + 1] == -1) {
            adjBc ++;
        }
        if (matrix[i + 1] && matrix[i + 1][j + 1] != undefined && matrix[i + 1][j + 1] == -1) {
            adjBc ++;
        }
        if (matrix[i + 1] && matrix[i + 1][j] != undefined && matrix[i + 1][j] == -1) {
            adjBc ++;
        }
        if (matrix[i + 1] && matrix[i + 1][j - 1] != undefined && matrix[i + 1][j - 1] == -1) {
            adjBc ++;
        }
        return adjBc;
    }

    // Entry point for the game
    // Creates the matrix and calls render method
    function generateGame () {
        let rows = Number(document.getElementById("rows").value);
        let columns = Number(document.getElementById("cols").value);
        isOver = false;
        if (rows > 50 || columns > 50 || rows <= 0 || columns <= 0) {
            let message = document.getElementById('message');
            message.innerText = `Cannot create game of size [${rows}] X [${columns}]`;
            return;
        }
        totalBombs = 0;
        matrix = new Array(rows);
        for (let i = 0; i < rows; i++) {
            matrix[i] = new Array(columns);
        }
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                temp = Math.random() < 0.7;
                matrix[i][j] = temp ? 0 : -1;
                if (!temp) {
                    totalBombs++;
                }
            }
        }
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if (matrix[i][j] != -1) {
                    matrix[i][j] = getAdjBombCount(matrix, i, j);
                }
            }
        }
        renderMatrix(matrix, rows, columns);
    }

    // Actual rendering logic
    function renderMatrix (matrix, rows, columns) {
        gameContainer = document.getElementById('gameContainer');
        let message = document.getElementById('message');
        message.innerText = '';
        gameContainer.innerHTML = '';
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                let temp = document.createElement('div');
                temp.classList.add('blocks');
                temp.id = `tile-${i}-${j}`;
                gameContainer.appendChild(temp);
            }
        }
        gameContainer.setAttribute('style', `${getGridAttrs(rows, columns)}`);
        gameContainer.addEventListener("click", tileClickHandler);
        gameContainer.addEventListener("contextmenu", rightClickHandler);
        message.style.color = "red";
        message.innerText = `Total Mines Left: ${totalBombs}`;
    }

    // Handler for left click event
    function tileClickHandler (event) {
        if ((event.target.attributes.flag && event.target.attributes.flag.value == "true") || 
            event.target.style.backgroundImage == 'none' ||
            isOver) {
            return;
        }
        let row = Number(event.target.id.split('-')[1]);
        let col = Number(event.target.id.split('-')[2]);
        let clickedTileValue = matrix[row][col];
        if (clickedTileValue != -1) {
            if (clickedTileValue == 0) {
                event.target.innerText = '';
                event.target.style.backgroundImage = 'none';
                open(row, col, {});
            } else {
                event.target.innerText = clickedTileValue;
                event.target.style.backgroundImage = 'none';
                unwrapNeighbours(row, col, {});
            }
            let message = document.getElementById('message');
            message.innerText = `Total Mines Left: ${totalBombs}`;
        } else {
            matrix[row][col] = -2;
            endGame();
        }
    }
    // Handler for right click event
    function rightClickHandler (event) {
        event.preventDefault();
        if (event.target.style.backgroundImage == 'none' || isOver) {
            return;
        }
        if (event.target.attributes.flag && event.target.attributes.flag.value == "true") {
            event.target.style.backgroundImage = `url("./img/base.svg")`;
            event.target.setAttribute('flag', false);
            totalBombs++;
        } else {
            event.target.style.backgroundImage = `url("./img/flag.svg")`;
            event.target.setAttribute('flag', true);
            totalBombs--;
        }
        let message = document.getElementById('message');
        message.innerText = `Total Mines Left: ${totalBombs}`;
        if (totalBombs == 0) {
            checkGameStatus();
        }
    }

    // This function recursively (DFS) reveals the tiles adjacent to the tiles which are empty
    function open (i,j, visited) {
        if (matrix[i] && matrix[i][j - 1] != undefined) {
            let el = document.getElementById(`tile-${i}-${j-1}`);
            el.innerText = matrix[i][j - 1] ? matrix[i][j - 1] : '';
            el.style.backgroundImage = 'none';
            if ( !matrix[i][j - 1] && !visited[`${i}_${j - 1}`]) {
                visited[`${i}_${j - 1}`] = true;
                open(i, j - 1, visited);
            }
        }
        if (matrix[i - 1] && matrix[i - 1][j - 1] != undefined) {
            let el = document.getElementById(`tile-${i-1}-${j-1}`);
            el.innerText = matrix[i - 1][j - 1] ? matrix[i - 1][j - 1] : '';
            el.style.backgroundImage = 'none';
            if (!matrix[i - 1][j - 1] && !visited[`${i-1}_${j - 1}`]) {
                visited[`${i-1}_${j - 1}`] = true;
                open(i - 1, j - 1, visited);
            }
        }
        if (matrix[i - 1] && matrix[i - 1][j] != undefined) {
            let el = document.getElementById(`tile-${i - 1}-${j}`);
            el.innerText = matrix[i - 1][j] ? matrix[i - 1][j] : '';
            el.style.backgroundImage = 'none';
            if (!matrix[i - 1][j] && !visited[`${i-1}_${j}`]) {
                visited[`${i-1}_${j}`] = true;
                open(i - 1, j, visited);
            }
        }
        if (matrix[i - 1] && matrix[i - 1][j + 1] != undefined) {
            let el = document.getElementById(`tile-${i - 1}-${j + 1}`);
            el.innerText = matrix[i - 1][j + 1] ? matrix[i - 1][j + 1] : '';
            el.style.backgroundImage = 'none';
            if (!matrix[i - 1][j + 1] && !visited[`${i - 1}_${j + 1}`]) {
                visited[`${i - 1}_${j + 1}`] = true;
                open(i - 1, j + 1, visited);
            }
        }
        if (matrix[i] && matrix[i][j + 1] != undefined) {
            let el = document.getElementById(`tile-${i}-${j + 1}`);
            el.innerText = matrix[i][j + 1] ? matrix[i][j + 1] : '';
            el.style.backgroundImage = 'none';
            if (!matrix[i][j + 1] && !visited[`${i}_${j + 1}`]) {
                visited[`${i}_${j + 1}`] = true;
                open(i, j + 1, visited);
            }
        }
        if (matrix[i + 1] && matrix[i + 1][j + 1] != undefined) {
            let el = document.getElementById(`tile-${i + 1}-${j + 1}`);
            el.innerText = matrix[i + 1][j + 1] ? matrix[i + 1][j + 1] : '';
            el.style.backgroundImage = 'none';
            if (!matrix[i + 1][j + 1] && !visited[`${i + 1}_${j + 1}`]) {
                visited[`${i + 1}_${j + 1}`] = true;
                open(i + 1, j + 1, visited);
            }
        }
        if (matrix[i + 1] && matrix[i + 1][j] != undefined) {
            let el = document.getElementById(`tile-${i + 1}-${j}`);
            el.innerText = matrix[i + 1][j] ? matrix[i + 1][j] : '';
            el.style.backgroundImage = 'none';
            if (!matrix[i + 1][j] && !visited[`${i + 1}_${j}`]) {
                visited[`${i + 1}_${j}`] = true;
                open(i + 1, j, visited);
            }
        }
        if (matrix[i + 1] && matrix[i + 1][j - 1] != undefined) {
            let el = document.getElementById(`tile-${i + 1}-${j - 1}`);
            el.innerText = matrix[i + 1][j - 1] ? matrix[i + 1][j - 1] : '';
            el.style.backgroundImage = 'none';
            if (!matrix[i + 1][j - 1] && !visited[`${i + 1}_${j - 1}`]) {
                visited[`${i + 1}_${j - 1}`] = true;
                open(i + 1, j - 1, visited);
            }
        }
    }

    // This method reveals the tiles that are empty and lie adjacent to the clicked tile
    function unwrapNeighbours (i, j, visited) {
        if (matrix[i] && !visited[`${i}_${j - 1}`] && matrix[i][j - 1] == 0) {
            let el = document.getElementById(`tile-${i}-${j-1}`);
            el.innerText = '';
            el.style.backgroundImage = 'none';
            open(i , j - 1, visited);
        }
        if (matrix[i - 1] && !visited[`${i - 1}_${j - 1}`] && matrix[i - 1][j - 1] == 0) {
            let el = document.getElementById(`tile-${i-1}-${j-1}`);
            el.innerText = '';
            el.style.backgroundImage = 'none';
            open(i - 1, j - 1, visited);
        }
        if (matrix[i - 1] && !visited[`${i - 1}_${j}`] && matrix[i - 1][j] == 0) {
            let el = document.getElementById(`tile-${i - 1}-${j}`);
            el.innerText = '';
            el.style.backgroundImage = 'none';
            open(i - 1, j, visited);
        }
        if (matrix[i - 1] && !visited[`${i + 1}_${j + 1}`] && matrix[i - 1][j + 1] == 0) {
            let el = document.getElementById(`tile-${i - 1}-${j + 1}`);
            el.innerText = '';
            el.style.backgroundImage = 'none';
            open(i - 1, j + 1, visited);
        }
        if (matrix[i] && !visited[`${i}_${j + 1}`] && matrix[i][j + 1] == 0) {
            let el = document.getElementById(`tile-${i}-${j + 1}`);
            el.innerText = '';
            el.style.backgroundImage = 'none';
            open(i, j + 1, visited);
        }
        if (matrix[i + 1] && !visited[`${i + 1}_${j + 1}`] && matrix[i + 1][j + 1] == 0) {
            let el = document.getElementById(`tile-${i + 1}-${j + 1}`);
            el.innerText = '';
            el.style.backgroundImage = 'none';
            open(i + 1, j + 1, visited);
        }
        if (matrix[i + 1] && !visited[`${i + 1}_${j}`] && matrix[i + 1][j] == 0) {
            let el = document.getElementById(`tile-${i + 1}-${j}`);
            el.innerText = '';
            el.style.backgroundImage = 'none';
            open(i + 1, j, visited);
        }
        if (matrix[i + 1] && !visited[`${i + 1}_${j - 1}`] && matrix[i + 1][j - 1] == 0) {
            let el = document.getElementById(`tile-${i + 1}-${j - 1}`);
            el.innerText = '';
            el.style.backgroundImage = 'none';
            open(i + 1, j - 1, visited);
        }
        return;
    }

    // This method handles the game ending logic when a tile containing mine is clicked
    function endGame () {
        isOver = true;
        for(let i = 0; i < gameContainer.children.length; i++) {
            let row = gameContainer.children[i].id.split('-')[1];
            let col = gameContainer.children[i].id.split('-')[2];
            let clickedTileValue = matrix[row][col];
            if (clickedTileValue == -2) {
                gameContainer.children[i].style.backgroundImage = `url("./img/bomb_red.svg")`;
            } else if (clickedTileValue == -1) {
                gameContainer.children[i].style.backgroundImage = `url("./img/bomb.svg")`;
            } else if (clickedTileValue == 0) {
                gameContainer.children[i].innerText = '';
                gameContainer.children[i].style.backgroundImage = 'none';
            } else {
                gameContainer.children[i].innerText = clickedTileValue;
                gameContainer.children[i].style.backgroundImage = 'none';
            }
        }
        let message = document.getElementById('message');
        message.innerText = "Game over"
    }

    // it is called once the bomb count becomes zero to check is the game is won
    function checkGameStatus () {
        let status = true;
        for(let i = 0; i < gameContainer.children.length; i++) {
            // check if all cells are either open or flagged
            if ((gameContainer.children[i].attributes.flag && gameContainer.children[i].attributes.flag.value == "true") ||
            gameContainer.children[i].style.backgroundImage == 'none') {
                continue;
            } else {
                status = false;
            }
        }
        if (status) {
            let message = document.getElementById('message');
            message.innerText = "You Won!!";
            message.style.color = "green";
            isOver = true;
        } else {
            return;
        }
    }

    // helper function to generate the grid
    function getGridAttrs (rows, columns) {
        let row = `repeat(${rows}, 2rem)`;
        let col = `repeat(${columns}, 2rem)`;
        return `grid-template-rows: ${row}; grid-template-columns: ${col};`
    }

    return {
        'generateGame': generateGame
    };
})();
