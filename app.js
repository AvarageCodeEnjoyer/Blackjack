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

let startClick = function(){
  reset()
  startChecked = true
  fetch(drawCard(deckId, 3))  
  .then(Response => Response.json())
  .then(data => {
    let cardBack = document.createElement('img')
    cardBack.src = "./BackOfCard.png"
    dealerCards.appendChild(cardBack)
    for(i = 0; i <= 1; i++){
      addCards(data, playerCards, i, playerPoints, playerResult, playerHand)
    }
    addCards(data, dealerCards, 2, dealerPoints, dealerResult, dealerHand)
    if(parseInt(playerPoints.innerHTML) === 21 && parseInt(dealerPoints.innerHTML) === 21){
      startChecked = false
      playerResult.innerHTML = "Draw"
      dealerResult.innerHTML = "Draw"
    }
    else if(parseInt(playerPoints.innerHTML) === 21){
      playerResult.innerHTML = "BJACK!"
      playerResult.style.writingMode = "vertical-rl"
      fetch(drawCard(deckId, 1))
      .then(Response => Response.json())
      .then(data => {
        unHideCard(data)
      })
      // standClick()
    }
  })
}

var standClick = function(){
  if(!startChecked) return
  fetch(drawCard(deckId, 1))
  .then(Response => Response.json())
  .then(data => {
    unHideCard(data)
  })

  setTimeout( () => {
    if(parseInt(dealerPoints.innerHTML) <= 16){
      dealerDraw()
    }
    else{
      winCondition()
    }  
  },750)
  startChecked = false
}

/* ----- Shuffle 6 decks of cards and set the "deckId" to that decks ID ----- */

window.onload = () => {
  fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6")
  .then(Response => Response.json())
  .then(data => {deckId = data.deck_id})
}

/* --------- Add event listener to start button to set initial state --------- */

start.addEventListener("click", startClick)

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

// This doesn't do anything yet but i might add betting in the future
 
/* double.addEventListener("click", e => {
  if(!startChecked) return
  e.preventDefault()
  fetch(drawCard(deckId))
  .then(Response => Response.json())
  .then(data => {
    // console.log(data)
  })
}) */

/* ---------- Adds event listener to "stand" to activate standClick --------- */

stand.addEventListener("click", standClick)

/* -------------------------------------------------------------------------- */
/*                      V   V   V   Functions   V   V   V                     */
/* -------------------------------------------------------------------------- */

/* --------- Draw any number of cards with i, from deck with deckId --------- */

function drawCard(deckId, i){
  return `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${i}`
}

/* ------------------------ Unhide dealers first card ----------------------- */

function unHideCard(data){
  dealerCards.firstChild.src = data.cards[0].image
  dealerHand.unshift(data.cards[0])
  dealerPoints.innerHTML = addValue(data.cards[0].value, parseInt(dealerPoints.innerHTML))
}

/* --------------- Add cards to playArea depending on the turn -------------- */

function addCards(data, playArea, i, cardPoints, result, hand){
  let createCard = document.createElement('img')
  createCard.src = data.cards[i].image
  playArea.appendChild(createCard)
  hand.push(data.cards[i])
  cardPoints.innerHTML = addValue(data.cards[i].value, parseInt(cardPoints.innerHTML), hand)
  if(parseInt(cardPoints.innerHTML) > 21){
    cardPoints.style.color = "red"
    startChecked = false
    result.innerHTML = "Bust"
  } 
}


/* ----------------- Add value of new cards to current total ---------------- */

function addValue(value, currentValue, hand){
  if(value === "ACE"){
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
  playerPoints.innerHTML = 0
  dealerPoints.innerHTML = 0
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
        dealerDraw()
      }, 500);
    }
    else{
      winCondition()
    }
  })
}


function winCondition(){
  if(parseInt(dealerPoints.innerHTML) > 21){
    dealerResult.innerHTML = "Bust"
  }
  else if(parseInt(dealerPoints.innerHTML) === parseInt(playerPoints.innerHTML)){
    playerResult.innerHTML = "Draw"
    dealerResult.innerHTML = "Draw"
  }
  else if(parseInt(dealerPoints.innerHTML) > parseInt(playerPoints.innerHTML)){
    dealerResult.innerHTML = "Win"
  }
  else if(parseInt(dealerPoints.innerHTML) < parseInt(playerPoints.innerHTML)){
    playerResult.innerHTML = "Win"
  }
}

