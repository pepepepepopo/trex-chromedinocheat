// ====== UI BASE ======
const cheatUI = document.createElement("div");
cheatUI.style.position = "fixed";
cheatUI.style.top = "20px";
cheatUI.style.right = "20px";
cheatUI.style.zIndex = 9999;
cheatUI.style.background = "#111";
cheatUI.style.padding = "10px";
cheatUI.style.border = "2px solid lime";
cheatUI.style.borderRadius = "10px";
cheatUI.style.fontFamily = "monospace";
cheatUI.style.color = "white";
cheatUI.style.width = "180px";
document.body.appendChild(cheatUI);

function addButton(label, callback) {
  const btn = document.createElement("button");
  btn.innerText = label;
  btn.style.display = "block";
  btn.style.width = "100%";
  btn.style.margin = "5px 0";
  btn.style.padding = "5px";
  btn.style.border = "none";
  btn.style.borderRadius = "5px";
  btn.style.background = "#222";
  btn.style.color = "lime";
  btn.onclick = callback;
  cheatUI.appendChild(btn);
}

// ====== GOD MODE ======
let godMode = false;
addButton("Toggle God Mode", () => {
  godMode = !godMode;
  Runner.prototype.gameOver = godMode ? function () {} : originalGameOver;
  alert(`God Mode: ${godMode ? "ON" : "OFF"}`);
});
const originalGameOver = Runner.prototype.gameOver;

// ====== AUTO JUMP ======
let autoJump = false;
let autoJumpInterval;
addButton("Toggle Auto Jump", () => {
  autoJump = !autoJump;
  if (autoJump) {
    autoJumpInterval = setInterval(() => {
      const tRex = Runner.instance_.tRex;
      const obs = Runner.instance_.horizon.obstacles[0];
      if (obs && obs.xPos < 150 && obs.xPos > 0 && !tRex.jumping) {
        tRex.startJump();
      }
    }, 10);
  } else {
    clearInterval(autoJumpInterval);
  }
  alert(`Auto Jump: ${autoJump ? "ON" : "OFF"}`);
});

// ====== SPEED BOOST ======
addButton("Set Speed x5", () => {
  Runner.instance_.setSpeed(50);
  alert("Speed set to 50");
});

// ====== FLY MODE ======
let flyMode = false;
let flyInterval;
addButton("Toggle Fly Mode", () => {
  flyMode = !flyMode;
  const tRex = Runner.instance_.tRex;
  if (flyMode) {
    flyInterval = setInterval(() => {
      tRex.gravity = 0;
      tRex.setJumpVelocity = () => 0;
      if (keys["w"]) tRex.yPos -= 5;
      if (keys["s"]) tRex.yPos += 5;
    }, 10);
  } else {
    clearInterval(flyInterval);
    tRex.gravity = 0.6;
    tRex.setJumpVelocity = function () {
      this.jumpVelocity = this.config.INITIAL_JUMP_VELOCITY;
      this.jumping = true;
      this.reachedMinHeight = false;
      this.speedDrop = false;
    };
  }
  alert(`Fly Mode: ${flyMode ? "ON" : "OFF"}`);
});

// ====== SCORE CHANGER ======
const scoreInput = document.createElement("input");
scoreInput.type = "number";
scoreInput.placeholder = "Set Score";
scoreInput.style.width = "100%";
scoreInput.style.marginTop = "5px";
scoreInput.style.padding = "5px";
scoreInput.style.border = "1px solid lime";
scoreInput.style.borderRadius = "5px";
scoreInput.style.background = "#000";
scoreInput.style.color = "lime";
cheatUI.appendChild(scoreInput);

addButton("Apply Score", () => {
  const score = parseInt(scoreInput.value);
  if (!isNaN(score)) {
    Runner.instance_.distanceRan = score / Runner.instance_.distanceMeter.config.COEFFICIENT;
    Runner.instance_.distanceMeter.set(score);
    alert("Score set!");
  } else {
    alert("Invalid number");
  }
});

// ====== KEYBINDS ======
const keys = {};
document.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;
});
document.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});
