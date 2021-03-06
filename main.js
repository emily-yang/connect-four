const BOARDROWS = 6;
const BOARDCOLS = 7;

const board = document.getElementById('board');
const grid = document.getElementById('grid');
let playerIndicator = document.getElementById('player-indicator');
const turnIndicator = document.getElementById('turn-indicator');
const dropTrack = document.getElementById('drop-track');
const discSound = document.getElementById('disc-sound');
const clatterSound = document.getElementById('clatter-sound');
const winSound = document.getElementById('win-sound');
const drawSound = document.getElementById('draw-sound');
let userInitiatedFlag = false;
let discsPlayed = 0;

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

let player1Turn, clickedCol;
const openSlots = new Array(BOARDCOLS);
const trackTop = dropTrack.offsetTop;

// match grid overlay to board coordinates
const boardTop = board.offsetTop;
const boardLeft = board.left;
grid.style.top = `${boardTop}px`;
grid.style.left = `${boardLeft}px`;

initializeGame();

/* set header, board, and game to their starting states */
function initializeGame() {
	userInitiatedFlag ? clatterSound.play() : userInitiatedFlag = true;
	dropTrack.innerHTML = trackHTML;
	board.innerHTML = boardHTML;
	player1Turn = true;
	openSlots.fill(0);
	dropTrack.childNodes.forEach(column => {
		column.addEventListener('click', handleClick);
	});
	turnIndicator.className = '';
	turnIndicator.innerHTML = "<span class='player1' id='player-indicator'>Player 1 </span>Turn";
	playerIndicator = document.getElementById('player-indicator');
	discsPlayed = 0;
}

/* handle user clicking on a column to place their disc */
function handleClick(e) {
	// temporarily hide the clicked column until drop is complete
	clickedCol = e.target;
	clickedCol.style.visibility = 'hidden';

	const col = parseInt(e.target.dataset.col);
	placeDisc(col, openSlots[col]);
	openSlots[col]++;

	// disable column if full
	if (openSlots[col] >= BOARDCOLS - 1)
		dropTrack.childNodes[col].style.visibility = "hidden";
}

/* Drop a disc into the designated slot location  */
function placeDisc(col, row) {
	discsPlayed++;

	// get coords of the slot to be filled (ending location)
	const slotToFill = document.getElementById(`slot${col}${row}`);
	const slotOffset = slotToFill.getBoundingClientRect();
	const {top, left} = slotOffset;

	// create a new disc element to be dropped
	const disc = document.createElement('div');
	document.body.appendChild(disc);
	disc.setAttribute('id','disc');
	disc.style.top = `${trackTop}px`;
	disc.style.left = `${left}px`;
	disc.classList.add(`${player1Turn? 'player1' : 'player2'}`);
	//  move the disc vertically from track to slot location
	window.setTimeout(function() {
		disc.style.transform = `translateY(${top - trackTop}px)`;
	},80);

	disc.addEventListener('transitionend', function() {
		discSound.play();
		// make clicked slot visible again
		if (openSlots[col] < BOARDROWS)
			clickedCol.style.visibility = 'visible';
		// // add color to slot
		slotToFill.classList.add(`${player1Turn? 'player1' : 'player2'}`);

		// remove disc after slot is filled
		document.body.removeChild(disc);

		// check if there's a win
		const isWin = checkWin(parseInt(col), parseInt(row), player1Turn ? 'player1' : 'player2');
		isWin ?	showWinner() : updatePlayerIndicator();
	});
}

/* Display the winner and prevent further plays */
function showWinner() {
	dropTrack.childNodes.forEach(col => {
		col.style.display = 'none';
	});

	setTimeout(() => {
		winSound.play();
		const player = player1Turn ? 'player1' : 'player2';
		turnIndicator.innerHTML = `🎉 <span class="${player}" id="player-indicator">${player1Turn ? 'PLAYER 1' : 'PLAYER 2'}</span> wins 🎉`;
		turnIndicator.className = 'end';
	}, 300);
}

