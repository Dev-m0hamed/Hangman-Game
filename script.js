const hangmanDraw = document.querySelector(".hangman-draw");
const lettersContainer = document.querySelector(".letters");
const lettersGuessContainer = document.querySelector(".letters-guess");

const letters = "abcdefghijklmnopqrstuvwxyz";
const lettersArray = Array.from(letters);

lettersArray.forEach((letter) => {
  const span = document.createElement("span");
  span.className = "letter-box";
  const spanTxt = document.createTextNode(letter);
  span.appendChild(spanTxt);
  lettersContainer.appendChild(span);
});

async function fetchWords() {
  const response = await fetch("words.json");
  const words = await response.json();
  const countries = words.countries;
  const randomCountry = Array.from(
    countries[Math.floor(Math.random() * countries.length)].toLowerCase()
  );

  document.querySelector(".category span").innerHTML = "Countries";

  randomCountry.forEach((letter) => {
    const span = document.createElement("span");
    if (letter === " ") span.className = "has-space";
    lettersGuessContainer.appendChild(span);
  });

  const guessSpan = document.querySelectorAll(".letters-guess span");
  let wrongAttempts = 0;

  document.addEventListener("click", (e) => {
    let status = false;
    if (e.target.classList.contains("letter-box")) {
      e.target.classList.add("clicked");
      let clickedLetter = e.target.innerHTML.toLowerCase();
      randomCountry.forEach((letter, index) => {
        if (clickedLetter === letter) {
          status = true;
          guessSpan.forEach((span, spanIndex) => {
            if (index === spanIndex) {
              span.innerHTML = clickedLetter;
            }
          });
        }
      });
      if (status !== true) {
        wrongAttempts++;
        document.getElementById("failed").play();
        hangmanDraw.classList.add(`wrong-${wrongAttempts}`);
        if (wrongAttempts === 8) {
          endGame(guessSpan, false, randomCountry);
        }
      } else {
        document.getElementById("success").play();
        if ([...guessSpan].every((span) => span.innerHTML !== "")) {
          endGame(guessSpan, true);
        }
      }
    }
  });
}
const endGame = (guessSpan, isWin, randomCountry) => {
  lettersContainer.classList.add("finished");
  let div = document.createElement("div");
  div.className = "popup";
  isWin
    ? (div.innerText = "مبروك ربحت")
    : (div.innerText = "حرام عليك موت الراجل\n" + randomCountry.join(""));
  document.body.appendChild(div);
  const reloadBtn = document.createElement("button");
  reloadBtn.className = "reload";
  const btnText = document.createTextNode("Restart");
  reloadBtn.appendChild(btnText);
  document.body.appendChild(reloadBtn);
  reloadBtn.onclick = function () {
    window.location.reload();
  };
};
fetchWords();
