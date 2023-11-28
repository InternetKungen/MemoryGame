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

//Aktiv spelare
let currentPlayer;

//Kortens sortering
let emojisArray; // Flytta deklarationen hit

//VS Comp switch
let isComputerPlayer = false;
let hardMode = false;

//Game Loaded switch
let gameLoaded = false;

//Ladda ljud
const clickSound = new Audio('./src/audio/game-click.wav');
const mainMenuButtonSound1 = new Audio('./src/audio/main_menu_button_1.mp3');
const mainMenuButtonSound2 = new Audio('./src/audio/main_menu_button_2.mp3');
const mainMenuButtonSound3 = new Audio('./src/audio/back_main_button.mp3');
const mainMenuMusic = new Audio('./src/audio/main_menu_music.mp3');

const gameMusic = new Audio('./src/audio/gameMusic.mp3');
const flipCard = new Audio('./src/audio/flipcard.mp3');
const flipCardBack = new Audio('./src/audio/flipcard_back.mp3');

const successSound = new Audio('./src/audio/success.mp3');
const failSound = new Audio('./src/audio/fail.mp3');

// Main Menu Music
mainMenuMusic.volume = 0.8;
// Loop
const loopStartTime = 11; //Loppen startas om här
mainMenuMusic.addEventListener('ended', function() {
    // Sätt currentTime till önskad position för att skapa en loop-liknande effekt
    mainMenuMusic.currentTime = loopStartTime;
    // Starta ljudet igen
    mainMenuMusic.play();
});

// Game Music
gameMusic.loop = true;
gameMusic.volume = 0.8;


//Volume settings
//Flip
flipCard.volume = 0.4;
flipCardBack.volume = 0.6;

//Click
clickSound.volume = 0.7;
//Menu buttons

// Starta ljudet
mainMenuMusic.play();

//Back to Main button
function backToMain() {
    document.querySelector('.main-menu').style.display = 'flex';
    document.querySelector('.pre-menu').style.display = 'none';
    document.querySelector('.pvm-menu').style.display = 'none';

    mainMenuButtonSound3.play();
}

//Ladda PVP meny
function loadPVPMenu() {
    document.querySelector('.main-menu').style.display = 'none';
    document.querySelector('.pre-menu').style.display = 'flex';
    mainMenuButtonSound1.play();
}

//PVP Menu Start Game knapp
function startGamePVP() {

    //Spela upp ljud
    mainMenuButtonSound2.play();

     //Pausa menu-, starta game music
    mainMenuMusic.pause();
    gameMusic.play();

    gameLoaded = true;

    startGame();
}

//Ladda PVM meny
function loadPVMMenu() {
    document.querySelector('.main-menu').style.display = 'none';
    document.querySelector('.pvm-menu').style.display = 'flex';

    //Spela upp ljud
    mainMenuButtonSound1.play(); 
}

//PVM Menu 'Start Game' knapp EASY
function startGamePVM() {
    //Aktivera Dator-spelare
    isComputerPlayer = true; 

    // Set the name "Computer" for player2
    document.getElementById('player2-name').value = 'Computer';

    //Spela Ljud
    mainMenuButtonSound2.play();

    //Namnet från PVM formuläret överförst till player1-name. 
    const playerNamePVM = document.getElementById('player1-name-pvm').value;
    
    document.getElementById('player1-name').value = playerNamePVM;

    //Pausa menu-, starta game music
    mainMenuMusic.pause();
    gameMusic.play();

    gameLoaded = true;

    startGame();
}

//PVM Menu 'Start Game' knapp HARD
function startGamePVMHard() {
    //Aktivera Dator-spelare
    isComputerPlayer = true; 

    // Set the name "Computer" for player2
    document.getElementById('player2-name').value = 'Computer';

    //Namnet från PVM formuläret överförst till player1-name. 
    const playerNamePVM = document.getElementById('player1-name-pvm').value;

    
    
    document.getElementById('player1-name').value = playerNamePVM;

    hardMode = true;
    
    //Play Klick button sound
    mainMenuButtonSound2.play();

    //Pausa menu-, starta game music
    mainMenuMusic.pause();
    gameMusic.play();
    
    gameLoaded = true;

    startGame();
}


//Volym-ikonen - header - toggle
const volumeButton = document.querySelector('.volumeButton');
const volumeIcon = document.querySelector('.volumeIcon');
let isSoundOn = true;

