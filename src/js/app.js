// const emojis = ["🌼", "🌼", "🚗", "🚗", "🤡", "🤡", "🐵", "🐵", "💎", "💎", "💣", "💣", "🍟", "🍟", "🍄", "🍄"];

// let shuffleEmojis = emojis.sort(() => (Math.random() > .5) ? 2 : -1);

// for (let i = 0; i < emojis.length; i++) {
//     let box = document.createElement('div');
//     box.className = 'item';
//     box.innerHTML = shuffleEmojis[i];
//     document.querySelector('.game').appendChild(box);
// } 

// console.log('Hello!');

// Definiera emojis som ett objekt med tillhörande poäng
const emojis = {
    "🌼": 10,
    "🚗": 20,
    "🤡": 15,
    "🐵": 25,
    "💎": 30,
    "💣": 5,
    "🍟": 8,
    "🍄": 12
};

let player1Registered = false;
let player2Registered = false;

// Skapa ett objekt för att hålla reda på spelarnas poäng
const playerScores = {
    player1: 0,
    player2: 0
};

function updateScore(player, points) {
    // Uppdatera poängen för den angivna spelaren
    playerScores[player] += points;

    // Uppdatera score-board
    const playerScoreElement = document.querySelector(`.${player} .player-score`);
    if (playerScoreElement) {
        playerScoreElement.textContent = playerScores[player];
    }
    console.log(`Updating score for ${player} by ${points}. New score: ${playerScores[player]}`);

}

function startGame() {
    const player1Name = document.getElementById('player1-name').value;
    const player2Name = document.getElementById('player2-name').value;

    if (player1Name && player2Name) {
        localStorage.setItem('player1Name', player1Name);
        localStorage.setItem('player2Name', player2Name);

        player1Registered = true;
        player2Registered = true;

        document.getElementById('pre-menu').style.display = 'none';
        document.querySelector('.main-container').style.display = 'flex';

        const scoreBoard = document.querySelector('.score-board');

        scoreBoard.innerHTML = `
            <h3>Score</h3>
            <div class="player player1">
                <div class="player-name">${player1Name}</div>
                <p>:</p>
                <div class="player-score">0</div>
            </div>
            <div class="player player2">
                <div class="player-name">${player2Name}</div>
                <p>:</p>
                <div class="player-score">0</div>
            </div>
        `;

        // Add the .active-player class to the first player by default
    document.querySelector('.player.player1 .player-name').classList.add('active-player');

        const gameContainer = document.querySelector('.game');
        const emojisArray = Object.keys(emojis);
 // Hämta emoji-nycklarna från objektet

        // Duplicera varje emoji för att skapa par
        const emojiPairs = emojisArray.reduce((acc, emoji) => {
            acc.push(emoji, emoji);
            return acc;
        }, []);

        // Shuffle emoji-par
        let shuffleEmojis = emojiPairs.sort(() => (Math.random() > 0.5) ? 1 : -1);

    //Lägga ut korten efter shuffleEmojus-array
    for (let i = 0; i < shuffleEmojis.length; i++) {
        //skapa en variablel för att skapa div-element
        let box = document.createElement('div');
        //lägg till class "item" till div-elementet
        box.className = 'item';
        //fyller div med emoji från shuffleEmojis array. --kan ändras till innerContent
        box.innerHTML = shuffleEmojis[i];
        //On-click på box/div-elementet...
        box.onclick = function() {
            //lägg till class 'boxOpen' på div-elementet
            this.classList.add('boxOpen');
            //En timeout, som flippar korten efter andra har visats
            setTimeout (function() {
                //Om antal divs med classen boxOpen är med än 1, alltså så gäller detta vid att andra kortet visas..
                if(document.querySelectorAll('.boxOpen').length > 1){
                    //Om korten är lika..
                    if(document.querySelectorAll('.boxOpen')[0].innerHTML == document.querySelectorAll('.boxOpen')[1].innerHTML){
                        
                        //Lägg till classen 'boxMatch' på par
                        document.querySelectorAll('.boxOpen')[0].classList.add('boxMatch');
                        document.querySelectorAll('.boxOpen')[1].classList.add('boxMatch')

                        //Ta bort classen 'boxOpen' från korten
                        document.querySelectorAll('.boxOpen')[1].classList.remove('boxOpen');
                        document.querySelectorAll('.boxOpen')[0].classList.remove('boxOpen');

                        //Om alla korten som har classen 'boxMatch', så är spelet över -- emoji.length ger det totala antalet kort, shuffleEmojis.length fungerar också.
                        if(document.querySelectorAll('.boxMatch').length == shuffleEmojis.length) {
                            alert('You got em all!');
                        }
                    } else {
                        //Annars - Flippa tillbaka korten
                        document.querySelectorAll('.boxOpen')[1].classList.remove('boxOpen');
                        document.querySelectorAll('.boxOpen')[0].classList.remove('boxOpen');

                    }
                }
            }, 500) //timeOut
        }

        gameContainer.appendChild(box);
    }

} else {
    alert('Please enter names for both players to start the game.');
  }
}

