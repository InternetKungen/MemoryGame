// Definiera emojis som ett objekt med tillhörande poäng och namn
const emojis = {
    flower: { name: "flower", image: "🌼", points: 10 },
    car: { name: "car", image: "🚗", points: 20 },
    clown: { name: "clown", image: "🤡", points: 15 },
    monkey: { name: "monkey", image: "🐵", points: 25 },
    diamond: { name: "diamond", image: "💎", points: 30 },
    bomb: { name: "bomb", image: "💣", points: -10 },
    fries: { name: "fries", image: "🍟", points: 8 },
    mushroom: { name: "mushroom", image: "🍄", points: 12 }
};

// Skapa en tom array för att hålla historiken över matchade par
let matchHistory = [];

// Skapa en array för att hålla reda på spelarnas poäng
let playerScores = {
    player1: 0,
    player2: 0
};

let currentPlayer;
let emojisArray; // Flytta deklarationen hit

//Ladda PVP meny
function loadPVPMenu() {
    document.querySelector('.main-menu').style.display = 'none';
    document.querySelector('.pre-menu').style.display = 'flex';
}

// Aktiv spelare - toggle
function toggleActivePlayer() {
    const player1NameElement = document.querySelector('.player.player1 .player-name');
    const player2NameElement = document.querySelector('.player.player2 .player-name');

    // Toggle the active player based on the current player
    if (currentPlayer === 'player1') {
        player1NameElement.classList.remove('active-player');
        player2NameElement.classList.add('active-player');
        currentPlayer = 'player2';
    } else {
        player1NameElement.classList.add('active-player');
        player2NameElement.classList.remove('active-player');
        currentPlayer = 'player1';
    }
    console.log('Click event received - toggleActivePlayer');
}

// Funktion för att lägga till ett matchat par i historiken
function addToMatchHistory(player, emojiName) {
    matchHistory.push({ player, emojiName });
}

// Uppdaterad updateScore-funktion
function updateScore(player, emojiName) {
    const points = emojis[emojiName].points;
    console.log(`Updating score for ${player} by ${points}. New score: ${playerScores[player]}`);
    // Uppdatera poängen för den angivna spelaren
    playerScores[player] += points;

    // Uppdatera score-board
    const playerScoreElement = document.querySelector(`.${player} .player-score`);
    if (playerScoreElement) {
        playerScoreElement.textContent = playerScores[player];
    }

    // // Skriv ut matchhistoriken
    // console.log('Match History:', matchHistory);
    // console.log(`Updating score for ${player} by ${points}. New score: ${playerScores[player]}`);
}

// Skriv ut till historik - uppdatera
function printMatchHistory() {
    const historyContainer = document.querySelector('.history');
    historyContainer.innerHTML = `<h4>History</h4><div class="line-thing"></div>`;

    //vad händer här? - en for loop - 
    matchHistory.forEach((match, index) => {
        const playerName = localStorage.getItem(`${match.player}Name`);
        const historyItem = document.createElement('div');
        historyItem.textContent = `${index + 1}. ${playerName} found the ${match.emojiName}`;
        historyContainer.appendChild(historyItem);
    });
}

//lägg till matchHistory array
function addToMatchHistory(player, emojiName) {
    matchHistory.push({ player, emojiName });
    printMatchHistory();
}

// Funktion för att hantera när ett par matchas
function handleMatchedPair() {

    console.log('Handling matched pair...');

    // Hämta de två öppna korten
    const openCards = document.querySelectorAll('.boxOpen');
    console.log('Open cards:', openCards);

    // Kontrollera att det är ett par (två öppna kort)
    if (openCards.length === 2) {
        const emoji1 = openCards[0].dataset.name; // Använd dataset för att hämta namnet istället för innerHTML
        const emoji2 = openCards[1].dataset.name; // Använd dataset för att hämta namnet istället för innerHTML

        console.log('Matched emojis:', emoji1, emoji2);

        // Kontrollera om de två öppna korten har samma emoji
        if (emoji1 === emoji2) {
            // Hämta poängen för den matchade emojin
            const points = emojis[emoji1].points;
            console.log('Points for the match:', points);

            // Uppdatera poängen för den aktiva spelaren
            updateScore(currentPlayer, emoji1);

            // Ta bort classen 'boxOpen' från matchade korten
            openCards.forEach(card => card.classList.remove('boxOpen'));

            // Lägg till classen 'boxMatch' på matchade par
            openCards.forEach(card => card.classList.add('boxMatch'));

            // Lägg till i matchhistoriken
            addToMatchHistory(currentPlayer, emoji1);

            // Kontrollera om alla par matchats
            if (document.querySelectorAll('.boxMatch').length === emojisArray.length * 2) {

                // Alla par matchade, spelet är över

                // Hämtar namnet på spelarna                
                const player1Name = document.getElementById('player1-name').value;
                const player2Name = document.getElementById('player2-name').value;

                //Utgör och skriver ut vinnaren
                if (playerScores.player1 == playerScores.player2) {
                    showDrawNotice();
                } else if (playerScores.player1 > playerScores.player2) {
                    showWinnerNotice(player1Name);
                } else {
                    showWinnerNotice(player2Name);
                }

                // Function to show winner notice
                function showWinnerNotice(winnerName) {
                    let winnerNotice = document.querySelector(".winner-notice");

                    let winnerIs = `
                        <h3>Winner!</h3>
                        <h3>${winnerName}</h3>
                    `;

                    winnerNotice.innerHTML = winnerIs;
                    winnerNotice.style.display = 'flex';

                    // Set a timeout to hide the winner notice after 3 seconds
                    setTimeout(() => {
                        winnerNotice.style.display = 'none';
                        restartGame();
                    }, 3000);
                }

                function showDrawNotice() {
                    let drawNotice = document.querySelector(".draw-notice");

                    drawNotice.style.display = 'flex';

                    // Set a timeout to hide the notice after 3 seconds
                    setTimeout(() => {
                        drawNotice.style.display = 'none';
                        restartGame();
                    }, 3000);
                }

                // alert('Congratulations! You matched all pairs. Game Over!');

            }
        } else {
            // Annars - Flippa tillbaka korten efter en kort fördröjning
            setTimeout(() => {
                openCards.forEach(card => card.classList.remove('boxOpen'));
                // Toggle the active player after flipping back the cards
                toggleActivePlayer();
            }, 500);
        }
    } else {
        console.log('No matched pair found.');
    }
}