function toggleSound() {
  if (isSoundOn) {
    // Stäng av ljudet
    mainMenuMusic.pause();
    gameMusic.pause();
    isSoundOn = false;
    volumeIcon.src = './src/img/volume-off.png';
  } else {
    // Slå på ljudet
    if (gameLoaded) {
        gameMusic.play();
    } else 
    {
    mainMenuMusic.play();
    };

    isSoundOn = true;
    volumeIcon.src = './src/img/volume-on.png';
  }
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

    if (isComputerPlayer && currentPlayer === 'player2') {
        playComputerMoves();
    }
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

            //Spela ljud - success
            successSound.play();

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
                        <h3>${winnerName}</h3>
                        <h3>Wins!</h3>
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

            //Skaka kort vid omaka par
            setTimeout(() => {
            setTimeout(() => {
                openCards.forEach(card => {
                    card.classList.add('shakeAnimation');
                    failSound.play();
                });
            }, 100);
        }, 200);

            //Ta bort skakningsklassen efter en kort fördröjning
            setTimeout(() => {
                openCards.forEach(card => card.classList.remove('shakeAnimation'));
            }, 500);


            //Flippa tillbaka kortet
            setTimeout(() => {
                openCards.forEach(card => {
                    card.classList.remove('boxOpen');
                });

                //Spela upp ljud - flipcard back
                flipCardBack.play();

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
    // const player1Name = document.getElementById('player1-name').value;
    // const player2Name = document.getElementById('player2-name').value;

    const player1NameInput = document.getElementById('player1-name');
    const player2NameInput = document.getElementById('player2-name');
    
    const player1Name = player1NameInput.value;
    const player2Name = player2NameInput.value;

    console.log('Player 1 Name:', player1Name);
    console.log('Player 2 Name:', player2Name);

    if (player1Name && player2Name) {
        localStorage.setItem('player1Name', player1Name);
        localStorage.setItem('player2Name', player2Name);

        player1Registered = true;
        player2Registered = true;

        document.getElementById('pre-menu').style.display = 'none';
        document.getElementById('pvm-menu').style.display = 'none';
        document.querySelector('.main-container').style.display = 'flex';

        const scoreBoard = document.querySelector('.score-board');

        scoreBoard.innerHTML = `
            <h3>Score</h3>
            <div class="player player1">
                <div class="player-name">${player1Name}</div>
                <div class="player-score">0</div>
            </div>
            <div class="player player2">
                <div class="player-name">${player2Name}</div>
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
                // if (isComputerPlayer && blockOnClick) {
                //     return; // Blockera klick om det är datorns tur
                // }
                //spela klick-ljud
                clickSound.play();

                //spela öppna kort ljud
                flipCard.play();

                //lägg till class 'boxOpen' på div-elementet
                this.classList.add('boxOpen');
                
                //Anropa funktionen direkt utan timeout
                handleMatchedPair();
                
            }

            gameContainer.appendChild(box);
        }

         // Check if the second player is a computer and trigger computer moves
        if (isComputerPlayer && currentPlayer !== 'player1') {
            playComputerMoves();
        }

        // const gameContainer = document.querySelector('.game');
        // emojisArray = Object.keys(emojis);
    
        // // Duplicera varje emoji för att skapa par
        // const emojiPairs = emojisArray.reduce((acc, emoji) => {
        //     acc.push(emoji, emoji);
        //     return acc;
        // }, []);
    
        // // Shuffle emoji-par
        // let shuffleEmojis = emojiPairs.sort(() => (Math.random() > 0.5) ? 1 : -1);
    
        // // Lägga ut korten efter shuffleEmojus-array
        // for (let i = 0; i < shuffleEmojis.length; i++) {
        //     let box = document.createElement('div');
        //     box.className = 'item';
        //     box.classList.add = 'opacityZero';
        //     // box.style.opacity = 0; // Sätt opacity till 0 för att göra kortet osynligt
        //     const emojiName = shuffleEmojis[i];
        //     box.dataset.name = emojiName;
        //     box.innerHTML = emojis[emojiName].image;
    
        //     // On-click på box/div-elementet...
        //     box.onclick = function () {
        //         console.log('Card clicked!');
        //         this.classList.add('boxOpen');
        //         handleMatchedPair();
        //     }
    
        //     gameContainer.appendChild(box);
    
        //     // Använd setTimeout för att gradvis göra kortet synligt
        //     setTimeout(() => {
        //         // box.style.opacity = 0.2;
        //         // box.style.animation = 'sizeAnimationOneIntro 0.2s ease-in';
        //         box.classList.remove = 'opacityZero';
        //         box.classList.add('sizeChangeIntro');
        //     }, i * 100); // Justera fördröjningen för varje kort

        //     setTimeout(() => {
        //     setTimeout(() => {
        //         // box.style.opacity = 1;
        //         // box.style.animation = 'sizeAnimationOneIntro 0.2s ease-in';
        //         box.classList.remove('sizeChangeIntro');
        //     }, i * 100);
        // }, i * 30);
        // }
    
        // // Check if the second player is a computer and trigger computer moves
        // if (isComputerPlayer && currentPlayer !== 'player1') {
        //     playComputerMoves();
        // }

    } else {
        alert('Please enter names for both players to start the game.');
    }
}

let memory = [];

//Datorn spelar
function playComputerMoves() {
    console.log('Computer is playing...');

    // Fördröjningen innan datorn spelar kan anpassas efter behov
    setTimeout(() => {
        // Kontrollera om det fortfarande är datorns tur
        if (currentPlayer === 'player2') {
            // Gör datorns drag genom att klicka på två slumpmässiga kort
            const unopenedCards = document.querySelectorAll('.item:not(.boxOpen):not(.boxMatch)');
            
            // Kontrollera om det finns tillräckligt med oöppnade kort för datorn att spela
            if (unopenedCards.length >= 2) {
                if (hardMode) {
                    let cardToClick;
                    
                    // Om det finns minne, försök matcha med det
                    if (memory.length > 0) {
                        cardToClick = findMatchingCard(unopenedCards);
                    }

                    // Om inget matchande kort hittades, välj två slumpmässiga kort
                    if (!cardToClick) {
                        const randomCardIndices = getRandomCardIndices(unopenedCards.length);
                        cardToClick = randomCardIndices.map(index => unopenedCards[index]);
                    }

                    // Klicka på de valda korten
                    cardToClick.forEach(card => card.click());

                    // Uppdatera minnet med de öppnade korten
                    memory = cardToClick.map(card => card.dataset.name);

                    // Kör igen playComputerMoves om det fortfarande är datorns tur
                    if (currentPlayer === 'player2') {
                        playComputerMoves();
                    }
                } else {
                const randomCardIndices = getRandomCardIndices(unopenedCards.length);
                randomCardIndices.forEach(index => unopenedCards[index].click());

                // Kontrollera igen om det fortfarande är datorns tur efter att draget är klart
                if (currentPlayer === 'player2') {
                    // Om ja, kör playComputerMoves igen
                    playComputerMoves();
                }
            }
            } else {
                // Om det inte finns tillräckligt med oöppnade kort, avsluta datorns tur
                toggleActivePlayer();
            }
        }

        // // Återställ onclick-händelsen för hela spelplanen (.game)
        // gameContainer.onclick = function (event) {
        //     // Lägg till logiken för vad som ska hända när spelaren klickar här
        //     console.log('Game clicked!');
        // };
    }, 800); // Justera fördröjningen vid behov
}

// Hjälpfunktion för att hitta matchande kort i unopenedCards baserat på minnet
function findMatchingCard(unopenedCards) {
    for (let i = 0; i < memory.length; i++) {
        const matchingCard = Array.from(unopenedCards).find(card => card.dataset.name === memory[i]);
        if (matchingCard) {
            // Returnera det första matchande kortet som hittats
            return [matchingCard];
        }
    }
    return null;
}

// Funktion för att generera slumpmässiga index för kort
function getRandomCardIndices(cardCount) {
    const indices = [];
    while (indices.length < 2) {
        const randomIndex = Math.floor(Math.random() * cardCount);
        if (!indices.includes(randomIndex)) {
            indices.push(randomIndex);
        }
    }
    return indices;
}

// Denna kod körs när sidan laddas - gömmer main-container
document.addEventListener('DOMContentLoaded', function () {
    // Om du vill visa registreringsmenyn när sidan laddas kan du kommentera bort den här raden
    document.querySelector('.main-container').style.display = 'none';
    document.querySelector('.pre-menu').style.display = 'none';
    document.querySelector('.pvm-menu').style.display = 'none';
    document.querySelector('.winner-notice').style.display = 'none';
    document.querySelector('.draw-notice').style.display = 'none';
});


//FEL CHECK-BUGG-TEST------------------
// Set up event delegation on the game container
// const gameContainer = document.querySelector('.game');
// gameContainer.addEventListener('click', function (event) {
//     console.log('Click event received');
//     const clickedElement = event.target;

//     // Kontrollera om klicket var på ett kort och om det inte redan har matchats eller är öppet
//     if (clickedElement.classList.contains('item') && !clickedElement.classList.contains('boxMatch') && !clickedElement.classList.contains('boxOpen')) {
//         clickedElement.classList.add('boxOpen');

//         // Anropa funktionen direkt utan timeout
//         console.log('Before handleMatchedPair is called');
//         handleMatchedPair();
//         console.log('After handleMatchedPair is called');
//     }
// });

// // Skapa en ny klickhändelse för varje kort separat
// const cards = document.querySelectorAll('.item');
// cards.forEach((card) => {
//     card.addEventListener('click', () => {
//         console.log('Card clicked separately');
//         // Lägg till detta för att anropa handleMatchedPair även när ett kort klickas separat
//         handleMatchedPair();
//     });
// });
