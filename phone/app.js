import { db, ref, set, onValue} from "../shared/firebase.js";

const FADE_MS = 30 * 1000;      // match this to whatever we do in wall-A
const MIN_OPACITY = 0.2;

// picece = piece that the user picks
// reflection = user's reflection they enter
const state = {
    piece: null,
    reflection: " "
};

// hides every screen then only show the active one
function showScreen(id) {
    const screens = document.querySelectorAll(".screen");
    for (let i = 0; i < screens.length; i++) {
        screens[i].classList.remove("active");
    }
    document.getElementById(id).classList.add("active");
}


// FIRST SCREEN -------------------------------------------------------------
// first screen button
var startBtn = document.getElementById('start-btn');
startBtn.addEventListener('click', function () {
    showScreen('select-artwork')
});


// SELECTION SCREEN -------------------------------------------------------------
const TOTAL_PIECES = 54;
const pieceList = document.getElementById("piece-list");

// build all the buttons for users to pick an image
for (let i = 1; i <= TOTAL_PIECES; i++) {
  const btn = document.createElement("button");
  btn.className = "pieceBtns";
  btn.id = `piece-${i}-btn`;
  btn.dataset.piece = i;
  btn.setAttribute("aria-label", `Piece ${i}`);

  const img = document.createElement("img");
  img.src = `../images/wall-A-pieces/piece-${i}.png`;
  img.alt = "";

  btn.appendChild(img);
  pieceList.appendChild(btn);
}

// one click handler for all of them
pieceList.addEventListener("click", function (e) {
  const btn = e.target.closest(".pieceBtns");
  if (!btn) return;

  pieceList.querySelectorAll(".pieceBtns").forEach(b => b.classList.remove("is-selected"));
  btn.classList.add("is-selected");
  choosePiece(Number(btn.dataset.piece));
});

let selectedPiece = null;

// function to save which piece the user picks
function choosePiece(number) {
    selectedPiece = number;
    state.piece = number;
    console.log(state.piece);
}

// update buttons to whatever the wall's current state is
let squares = {};
onValue(ref(db, "walls/A/squares"), function (snapshot) {
  squares = snapshot.val() || {};
});

function updatePieces() {
  document.querySelectorAll(".pieceBtns").forEach(function (btn) {
    const n = btn.dataset.piece;
    const square = squares[n];
    const restoredAt = square ? square.restoredAt : undefined;

    // same brightness calculation as the wall
    let wallBrightness = MIN_OPACITY;
    let isRestored = false;
    if (restoredAt) {
      const age = Date.now() - restoredAt;
      wallBrightness = Math.max(MIN_OPACITY, 1 - age / FADE_MS);
      isRestored = age < FADE_MS;
    }

    // flip it: bright on the wall = dim on the phone
    const phoneOpacity = 1 + MIN_OPACITY - wallBrightness;

    btn.querySelector("img").style.opacity = phoneOpacity;
    btn.disabled = isRestored;
    if (isRestored) btn.classList.remove("is-selected");
  });
}

setInterval(updatePieces, 200);   // refresh 5 times a second

// submit button takes them to prompt screen
var selectPieceBtn = document.getElementById('select-piece-btn');
selectPieceBtn.addEventListener('click', function () {
    showScreen('prompt-screen')
});


// PROMPT SCREEN -------------------------------------------------------------
var submitBtn = document.getElementById('submit-btn');
submitBtn.addEventListener('click', function () {
    var reflectionTxt = document.getElementById('prompt-input').value.trim();

    if (reflectionTxt === "") {
        return;
    }

    state.reflection = reflectionTxt;
    drawResult();
    showScreen('share-screen')
    finishRestoring(selectedPiece);
});

function finishRestoring(n) {
  set(ref(db, `walls/A/squares/${n}`), { restoredAt: Date.now() });
}

// FINAL SCREEN -------------------------------------------------------------
function drawResult() {
  const canvas = document.getElementById("result-canvas");
  const ctx = canvas.getContext("2d");

  const img = new Image();

  img.onload = function () {
    // background
    ctx.fillStyle = "#222222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // image, stretched to fill the whole canvas
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // text on top
    ctx.fillStyle = "#ffffff";
    ctx.font = "48px sans-serif";
    ctx.fillText(state.reflection, 60, 900);
  };

  img.src = `../images/wall-A-pieces/piece-${state.piece}.png`;
}