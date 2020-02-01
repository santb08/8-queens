// @constants
const size = 8;
const absoluteSolutions = [];

const getButton = (id, x, y) => document.getElementById(`${id}-${x}-${y}`);

const findDiagonalButtons = (id, x, y, iter = 1, current = []) => {
    const leftDown = x - iter >= 0 && y + iter <= size;
    const leftUp = x - iter >= 0 && y - iter >= 0;
    const rightDown = x + iter <= size && y + iter <= size;
    const rightUp = x + iter <= size && y - iter >= 0;

    if (!leftDown && !leftUp && !rightDown && !rightUp) return current;
    if (leftDown) {
        current.push(getButton(id, x - iter, y + iter));
    }
    if (leftUp) {
        current.push(getButton(id, x - iter, y - iter));
    }
    if(rightDown) {
        current.push(getButton(id, x + iter, y + iter));
    }
    if (rightUp) {
        current.push(getButton(id, x + iter, y - iter));
    }
    return findDiagonalButtons(id, x, y, iter + 1, current).filter(el => Boolean(el));
}

const handleOnHover = (event) => {
    const [id, x, y] = event.target.id.split('-').map(el => Number.parseInt(el));
    const diagonals = findDiagonalButtons(id, x, y);
    diagonals.forEach(el => el.classList.add('selected'));
}

const handleOnBlur = (event) => {
    const [id, x, y] = event.target.id.split('-').map(el => Number.parseInt(el));
    const diagonals = findDiagonalButtons(id, x, y);
    diagonals.forEach(el => el.classList.remove('selected'));
}


// Adding HTML elements
function createPad(solution, idSolution) {
    const pad = Array.from(new Array(size))
        .map(() => Array.from(new Array(size))
            .map((_, index) => size - index - 1));
    const divPad = document.createElement('div');
    divPad.setAttribute('id', idSolution);
    divPad.classList.add('divPad');

    const valSolution = [];
    pad.map((el, colIndex) => {
        const row = document.createElement('div');
        row.setAttribute('class', 'col');

        el.map((el, rowIndex) => {
            const divButton = document.createElement('div');
            const text = document.createTextNode(el);
            divButton.appendChild(text);
            divButton.setAttribute('id', `${idSolution}-${colIndex}-${size - rowIndex - 1}`);
            row.appendChild(divButton);
            if (solution[colIndex][rowIndex] == 'Q') {
                divButton.classList.add('queen');
                divButton.addEventListener('mouseover', handleOnHover);
                divButton.addEventListener('mouseleave', handleOnBlur);
                valSolution.push(divButton.textContent.toString());
            }
        });
        divPad.appendChild(row);
    });

    const number = Number.parseInt(valSolution.join(''));
    const divNumber = document.createElement('div');

    divNumber.appendChild(document.createTextNode(number));
    divNumber.classList.add('number');
    divPad.appendChild(divNumber);

    absoluteSolutions.push(number);
    document.body.appendChild(divPad);
}

const safe = (pad, row, col) => {
	// Same column
	for (let i = 0; i < row; i++)
		if (pad[i][col] == 'Q')
			return false;

	// Same \ diagonal
	for (let i = row, j = col; i >= 0 && j >= 0; i--, j--)
		if (pad[i][j] == 'Q')
			return false;

	// Same / diagonal
	for (let i = row, j = col; i >= 0 && j < size; i--, j++)
		if (pad[i][j] == 'Q')
			return false;

	return true;
}

const padSolutions = [];

const solve = (pad, row) =>{
	if (row == size){
        let solution = [];
		for (let i = 0; i < size; i++) {
            let row = '';
            for (let j = 0; j < size; j++)
                row += pad[i][j];
            solution.push(row.split(''));
		}
        padSolutions.push(solution);
		return;
	}
	for (let i = 0; i < size; i++) {
		if (safe(pad, row, i)) {
			pad[row][i] = 'Q';
			solve(pad, row + 1);
			pad[row][i] = '-';
		}
	}
}

const logicPad = Array.from(new Array(size))
    .map(() => Array.from(new Array(size))
        .map(() => '-'));

solve(logicPad, 0);

padSolutions.forEach((solution, index) => createPad(solution, index));

const biggestSolutionIndex = absoluteSolutions.reduce((indexBiggest, val, index) =>
    val > absoluteSolutions[indexBiggest] ? index : indexBiggest, 0);

document.getElementById(biggestSolutionIndex).classList.add('solution');
console.log('biggest', biggestSolutionIndex);