// Denna kod körs när sidan laddas
document.addEventListener('DOMContentLoaded', function () {
    // Om du vill visa registreringsmenyn när sidan laddas kan du kommentera bort den här raden
    document.querySelector('.main-container').style.display = 'none';
  });


// Funktion för att byta den aktiva spelaren på poängtavlan
function toggleActivePlayer() {
    const player1NameElement = document.querySelector('.player.player1 .player-name');
    const player2NameElement = document.querySelector('.player.player2 .player-name');

    player1NameElement.classList.toggle('active-player');
    player2NameElement.classList.toggle('active-player');
}

// Funktion för att hantera när ett par matchas
function handleMatchedPair() {
    // Hämta de två öppna korten
    console.log("Hello!")
    const openCards = document.querySelectorAll('.boxOpen');

    // Kontrollera att det är ett par (två öppna kort)
    if (openCards.length === 2) {
        const emoji1 = openCards[0].innerHTML;
        const emoji2 = openCards[1].innerHTML;

        // Kontrollera om de två öppna korten har samma emoji
        if (emoji1 === emoji2) {
            // Hämta poängen för den matchade emojin
            const points = emojis[emoji1];

            // Hämta den nuvarande spelarens namn (från localStorage)
            const currentPlayer = localStorage.getItem('currentPlayer');

            // Uppdatera poängen för den aktuella spelaren
            updateScore(currentPlayer, points);

            // Ta bort classen 'boxOpen' från matchade korten
            openCards.forEach(card => card.classList.remove('boxOpen'));

            // Lägg till classen 'boxMatch' på matchade par
            openCards.forEach(card => card.classList.add('boxMatch'));

            // Toggle the active player after each pair is matched
            toggleActivePlayer();

            // Kontrollera om alla par matchats
            if (document.querySelectorAll('.boxMatch').length === emojisArray.length * 2) {
                // Alla par matchade, spelet är över
                alert('Congratulations! You matched all pairs. Game Over!');
            }
        } else {
            // Annars - Flippa tillbaka korten efter en kort fördröjning
            setTimeout(() => {
                openCards.forEach(card => card.classList.remove('boxOpen'));
                // Toggle the active player after flipping back the cards
                toggleActivePlayer();
            }, 500);
        }
    }
}

// Set up event delegation on the game container
const gameContainer = document.querySelector('.game');
gameContainer.addEventListener('click', function (event) {
    const clickedElement = event.target;

    // Kontrollera om klicket var på ett kort och om det inte redan har matchats eller är öppet
    if (clickedElement.classList.contains('item') && !clickedElement.classList.contains('boxMatch') && !clickedElement.classList.contains('boxOpen')) {
        clickedElement.classList.add('boxOpen');

        // Anropa funktionen när ett par matchas efter en fördröjning
        setTimeout(() => {
            handleMatchedPair();
        }, 500);
    }
});