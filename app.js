const hit = document.getElementById('hit')
const stand = document.getElementById('stand')
const double = document.getElementById('double')
const start = document.getElementById('start')
const playerPoints = document.getElementById('playerPoints')
const dealerPoints = document.getElementById('dealerPoints')
const playerCards = document.getElementById('playerCards')
const dealerCards = document.getElementById('dealerCards')
let startChecked = false
let playerHand = []
let dealerHand = []
let playArea
let deckId

/* ------- Shuffle 6 decks of cards and set the "deckId" to that deck ------- */

window.onload = () => {
  fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6")
    .then(Response => Response.json())
    .then(data => {
      deckId = data.deck_id
    })
}

/* --------- Add event listener to start button to set initial state --------- */

start.addEventListener("click", e => {
  reset()
  let currentValue = 0;
  startChecked = true
  fetch(drawCard(deckId, 4))
  .then(Response => Response.json())
  .then(data => {
    for(i = 0; i <= 1; i++){
      addCards(data, playerCards, i, playerPoints) 
      playerHand.push(data.cards[i])
    }
    for(i = 2; i <= 3; i++){
      addCards(data, dealerCards, i, dealerPoints)
      dealerHand.push(data.cards[i])
    }
    playerPoints.innerHTML = addValue(data.cards[0].value, currentValue) + addValue(data.cards[1].value, currentValue)
    dealerPoints.innerHTML = addValue(data.cards[2].value, currentValue) + addValue(data.cards[3].value, currentValue)
    if(parseInt(playerPoints.innerHTML) === 22){
      playerPoints.innerHTML - 10
    }
    if(parseInt(playerPoints.innerHTML) === 21 && parseInt(dealerPoints.innerHTML) === 21){
      console.log("Draw")
    }
    if(parseInt(playerPoints.innerHTML) === 21){
      console.log("BLACKJACK!")
    }
  })
})


/* ------- Event listener to "hit" button to add cards to playerHand ------- */

hit.addEventListener("click", e => {
  if(!startChecked) return
  e.preventDefault()
  fetch(drawCard(deckId, 1))
  .then(Response => Response.json())
  .then(data => {
    // console.log(data.cards[0])
    playerHand.push(data.cards[0])
    addCards(data, playerCards, 0, playerPoints)
  })
  /* if(parseInt(playerHand.innerHTML) === 21){
    stand()
  } */
})

/* ------ Event listener for "double" button to double bet and add card ----- */

/* double.addEventListener("click", e => {
  if(!startChecked) return
  e.preventDefault()
  fetch(drawCard(deckId))
  .then(Response => Response.json())
  .then(data => {
    // console.log(data)
  })
}) */


/* ------------ Button for "stand", controls logic of win - loss ------------ */

stand.addEventListener("click", e => {
  if(!startChecked) return
  e.preventDefault()
  if(parseInt(dealerPoints.innerHTML) <= 16){
    // dealerHand.push(card)
    dealerDraw()
  }
})

/* -------------------------------------------------------------------------- */
/*                                  Functions                                 */
/* -------------------------------------------------------------------------- */

/* ------------- Draw any number of cards from deck with deckId ------------- */

function drawCard(deckId, i){
  return `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${i}`
}

/* --------------- Add cards to playArea depending on the turn -------------- */

function addCards(data, playArea, i, cardPoints){
  let createCard = document.createElement('img')
  createCard.src = data.cards[i].image
  playArea.appendChild(createCard)
  cardPoints.innerHTML = addValue(data.cards[i].value, parseInt(cardPoints.innerHTML))
  if(parseInt(cardPoints.innerHTML) > 21){
    cardPoints.style.color = "red"
    startChecked = false
    console.log("Bust")
  } 
}


/* ----------------- Add value of new cards to current total ---------------- */

function addValue(value, currentValue){
  if(value === "ACE"){
    if(currentValue <= 10){currentValue += 11} 
    else{currentValue += 1}
  }
  else if(value === "KING" || value === "QUEEN" || value === "JACK"){currentValue += 10}
  else{currentValue += parseInt(value)}
  // console.log(parseInt(currentValue))
  return currentValue
}

/* ----------------------------- Reset all data ----------------------------- */

function reset(){
  playerPoints.style.color = "black"
  dealerPoints.style.color = "black"
  playerPoints.innerHTML = ""
  dealerPoints.innerHTML = ""
  playerCards.innerHTML = ""
  dealerCards.innerHTML = ""
  playerHand.length = 0
  dealerHand.length = 0
  console.clear()
}

/* -------------- Repeatably draw cards until dealer is over 16 ------------- */

function dealerDraw(){
  fetch(drawCard(deckId, 1))
  .then(Response => Response.json())
  .then(data => {
    addCards(data, dealerCards, 0, dealerPoints)
    if(parseInt(dealerPoints.innerHTML) <= 16){
      setTimeout(() => {
        dealerDraw()
      }, 500);
      return
    }
    else if(parseInt(dealerPoints.innerHTML) >= parseInt(playerPoints.innerHTML) && parseInt(dealerPoints.innerHTML) <= 21){
      console.log("loss")
    }
    else{console.log("win")}
  })
}

