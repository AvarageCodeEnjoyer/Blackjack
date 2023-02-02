const hit = document.getElementById('hit')
const stand = document.getElementById('stand')
const double = document.getElementById('double')
const card1 = document.getElementById('card1')
const card2 = document.getElementById('card2')
const dealer1 = document.getElementById('dealer1')
const dealer2 = document.getElementById('dealer2')
const start = document.getElementById('start')
const playerValue = document.getElementById('playerValue')
const dealerValue = document.getElementById('dealerValue')
let deckId;

window.onload = () => {
  fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6")
    .then(Response => Response.json())
    .then(data => {
      // console.log(data.deck_id)
      deckId = data.deck_id
    })
}

start.addEventListener("click", e =>{
  fetch(url(deckId))
  .then(Response => Response.json())
  .then(data =>{
    card1.src = data.cards[0].image
    card2.src = data.cards[1].image
    dealer1.src = data.cards[2].image
    dealer2.src = data.cards[3].image
    playerValue.innerHTML = addValue(data.cards[0].value, data.cards[1].value)
    dealerValue.innerHTML = addValue(data.cards[2].value, data.cards[3].value)
    console.log(data.cards[0])
  })
})

function addValue(value1, value2){
  let total = 0;

  if(value1 === "ACE"){total += 11}
  else if(value1 === "KING" || value1 === "QUEEN" || value1 === "JACK"){total += 10}
  else{total += parseInt(value1)}

  if(value2 === "ACE"){total += 11}
  else if(value2 === "KING" || value2 === "QUEEN" || value2 === "JACK"){total += 10}
  else{total += parseInt(value2)}

  return total
}


hit.addEventListener("click", e => {
  e.preventDefault()
  fetch(url(deckId))
  .then(Response => Response.json())
  .then(data =>{
    card2.src = data.cards[0].image
    console.log(data.cards[0])
  })
})

double.addEventListener("click", e => {
  e.preventDefault()
  fetch(url(deckId))
  .then(Response => Response.json())
  .then(data =>{
    console.log(data)
  })
})

stand.addEventListener("click", e => {
  e.preventDefault()
  fetch(url(deckId))
  .then(Response => Response.json())
  .then(data =>{
    console.log(data)
  })
})


function url(deckId){
  return `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=4`
}
