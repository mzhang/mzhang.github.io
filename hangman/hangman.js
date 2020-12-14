var wordBank = [];

let answer = '';
let maxWrong = 6;
let mistakes = 0;
let guessed = [];
let wordStatus = null;

function removeWord(wordBank, word) {
  var index = wordBank.indexOf(word);
  if (index > -1) wordBank.splice(index, 1);
  return wordBank;
}

function randomWord() {
  answer = wordBank[Math.floor(Math.random() * wordBank.length)];
  console.log(answer);
  updateAnswer();
}

function generateButtons() {
  let buttonsHTML = 'abcdefghijklmnopqrstuvwxyz'.split('').map(letter =>
    `
      <button
        class="btn btn-lg btn-primary m-2"
        id='` + letter + `'
        onClick="handleGuess('` + letter + `')"
      >
        ` + letter + `
      </button>
    `).join('');

  document.getElementById('keyboard').innerHTML = buttonsHTML;
}

function handleGuess(chosenLetter) {
  wordBank = wordBank.filter(word => word.length === answer.length);
  wordBank = wordBank.filter(word => word.indexOf(chosenLetter) < 0);
  if (wordBank.length > 0) randomWord();

  guessed.indexOf(chosenLetter) === -1 ? guessed.push(chosenLetter) : null;
  document.getElementById(chosenLetter).setAttribute('disabled', true);

  if (answer.indexOf(chosenLetter) >= 0) {
    guessedWord();
    checkIfGameWon();
  } else if (answer.indexOf(chosenLetter) === -1) {
    mistakes++;
    updateMistakes();
    checkIfGameLost();
    updateHangmanPicture();
  }
}

function updateHangmanPicture() {
  document.getElementById('hangmanPic').src = './assets/' + mistakes + '.png';
}

function updateAnswer() {
  document.getElementById('answer').innerHTML = answer;
}

function checkIfGameWon() {
  console.log(wordStatus)
  if (wordStatus === answer) {
    document.getElementById('message').innerHTML = 'You... actually won!';
    document.getElementById('keyboard').innerHTML = ""
  }
}

function checkIfGameLost() {
  if (mistakes === maxWrong) {
    document.getElementById('wordSpotlight').innerHTML = 'The answer was "' + answer + '"';
    document.getElementById('message').innerHTML = 'Better luck next time?';
    document.getElementById('keyboard').innerHTML = ""
  }
}

function guessedWord() {
  wordStatus = answer.split('').map(letter => (guessed.indexOf(letter) >= 0 ? letter : " _ ")).join('');
  document.getElementById('wordSpotlight').innerHTML = wordStatus;
}

function updateMistakes() {
  document.getElementById('mistakes').innerHTML = mistakes;
}

function reset() {
  document.getElementById('message').innerHTML = 'Good luck!';
  $.getJSON('https://raw.githubusercontent.com/mzhang/impossibleHangman/master/megaBank.json', function(data) {
    wordBank = data;
    mistakes = 0;
    guessed = [];
    document.getElementById('hangmanPic').src = './assets/0.png';

    randomWord();
    guessedWord();
    updateMistakes();
    generateButtons();
  });
}

document.getElementById('maxWrong').innerHTML = maxWrong;

reset();
