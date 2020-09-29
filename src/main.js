var module = (function () {
    let gameContainer;
    let matrix;
    let totalBombs = 0;

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

    function generateGame () {
        let rows = Number(document.getElementById("rows").value);
        let columns = Number(document.getElementById("cols").value);
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
        gameContainer.setAttribute('style', `display:grid; ${getGridAttrs(rows, columns)}`);
        gameContainer.addEventListener("click", tileClickHandler);
        gameContainer.addEventListener("contextmenu", rightClickHandler);
        message.innerText = `Total Mines Left: ${totalBombs}`;
    }

    function tileClickHandler (event) {
        if (event.target.attributes.flag && event.target.attributes.flag.value == "true") {
            return;
        } else if (event.target.style.backgroundImage == 'none') {
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

    function rightClickHandler (event) {
        event.preventDefault();
        if (event.target.attributes.flag && event.target.attributes.flag.value == "true") {
            event.target.style.backgroundImage = `url("./img/base.svg")`;
            event.target.setAttribute('flag', false);
            totalBombs++;
        } else {
            event.target.style.backgroundImage = `url("./img/flag.svg")`;
            event.target.setAttribute('flag', true);
            totalBombs--;
        }
    }

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

    function endGame () {
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

    function getGridAttrs (rows, columns) {
        let row = `repeat(${rows}, 2rem)`;
        let col = `repeat(${columns}, 2rem)`;
        return `grid-template-rows: ${row}; grid-template-columns: ${col};`
    }

    return {
        'generateGame': generateGame
    };
})();