/* Update status bar to show if there is a winner or whose turn is up */
function updatePlayerIndicator() {
	if (discsPlayed === BOARDCOLS * BOARDROWS) {
		turnIndicator.innerHTML = 'NOBODY WINS...';
		drawSound.play();
		return;
	}

	// // change whose turn it is
	player1Turn = !player1Turn;
	// // update color in drop track
	dropTrack.childNodes.forEach(slot => {
		slot.className = player1Turn ? 'player1' : 'player2';
	});

	if (player1Turn) {
		playerIndicator.innerText = 'PLAYER 1 ';
		playerIndicator.className = 'player1';
	} else {
		playerIndicator.innerText = 'PLAYER 2 ';
		playerIndicator.className = 'player2';
	}
}

/* Check if any player has won */
function checkWin(col, row, currPlayer) {
	// check down, across, and diagonals
	return checkDown(col, row, currPlayer) || checkAcross(col, row, currPlayer) || checkDiagonals(col, row, currPlayer);
}

/* Check if there is a vertical four-in-a-row */
function checkDown(col, row, currPlayer) {
	if (row < 3) return false; // can't connect 4 verically if height < 4
	for (let j = row - 1; j > row - 4; j--) {
		const currSlotPlayer = document.getElementById(`slot${col}${j}`).classList;
		if (!currSlotPlayer.contains(currPlayer)) return false;
	}
	return true;
}

/* Check if there is a horizontal four-in-a-row */
function checkAcross(col, row, currPlayer) {
	let sameColorNeighbors = 0;

	// check to the right
	for (let i = col + 1; i < col + 4; i++) {
		// break if out of bounds
		if (i >= BOARDCOLS) break;
		const currSlotPlayer = document.getElementById(`slot${i}${row}`).classList;
		if (currSlotPlayer.contains(currPlayer)) sameColorNeighbors+= 1;
		else break;
	}
	// check to the left
	for (let i = col - 1; i > col - 4; i--) {
		// break if out of bounds
		if (i < 0) break;
		const currSlotPlayer = document.getElementById(`slot${i}${row}`).classList;
		if (currSlotPlayer.contains(currPlayer)) sameColorNeighbors+= 1;
		else break;
	}
	return sameColorNeighbors >= 3;
}

/* Check if there is a diagonal four-in-a-row */
function checkDiagonals(col, row, currPlayer) {
	return checkUpLeft(col, row,currPlayer) || checkUpRight(col, row,currPlayer);
}

/* Check if there are four in a row in backward slash direction */
function checkUpLeft(col, row, currPlayer) {
	let sameColorNeighbors = 0;

	// search up left
	for (let i = 1; i < 4; i++) {
		// break if out of bounds
		if (col - i < 0 || row + i >= BOARDROWS) break;
		const currSlotPlayer = document.getElementById(`slot${col-i}${row+i}`).classList;
		if (currSlotPlayer.contains(currPlayer)) sameColorNeighbors += 1;
		else break;
	}

	// serach down right
	for (let i = 1; i < 4; i++) {
		// break if out of bounds
		if (col + i >= BOARDCOLS || row - i < 0) break;
		const currSlotPlayer = document.getElementById(`slot${col+i}${row-i}`).classList;
		if (currSlotPlayer.contains(currPlayer)) sameColorNeighbors += 1;
		else break;
	}
	return sameColorNeighbors >= 3;
}

/* Check if there are four in a row in forward slash direction */
function checkUpRight(col, row, currPlayer) {
	let sameColorNeighbors = 0;

	// search up right
	for (let i = 1; i < 4; i++) {
		// break if out of bounds
		if (col + i >= BOARDCOLS || row + i >= BOARDROWS) break;
		const currSlotPlayer = document.getElementById(`slot${col+i}${row+i}`).classList;
		if (currSlotPlayer.contains(currPlayer)) sameColorNeighbors += 1;
		else break;
	}

	// serach down left
	for (let i = 1; i < 4; i++) {
		// break if out of bounds
		if (col - i < 0 || row - i < 0) break;
		const currSlotPlayer = document.getElementById(`slot${col-i}${row-i}`).classList;
		if (currSlotPlayer.contains(currPlayer)) sameColorNeighbors += 1;
		else break;
	}
	return sameColorNeighbors >= 3;
}