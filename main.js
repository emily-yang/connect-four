const BOARDROWS = 6;
const BOARDCOLS = 7;

const board = document.getElementById('board');
const playerIndicator = document.getElementById('player-indicator');

let boardHTML = '';
for (let row = BOARDROWS - 1; row >= 0; row--) {
	for (let col = 0; col < BOARDCOLS; col++) {
		boardHTML += `
			<div class='slot'>
				<label for='slot${col}${row}'>
					<input onchange='runTurn(this)' type='checkbox' ${row > 0 ? 'disabled' : ''} name='slot${col}${row}' id='slot${col}${row}' data-row='${row}' data-col='${col}'>
				</label>
			</div>
		`;
	}
}

// set the board html
board.innerHTML = boardHTML;

let player1Turn = true;

function runTurn(input) {
	// change color of label
	input.parentElement.className = player1Turn ? 'player1' : 'player2';

	// change what's disabled
	// disable the input
	input.disabled = true;
	// enable the slot at (row+1, col)
	const {row, col} = input.dataset;
	// check if input is on the top row
	if (row < BOARDROWS - 1) {
		const neighbor = document.getElementById(`slot${col}${parseInt(row)+1}`);
		neighbor.disabled = false;
	}

// 	// check if there's a win
const isWin = checkWin(parseInt(col), parseInt(row), player1Turn ? 'player1' : 'player2');
if (isWin) {
	alert('winner!');
	return;
}

	// change whose turn it is
	player1Turn = !player1Turn;
	// update player-indicator text
	if (player1Turn) {
		playerIndicator.innerText = 'PLAYER1 ';
		playerIndicator.className = 'player1';
	} else {
	playerIndicator.innerText = 'PLAYER2 ';
	playerIndicator.className = 'player2';
	}

}

function checkWin(col, row, currPlayer) {
	// check down
	return checkDown(col, row, currPlayer) || checkAcross(col, row, currPlayer) || checkDiagonals(col, row, currPlayer);
	// check across
	// check diagonals
}

function checkDown(col, row, currPlayer) {
	if (row < 3) return false; // can't connect 4 verically if height < 4
	for (let j = row - 1; j > row - 4; j--) {
		const currSlotPlayer = document.getElementById(`slot${col}${j}`).parentElement.className;
		if (currSlotPlayer !== currPlayer) return false;
	}
	return true;

}

function checkAcross(col, row, currPlayer) {
	let sameColorNeighbors = 0;

	// check to the right
	for (let i = col + 1; i < col + 4; i++) {
		// break if out of bounds
		if (i >= BOARDCOLS) break;
		const currSlotPlayer = document.getElementById(`slot${i}${row}`).parentElement.className;
		if (currSlotPlayer === currPlayer) sameColorNeighbors+= 1;
		else break;
	}
	// check to the left
	for (let i = col - 1; i > col - 4; i--) {
		// break if out of bounds
		if (i < 0) break;
		const currSlotPlayer = document.getElementById(`slot${i}${row}`).parentElement.className;
		if (currSlotPlayer === currPlayer) sameColorNeighbors+= 1;
		else break;
	}
	return sameColorNeighbors >= 3;
}

function checkDiagonals(col, row, currPlayer) {
	return checkUpLeft(col, row,currPlayer) || checkUpRight(col, row,currPlayer);
}

function checkUpLeft(col, row, currPlayer) {
	let sameColorNeighbors = 0;

	// search up left
	for (let i = 1; i < 4; i++) {
		// break if out of bounds
		if (col - i < 0 || row + i >= BOARDROWS) break;
		const currSlotPlayer = document.getElementById(`slot${col-i}${row+i}`).parentElement.className;
		if (currSlotPlayer === currPlayer) sameColorNeighbors += 1;
		else break;
	}

	// serach down right
	for (let i = 1; i < 4; i++) {
		// break if out of bounds
		if (col + i >= BOARDCOLS || row - i < 0) break;
		const currSlotPlayer = document.getElementById(`slot${col+i}${row-i}`).parentElement.className;
		if (currSlotPlayer === currPlayer) sameColorNeighbors += 1;
		else break;
	}
	return sameColorNeighbors >= 3;
}

function checkUpRight(col, row, currPlayer) {
	let sameColorNeighbors = 0;

	// search up right
	for (let i = 1; i < 4; i++) {
		// break if out of bounds
		if (col + i >= BOARDCOLS || row + i >= BOARDROWS) break;
		const currSlotPlayer = document.getElementById(`slot${col+i}${row+i}`).parentElement.className;
		if (currSlotPlayer === currPlayer) sameColorNeighbors += 1;
		else break;
	}

	// serach down left
	for (let i = 1; i < 4; i++) {
		// break if out of bounds
		if (col - i < 0 || row - i < 0) break;
		const currSlotPlayer = document.getElementById(`slot${col-i}${row-i}`).parentElement.className;
		if (currSlotPlayer === currPlayer) sameColorNeighbors += 1;
		else break;
	}
	return sameColorNeighbors >= 3;
}