var row_obj = [];
var curr_score = 0;
var total_score = 0;
var curr_word = "";
// Initializes base values for letters
const SCORING_VALUES = [
    { "letter": "A", "count": 9, "value": 1 },
    { "letter": "B", "count": 2, "value": 3 },
    { "letter": "C", "count": 2, "value": 3 },
    { "letter": "D", "count": 4, "value": 2 },
    { "letter": "E", "count": 12, "value": 1},
    { "letter": "F", "count": 2, "value": 4 },
    { "letter": "G", "count": 3, "value": 2 },
    { "letter": "H", "count": 2, "value": 4 },
    { "letter": "I", "count": 9, "value": 1 },
    { "letter": "J", "count": 1, "value": 8 },
    { "letter": "K", "count": 1, "value": 5 },
    { "letter": "L", "count": 4, "value": 1 },
    { "letter": "M", "count": 2, "value": 3 },
    { "letter": "N", "count": 6, "value": 1 },
    { "letter": "O", "count": 8, "value": 1 },
    { "letter": "P", "count": 2, "value": 3 },
    { "letter": "Q", "count": 1, "value": 10},
    { "letter": "R", "count": 6, "value": 1 },
    { "letter": "S", "count": 4, "value": 1 },
    { "letter": "T", "count": 6, "value": 1 },
    { "letter": "U", "count": 4, "value": 1 },
    { "letter": "V", "count": 2, "value": 4 },
    { "letter": "W", "count": 2, "value": 4 },
    { "letter": "X", "count": 1, "value": 8 },
    { "letter": "Y", "count": 2, "value": 4 },
    { "letter": "Z", "count": 1, "value": 10},
]
temp_score_values = SCORING_VALUES;

function clear_letter_id() {
    for (var i = 0; i < row_obj.length; i++) {
        row_obj[i].letter_id = "";
    }
}

function reset_word() {
    // clears clear_letter_id() and resets the rack
    clear_letter_id()
    $(".scrabble_rack").empty();
    get_board_tiles();
    // Updates the html
    document.getElementById('curr-word').innerHTML = "Current Word: ";
    document.getElementById('word-score').innerHTML = "Current Score: " + total_score;
    // Prepares drag n drop function
    prepare_drop()
}

function prepare_drop() {
    // Make each tile droppable, and only eccept tiles with "tile class"
    $(".board-tile").droppable({
        accept: '.tile',
        // When a tile is dropped onto a board, adds to row_obj and calculates new word score
        drop: function(event, ui) {
            var letter = $(ui.draggable).attr('id');
            var element_id = $(this).attr('id');
            var row_index = element_id[0];
            row_obj[row_index].letter_id = letter;
            calculate_word_score();
        },
        // When tile is dragged out of board
        out: function(event, ui) {
            var letter = ui.draggable.attr('id');
            var drop_id = $(this).attr('id');
            var row_index = drop_id[0];
            // If the dragged tile matches letter_id, set letter_id to empty
            if (letter == row_obj[row_index].letter_id) {
                row_obj[row_index].letter_id = "";
            } else {
                return false;
            }
            calculate_word_score()
        }
    });
    // Scrabble Rack is droppable
    $(".scrabble_rack").droppable({
        accept: '.tile'
    });
    // Makes each tile draggable 
    $(".tile").draggable({
        snap: ".board-tile,.scrabble_rack",
        snapMode: "inner",
        revert: "invalid"
    });
}
// Sets up the Board
function create_board() {
    var board = document.getElementById('scrabble-board');
    // Iterates through the 7 tiles
    for (var i = 0; i < 7; i++) {
        var id;
        var src_file;
        var img = document.createElement('img');
        // Tiles 1 and 5 are double word values
        if (i == 1 || i == 5) {
            src_file = 'graphics_data/double_word.jpg';
            id = 'double-word';
        } else {
            src_file = 'graphics_data/blank_board.jpg';
            id = 'blank';
        }
        img.id = i + '-' + id;
        img.src = src_file;
        img.className = 'board-tile';
        row_obj[i] = {
            'type': id,
            'letter_id': '',
            'img_id': img.id
        }
        board.appendChild(img);
    }
}
// Sets up the new tiles
function get_board_tiles() {
    // Gets total number of letters
    let totalLetterCount = temp_score_values.reduce((acc, letter) => acc + letter.count, 0);
    // For loop sets the new tile values based on their probability of being chosen
    for (let i = 0; i < 7; i++) {
        const randomNumber = Math.floor(Math.random() * totalLetterCount);
        let cumulativeCount = 0;
        for (const letter of temp_score_values ) {
            cumulativeCount += letter.count;
            if (randomNumber < cumulativeCount) {
                $(".scrabble_rack").append('<img class="tile" id="tile-' + letter.letter + '"src="graphics_data/letters/' + letter.letter + '.jpg">')
                letter.count--;
                totalLetterCount--;
                break;
           }
        }
    }
}
// Calculates the Word Score
function calculate_word_score() {
    curr_score = 0;
    curr_word = "";
    // Loops through each tile
    for (var i = 0; i < row_obj.length; i++) {
        // Loops through each scoring value
        for (var j = 0; j < SCORING_VALUES.length; j++) {
            var multiplier = 1;
            if (row_obj[i].letter_id != "" && (row_obj[i].letter_id[5] == SCORING_VALUES[j].letter)) {
                // letter gets added to word
                curr_word += row_obj[i].letter_id[5];
                // checks if letter is on a multiplier
                if (row_obj[i].type.includes('blank')) {
                    multiplier = 1;
                } 
                else {
                    multiplier = 2;
                }
                // score gets increased
                curr_score += (SCORING_VALUES[j].value * multiplier);
                // updates html
                document.getElementById('word-score').innerHTML = "Word Score: " + curr_score;
            }
        }
    }
    document.getElementById('curr-word').innerHTML = "Current Word: " + curr_word;
}
// Gets the length of the word
function word_length() {
    var length = 0;
    for (var i = 0; i < row_obj.length; i++) {
        if (row_obj[i].letter_id != "") {
            length++;
        }
    }
    return length;
}
// 
function submit() {
    var curr_word_length = word_length()
    // Makes sure word is longer than 2 letters
    if (curr_word_length < 2) {
        alert('You need to play at least two letters in order to submit a valid word for scoring! You are current at ' + curr_word_length + ' letters.');
        return false;
    }
    // updates html
    document.getElementById("last-word").innerHTML = "Last Word: " + curr_word;
    document.getElementById("last-score").innerHTML = "Last Score: " + curr_score;
    // updates the score and resets the word
    total_score += curr_score;
    reset_word()
}

$(document).ready(function () {
    create_board()
    get_board_tiles()
    prepare_drop()

    $("#reset_word").click(function () {
        total_score = 0;
        temp_score_values = SCORING_VALUES;
        reset_word()
    });

    $("#submit_word").click(function () {
        submit()
    });

});