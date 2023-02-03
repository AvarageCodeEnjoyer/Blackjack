const hit = document.getElementById('hit')
const stand = document.getElementById('stand')
const double = document.getElementById('double')
const start = document.getElementById('start')
const playerPoints = document.getElementById('playerPoints')
const dealerPoints = document.getElementById('dealerPoints')
const playerCards = document.getElementById('playerCards')
const dealerCards = document.getElementById('dealerCards')
let startChecked = false
let playArea
let deckId

window.onload = () => {
  fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6")
    .then(Response => Response.json())
    .then(data => {
      deckId = data.deck_id
    })
}

start.addEventListener("click", e =>{
  reset()
  console.log(playerPoints.style.color)
  let total = 0;
  startChecked = true
  fetch(drawCard(deckId, 4))
  .then(Response => Response.json())
  .then(data =>{
    for(i = 0; i <= 1; i++){addCards(data, playerCards, i, playerPoints)}
    for(i = 2; i <= 3; i++){addCards(data, dealerCards, i, dealerPoints)}
    playerPoints.innerHTML = addValue(data.cards[0].value, total) + addValue(data.cards[1].value, total)
    dealerPoints.innerHTML = addValue(data.cards[2].value, total) + addValue(data.cards[3].value, total)
  })
})



hit.addEventListener("click", e => {
  if(!startChecked) return
  e.preventDefault()
  fetch(drawCard(deckId, 1))
  .then(Response => Response.json())
  .then(data =>{
    addCards(data, playerCards, 0, playerPoints)
  })
})

/* double.addEventListener("click", e => {
  if(!startChecked) return
  e.preventDefault()
  fetch(drawCard(deckId))
  .then(Response => Response.json())
  .then(data =>{
    console.log(data)
  })
}) */

stand.addEventListener("click", e => {
  if(!startChecked) return
  e.preventDefault()
  // if()
})

/* -------------------------------- Functions ------------------------------- */

function drawCard(deckId, i){
  return `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${i}`
}

function addCards(data, playArea, i, cardPoints){
  let createCard = document.createElement('img')
  createCard.src = data.cards[i].image
  playArea.appendChild(createCard)
  cardPoints.innerHTML = addValue(data.cards[i].value, parseInt(cardPoints.innerHTML))
  if(parseInt(cardPoints.innerHTML) > 21){
    cardPoints.style.color = "red"
    console.log(playerPoints.innerHTML)
    startChecked = false
  }
  return
}

function addValue(value, total){
  if(value === "ACE"){total += 11}
  else if(value === "KING" || value === "QUEEN" || value === "JACK"){total += 10}
  else{total += parseInt(value)}
  return total
}

function reset(){
  playerPoints.style.color = "black"
  dealerPoints.style.color = "black"
  playerPoints.innerHTML = ""
  dealerPoints.innerHTML = ""
  playerCards.innerHTML = ""
  dealerCards.innerHTML = ""
}
