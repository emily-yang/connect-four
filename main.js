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
}