const BOARDROWS = 6;
const BOARDCOLS = 7;

const board = document.getElementById('board');
const grid = document.getElementById('grid');
const playerIndicator = document.getElementById('player-indicator');
const turnIndicator = document.getElementById('turn-indicator');
const dropTrack = document.getElementById('drop-track');

let trackHTML = '';
for (let col = 0; col < BOARDCOLS; col++) {
	trackHTML += `<div class='player1' data-col='${col}'></div>`;
}

let boardHTML = '';
for (let row = BOARDROWS - 1; row >= 0; row--) {
	for (let col = 0; col < BOARDCOLS; col++) {
		boardHTML += `
			<div id='slot${col}${row}' class='slot'></div>
		`;
	}
}

let player1Turn;
const openSlots = new Array(BOARDCOLS);
const trackTop = dropTrack.offsetTop;

const boardTop = board.offsetTop;
const boardLeft = board.offsetLeft;
grid.style.top = `${boardTop}px`;
grid.style.left = `${boardLeft}px`;

initializeGame();

function addDisc(disc) {
	const col = disc.dataset.col;
	const row = openSlots[col];
	const slotToFill = document.getElementById(`slot${col}${row}`);

	// TODO: animate drop
	const slotOffset = slotToFill.getBoundingClientRect();
	const {top, left} = slotOffset;

	disc.addEventListener('transitionend', function() {
		this.classList.toggle('no-transition');
		this.style.opacity = 0;
		// add color to slot
		slotToFill.classList.add(`${player1Turn? 'player1' : 'player2'}`);
		// change whose turn it is
		player1Turn = !player1Turn;
		// update color in drop track
		dropTrack.childNodes.forEach(slot => {
			slot.className = player1Turn ? 'player1' : 'player2';
		});
		this.style.transform = `translateY(0)`;
	}, {once: true});
	disc.style.transform = `translateY(${top - trackTop}px)`;




	// 	// check if there's a win
	const isWin = checkWin(parseInt(col), parseInt(row), player1Turn ? 'player1' : 'player2');
	if (isWin) {
		endGame();
		return;
	}
	// update player-indicator text
	if (player1Turn) {
		playerIndicator.innerText = 'PLAYER 1 ';
		playerIndicator.className = 'player1';
	} else {
		playerIndicator.innerText = 'PLAYER 2 ';
		playerIndicator.className = 'player2';
	}
}

// handle user clicking on a column to drop the disc into
function handleClick(e) {
	const col = parseInt(e.target.dataset.col);
	addDisc(e.target);
	openSlots[col]++;

	// disable column if full
	if (openSlots[col] >= BOARDCOLS - 1)
		dropTrack.childNodes[col].style.visibility = "hidden";
}

// reset entire board and game
function initializeGame() {
	dropTrack.innerHTML = trackHTML;
	board.innerHTML = boardHTML;
	player1Turn = true;
	openSlots.fill(0);
	dropTrack.childNodes.forEach(column => {
		column.addEventListener('click', handleClick);
	});
	turnIndicator.innerHTML = "<span class='player1' id='player-indicator'>Player 1 </span>Turn";
}

// announce winner and prevent further plays
function endGame() {
	const player = player1Turn ? 'player1' : 'player2';
	turnIndicator.innerHTML = `🎉 <span class="${player}" id="player-indicator">${player1Turn ? 'PLAYER 1' : 'PLAYER 2'}</span> wins 🎉`;

	dropTrack.childNodes.forEach(col => {
		col.style.visibility = 'hidden';
	})
}

function checkWin(col, row, currPlayer) {
	// check down, across, and diagonals
	return checkDown(col, row, currPlayer) || checkAcross(col, row, currPlayer) || checkDiagonals(col, row, currPlayer);
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