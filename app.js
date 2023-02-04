const hit = document.getElementById('hit')
const stand = document.getElementById('stand')
const double = document.getElementById('double')
const start = document.getElementById('start')
const playerPoints = document.getElementById('playerPoints')
const dealerPoints = document.getElementById('dealerPoints')
const playerCards = document.getElementById('playerCards')
const dealerCards = document.getElementById('dealerCards')
const dealerResult = document.getElementById('dealerResult')
const playerResult = document.getElementById('playerResult')
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
      addCards(data, playerCards, i, playerPoints, playerResult, playerHand) 
      playerHand.push(data.cards[i])
    }
    for(i = 2; i <= 3; i++){
      addCards(data, dealerCards, i, dealerPoints, dealerResult, dealerHand)
      dealerHand.push(data.cards[i])
    }
    playerPoints.innerHTML = addValue(data.cards[0].value, currentValue, playerHand) + addValue(data.cards[1].value, currentValue, playerHand)
    dealerPoints.innerHTML = addValue(data.cards[2].value, currentValue, dealerHand) + addValue(data.cards[3].value, currentValue, dealerHand)
    if(parseInt(playerPoints.innerHTML) === 22){
      playerPoints.innerHTML - 10
    }
    if(parseInt(playerPoints.innerHTML) === 21 && parseInt(dealerPoints.innerHTML) === 21){
      playerResult.innerHTML = "Draw"
      dealerResult.innerHTML = "Draw"
    }
    else if(parseInt(playerPoints.innerHTML) === 21){
      playerResult.innerHTML = "BJACK!"
      playerResult.style.writingMode = "vertical-rl"
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
    playerHand.push(data.cards[0])
    addCards(data, playerCards, 0, playerPoints, playerResult, playerHand)
  })
})

/* ------ Event listener for "double" button to double bet and add card ----- */

// This doesn't do anything yet but i might add betting
 
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
    dealerDraw()
  }
  else{
    playerResult.innerHTML = "Win"
    dealerResult.innerHTML = "Loss"
  }
})

/* -------------------------------------------------------------------------- */
/*                                  Functions                                 */
/* -------------------------------------------------------------------------- */

/* --------- Draw any number of cards with i, from deck with deckId --------- */

function drawCard(deckId, i){
  return `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${i}`
}

/* --------------- Add cards to playArea depending on the turn -------------- */

function addCards(data, playArea, i, cardPoints, result, hand){
  let createCard = document.createElement('img')
  createCard.src = data.cards[i].image
  playArea.appendChild(createCard)
  cardPoints.innerHTML = addValue(data.cards[i].value, parseInt(cardPoints.innerHTML), hand)
  if(parseInt(cardPoints.innerHTML) > 21){
    cardPoints.style.color = "red"
    startChecked = false
    result.innerHTML = "Bust"
  } 
}


/* ----------------- Add value of new cards to current total ---------------- */

function addValue(value, currentValue, aceCheck){
  if(value === "ACE"){
    /* for(let i = 0; i <= ace.length; i++){
      if(aceCheck[i].value === "ACE"){
        
        return
      }
    } */
    if(currentValue <= 10){currentValue += 11} 
    else{currentValue += 1}
  }
  else if(value === "KING" || value === "QUEEN" || value === "JACK"){currentValue += 10}
  else{currentValue += parseInt(value)} 
  return currentValue
}

/* ----------------------------- Reset all data ----------------------------- */

function reset(){
  playerResult.style.writingMode = "horizontal-tb"
  playerPoints.style.color = "black"
  dealerPoints.style.color = "black"
  playerResult.innerHTML = ""
  dealerResult.innerHTML = ""
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
    addCards(data, dealerCards, 0, dealerPoints, dealerResult, dealerHand)
    if(parseInt(dealerPoints.innerHTML) <= 16){
      setTimeout(() => {
        dealerHand.push(data.cards[0])
        dealerDraw()
      }, 500);
      return
    }
    else if(parseInt(dealerPoints.innerHTML) >= parseInt(playerPoints.innerHTML) && parseInt(dealerPoints.innerHTML) <= 21){
      playerResult.innerHTML = "loss"
      dealerResult.innerHTML = "Win"
    }
    else{
      playerResult.innerHTML = "Win"
      dealerResult.innerHTML = "Loss"
    }
  })
}

