// const emojis = ["🌼", "🌼", "🚗", "🚗", "🤡", "🤡", "🐵", "🐵", "💎", "💎", "💣", "💣", "🍟", "🍟", "🍄", "🍄"];

// let shuffleEmojis = emojis.sort(() => (Math.random() > .5) ? 2 : -1);

// for (let i = 0; i < emojis.length; i++) {
//     let box = document.createElement('div');
//     box.className = 'item';
//     box.innerHTML = shuffleEmojis[i];
//     document.querySelector('.game').appendChild(box);
// } 

// console.log('Hello!');

let player1Registered = false;
let player2Registered = false;

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

     // Hittar .score-board och binder platsen till variabel scoreBoard
     const scoreBoard = document.querySelector('.score-board');

     // Uppdatera HTML för att visa spelarnas namn
     scoreBoard.innerHTML = `
     <h3>Score</h3>
         <div class="player">
             <div class="player-name">${player1Name}</div>
             <p>:</p>
             <div class="player-score">0</div>
         </div>
         <div class="player">
             <div class="player-name">${player2Name}</div>
             <p>:</p>
             <div class="player-score">0</div>
         </div>
     `;

    const emojis = ["🌼", "🌼", "🚗", "🚗", "🤡", "🤡", "🐵", "🐵", "💎", "💎", "💣", "💣", "🍟", "🍟", "🍄", "🍄"];

    // Shuffle emojis - tar emojis array och ändrar ordningen
    let shuffleEmojis = emojis.sort(() => (Math.random() > 0.5) ? 1 : -1);

    // Hittar .game och binder platsen till variabel gameContainer
    const gameContainer = document.querySelector('.game');

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
                        if(document.querySelectorAll('.boxMatch').length == emojis.length) {
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
