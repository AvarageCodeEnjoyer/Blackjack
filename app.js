const hit = document.getElementById('hit')
const stand = document.getElementById('stand')
const start = document.getElementById('start')
const money = document.getElementById('money')
const double = document.getElementById('double')
const playerCards = document.getElementById('playerCards')
const dealerCards = document.getElementById('dealerCards')
const playerPoints = document.getElementById('playerPoints')
const dealerPoints = document.getElementById('dealerPoints')
const dealerResult = document.getElementById('dealerResult')
const playerResult = document.getElementById('playerResult')

const betAdd = document.getElementById('betAdd')
const betAmount = document.getElementById('betAmount')
let totalBet = 0

let startChecked = false
let playerHand = []
let dealerHand = []
let playerMoney = 1000
let playArea
let bet = 0
let deckId

let startClick = () => {
  reset()
  if (totalBet == 0) {
    alert("You need to make a bet")
    return
  }
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
    /* if(parseInt(playerPoints.innerHTML) === 21 && parseInt(dealerPoints.innerHTML) === 21){
      startChecked = false
      playerResult.innerHTML = "Draw"
      dealerResult.innerHTML = "Draw"
    } */
    if(parseInt(playerPoints.innerHTML) === 21){
      playerResult.innerHTML = "BJACK!"
      playerResult.style.writingMode = "vertical-rl"
      fetch(drawCard(deckId, 1))
      .then(Response => Response.json())
      .then(data => {
        unHideCard(data)
        playerMoney += totalBet * 2.5
        money.innerText = `$${playerMoney}`
        betAmount.innerText = "$0000"
        totalBet = 0
      })
    }
  })
}

var standClick = () => {
  if (!startChecked) return
  if (bet == 0) {
    alert("You need to make a bet")
    return
  }
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
      calculateBet()
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

/* ----------------- Add event listener to the "bet" button ----------------- */

betAdd.addEventListener('click', addBet)

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
    if(currentValue <= 10) currentValue += 11 
    else if (hand[0].value === "ACE" || hand[1].value === "ACE" ) {
      currentValue += 1
    }
  }
  else if(value === "KING" || value === "QUEEN" || value === "JACK"){currentValue += 10}
  else{currentValue += parseInt(value)} 
  return currentValue
}

/* ----------------------- Add bet to the bet variable ---------------------- */

function addBet() {
  if (startChecked) return
  const betInput = document.getElementById('betInput')
  bet = parseInt(betInput.value)
  if (playerMoney - betInput.value < 0) {
    alert("You don't have the funds to bet that amount")
    return
  }  
  console.log(bet)
  playerMoney -= bet
  totalBet += bet

  betAmount.innerText = `$${totalBet}`
  money.innerText = `$${playerMoney}`
}

/* ------------------- Calculate the money the player gets ------------------ */

function calculateBet() {
  if (winCondition()) {
    playerMoney += totalBet * 2
    money.innerText = `$${playerMoney}`
  }
  else if (!winCondition()) {
    money.innerText = `$${playerMoney}`
  }
  else {
    playerMoney += totalBet
  }
  betAmount.innerText = "$0000"
  totalBet = 0
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
      calculateBet()
    }
  })
}

/* -------------- Check for winner when no more cards are drawn ------------- */

function winCondition(){
  if(parseInt(dealerPoints.innerHTML) > 21){
    dealerResult.innerHTML = "Bust"
    return true
  }
  else if(parseInt(dealerPoints.innerHTML) === parseInt(playerPoints.innerHTML)){
    playerResult.innerHTML = "Draw"
    dealerResult.innerHTML = "Draw"
    return "Draw"
  }
  else if(parseInt(dealerPoints.innerHTML) > parseInt(playerPoints.innerHTML)){
    dealerResult.innerHTML = "Win"
    return false
  }
  else if(parseInt(dealerPoints.innerHTML) < parseInt(playerPoints.innerHTML)){
    playerResult.innerHTML = "Win"
    return true
  }
}

