document.addEventListener("DOMContentLoaded", function () {
  const cardsContainer = document.getElementById("cards");
  let cards = [];
  let firstCard, secondCard;
  let lockBoard = false;
  let score = 0;
  let scoreBoard = document.getElementById("score");
  scoreBoard.textContent = score;
  fetch("./data/cards.json")
    .then((res) => res.json())
    .then((data) => {
      cards = [...data, ...data];
      shuffleCards();
      generateCards();
      console.log(cards);
    });

  function shuffleCards() {
    let currentIndex = cards.length;
    let randomIndex;
    let temporaryValue;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = cards[currentIndex];
      cards[currentIndex] = cards[randomIndex];
      cards[randomIndex] = temporaryValue;
    }
  }

  function generateCards() {
    for (let card of cards) {
      const cardElement = document.createElement("div");
      cardElement.classList.add("card");
      cardElement.setAttribute("data-name", card.name);
      cardElement.innerHTML = `<div class="front">
                <img class="front-image" src=${card.image}>
               </div>
               <div class="back"></div>
            `;
      cardsContainer.appendChild(cardElement);
      cardElement.addEventListener("click", flip);
      cardElement.addEventListener("touchstart", flip);
    }
  }

  function flip() {
    if (lockBoard) return;
    if (this === firstCard) return;
    this.classList.add("flipped");
    if (!firstCard) {
      firstCard = this;
      return;
    }
    secondCard = this;
    lockBoard = true;
    checkForMatch();
  }
  function checkForMatch() {
    if (firstCard.dataset.name === secondCard.dataset.name) {
      disableCards();
    } else {
      unflip();
    }
  }
  function unlockBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
  }
  function disableCards() {
    firstCard.removeEventListener("click", flip);
    secondCard.removeEventListener("click", flip);
    firstCard.removeEventListener("touchstart", flip);
    secondCard.removeEventListener("touchstart", flip);
    score++;
    if (score === 9) {
      startConfetti();
    } else {
      stopConfetti();
    }
    scoreBoard.textContent = score;
    unlockBoard();
  }
  function unflip() {
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      unlockBoard();
    }, 1000);
  }
});
function restart() {
  window.location.reload();
}
