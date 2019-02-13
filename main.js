const BOARDROWS = 6;
const BOARDCOLS = 7;

const board = document.getElementById('board');
const playerIndicator = document.getElementById('player-indicator');
const turnIndicator = document.getElementById('turn-indicator');
const dropTrack = document.getElementById('drop-track');

let trackHTML = '';
for (let col = 0; col < BOARDCOLS; col++) {
	trackHTML += `<div class='player1' data-col='${col}'></div>`;
}
dropTrack.innerHTML = trackHTML;
console.log(trackHTML);

let boardHTML = '';
for (let row = BOARDROWS - 1; row >= 0; row--) {
	for (let col = 0; col < BOARDCOLS; col++) {
		boardHTML += `
		<div class='slot'>
			<div id='slot${col}${row}'></div>
		</div>
		`;
		// boardHTML += `
		// <div class='slot>
		// <label for='slot${col}${row}'>
		// <input onchange='runTurn(this)' type='checkbox' ${row > 0 ? 'disabled' : ''} name='slot${col}${row}' id='slot${col}${row}' data-row='${row}' data-col='${col}'>
		// </label>
		// </div>
		// `;
	}
}

// set the board html
board.innerHTML = boardHTML;
let player1Turn = true;
const openSlots = Array(BOARDCOLS).fill(0);

dropTrack.childNodes.forEach(column => {
	column.addEventListener('click', handleClick);
});

function handleClick(e) {
	const col = parseInt(e.target.dataset.col);
	addPiece(col, openSlots[col]);
	openSlots[col]++;

	// disable column if full
	if (openSlots[col] >= BOARDCOLS - 1){
		const filledColumn = dropTrack.childNodes[col];
		// filledColumn.removeEventListener('click', handleClick);
		// filledColumn.style.opacity = 0;
		filledColumn.style.visibility = "hidden";
	}
}



function addPiece(col, row) {
	const newPiece = document.getElementById(`slot${col}${row}`);
	newPiece.className = player1Turn? 'player1' : 'player2';


	// 	// check if there's a win
	const isWin = checkWin(parseInt(col), parseInt(row), player1Turn ? 'player1' : 'player2');
	if (isWin) {
		endGame();
		return;
	}
	// change whose turn it is
	player1Turn = !player1Turn;
	// update player-indicator text
	if (player1Turn) {
		playerIndicator.innerText = 'PLAYER 1 ';
		playerIndicator.className = 'player1';
	} else {
		playerIndicator.innerText = 'PLAYER 2 ';
		playerIndicator.className = 'player2';
	}

	// update color of drop track
	dropTrack.childNodes.forEach(slot => {
		slot.className = player1Turn ? 'player1' : 'player2';
	});
}

function endGame() {
	const player = player1Turn ? 'player1' : 'player2';
	turnIndicator.innerHTML = `🎉 <span class="${player}" id="player-indicator">${player1Turn ? 'PLAYER 1' : 'PLAYER 2'}</span> wins 🎉`;

	dropTrack.childNodes.forEach(col => {
		col.style.visibility = 'hidden';
	})
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
		const currSlotPlayer = document.getElementById(`slot${col}${j}`).className;
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
		const currSlotPlayer = document.getElementById(`slot${i}${row}`).className;
		if (currSlotPlayer === currPlayer) sameColorNeighbors+= 1;
		else break;
	}
	// check to the left
	for (let i = col - 1; i > col - 4; i--) {
		// break if out of bounds
		if (i < 0) break;
		const currSlotPlayer = document.getElementById(`slot${i}${row}`).className;
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
		const currSlotPlayer = document.getElementById(`slot${col-i}${row+i}`).className;
		if (currSlotPlayer === currPlayer) sameColorNeighbors += 1;
		else break;
	}

	// serach down right
	for (let i = 1; i < 4; i++) {
		// break if out of bounds
		if (col + i >= BOARDCOLS || row - i < 0) break;
		const currSlotPlayer = document.getElementById(`slot${col+i}${row-i}`).className;
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
		const currSlotPlayer = document.getElementById(`slot${col+i}${row+i}`).className;
		if (currSlotPlayer === currPlayer) sameColorNeighbors += 1;
		else break;
	}

	// serach down left
	for (let i = 1; i < 4; i++) {
		// break if out of bounds
		if (col - i < 0 || row - i < 0) break;
		const currSlotPlayer = document.getElementById(`slot${col-i}${row-i}`).className;
		if (currSlotPlayer === currPlayer) sameColorNeighbors += 1;
		else break;
	}
	return sameColorNeighbors >= 3;
}