// Function to restart the game
function restartGame() {
    
    //Reset History
    matchHistory = [];
    printMatchHistory();

    //Sätter spelarnas poäng till noll
    playerScores.player1 = 0;
    playerScores.player2 = 0;

    //Tömmer array som representerar korten på plan
    emojisArray = [];

    //Tar bort korten från html .game
    const gameContainer = document.querySelector('.game');
    gameContainer.innerHTML = ``;

    // Then, start the game again
    startGame();
}

// Funktion för att starta spelet
function startGame() {
    // Hämtar namnet på spelarna
    const player1Name = document.getElementById('player1-name').value;
    const player2Name = document.getElementById('player2-name').value;

    console.log('Player 1 Name:', player1Name);
    console.log('Player 2 Name:', player2Name);

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

        // Set the current player to player 1 when the game starts
        currentPlayer = 'player1';

        // Add the .active-player class to the first player by default
        document.querySelector('.player.player1 .player-name').classList.add('active-player');

        const gameContainer = document.querySelector('.game');
        emojisArray = Object.keys(emojis); // Flytta deklarationen hit

        // Duplicera varje emoji för att skapa par
        const emojiPairs = emojisArray.reduce((acc, emoji) => {
            acc.push(emoji, emoji);
            return acc;
        }, []);

        // Shuffle emoji-par
        let shuffleEmojis = emojiPairs.sort(() => (Math.random() > 0.5) ? 1 : -1);

        // Lägga ut korten efter shuffleEmojus-array
        for (let i = 0; i < shuffleEmojis.length; i++) {
            //skapa en variablel för att skapa div-element
            let box = document.createElement('div');
            //lägg till class "item" till div-elementet
            box.className = 'item';
            //fyller div med emoji från shuffleEmojis array. --kan ändras till innerContent
            const emojiName = shuffleEmojis[i];
            box.dataset.name = emojiName; // Sätt dataset för att lagra namnet istället för innerHTML
            box.innerHTML = emojis[emojiName].image; // Använd image-attributet för att sätta in emoji

            //On-click på box/div-elementet...
            box.onclick = function () {
                console.log('Card clicked!');
                //lägg till class 'boxOpen' på div-elementet
                this.classList.add('boxOpen');
                //Anropa funktionen direkt utan timeout
                handleMatchedPair();
            }

            gameContainer.appendChild(box);
        }

    } else {
        alert('Please enter names for both players to start the game.');
    }
}

// Denna kod körs när sidan laddas - gömmer main-container
document.addEventListener('DOMContentLoaded', function () {
    // Om du vill visa registreringsmenyn när sidan laddas kan du kommentera bort den här raden
    document.querySelector('.main-container').style.display = 'none';
    document.querySelector('.pre-menu').style.display = 'none';
    document.querySelector('.winner-notice').style.display = 'none';
    document.querySelector('.draw-notice').style.display = 'none';
});

// Set up event delegation on the game container
const gameContainer = document.querySelector('.game');
gameContainer.addEventListener('click', function (event) {
    console.log('Click event received');
    const clickedElement = event.target;

    // Kontrollera om klicket var på ett kort och om det inte redan har matchats eller är öppet
    if (clickedElement.classList.contains('item') && !clickedElement.classList.contains('boxMatch') && !clickedElement.classList.contains('boxOpen')) {
        clickedElement.classList.add('boxOpen');

        // Anropa funktionen direkt utan timeout
        console.log('Before handleMatchedPair is called');
        handleMatchedPair();
        console.log('After handleMatchedPair is called');
    }
});

// Skapa en ny klickhändelse för varje kort separat
const cards = document.querySelectorAll('.item');
cards.forEach((card) => {
    card.addEventListener('click', () => {
        console.log('Card clicked separately');
        // Lägg till detta för att anropa handleMatchedPair även när ett kort klickas separat
        handleMatchedPair();
    });
});
