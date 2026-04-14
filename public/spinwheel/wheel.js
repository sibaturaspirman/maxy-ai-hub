const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  const canvas = document.getElementById("wheelCanvas");
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}

resizeCanvas();
window.addEventListener("DOMContentLoaded", resizeCanvas);
window.addEventListener("resize", resizeCanvas);


const centerX = () => canvas.width / 2;
const centerY = () => canvas.height / 2;
const radius = () => Math.min(canvas.width, canvas.height) / 2 - 40;

let angle = 0;
let spinning = false;
const segmentLabels = ["Tumbler", "Coffee", "Sticker", "Wallet"];
const SLICE_COUNT = segmentLabels.length;
const SLICE_ANGLE = 360 / SLICE_COUNT;

const tickSound = document.getElementById("tickSound");

// Load the wheel image
const wheelImage = new Image();
let wheelImageLoaded = false;
wheelImage.src = "assets/bulet.png";
wheelImage.onload = () => {
  wheelImageLoaded = true;
  drawWheel();
};

function drawWheel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!wheelImageLoaded) return;

  const size = radius() * 2;

  ctx.save();
  ctx.translate(centerX(), centerY());
  ctx.rotate(angle);
  ctx.drawImage(wheelImage, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
  ctx.restore();

  for (let i = 0; i < SLICE_COUNT; i++) {
    const label = segmentLabels[i];
    const image = labelImages[label];

    if (image.complete) {
      const imgSize = 48; // Ubah ukuran gambar label di sini
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(theta + Math.PI / 2);
      ctx.drawImage(image, -imgSize / 2, -imgSize / 2, imgSize, imgSize);
      ctx.restore();
    }
  }

  // Optional center circle
  // ctx.beginPath();
  // ctx.arc(centerX(), centerY(), 30, 0, Math.PI * 2);
  // ctx.fillStyle = "#fff";
  // ctx.fill();
  // ctx.strokeStyle = "#999";
  // ctx.stroke();
}

function spinWheel() {
  if (spinning || !wheelImageLoaded) return;

  spinning = true;
  document.getElementById("result").textContent = "";
  document.getElementById("spinBtn").style.display = "none";
  document.getElementById("resetBtn").style.display = "none";

  const spinTime = 4000;
  const spinAngle = Math.random() * 360 + 720;
  const targetAngle = (angle * 180 / Math.PI + spinAngle) % 360;

  const start = performance.now();
  let lastTick = -1;

  function animate(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / spinTime, 1);
    const eased = easeOutCubic(progress);
    angle = (spinAngle * eased) * Math.PI / 180;
    drawWheel();

    // Play tick sound per slice (optional logic per 10 slices)
    const index = Math.floor(((360 - (angle * 180 / Math.PI) + 90) % 360) / SLICE_ANGLE);
    if (index !== lastTick) {
      tickSound.currentTime = 0;
      tickSound.play();
      lastTick = index;
    }

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      spinning = false;
      showResult(targetAngle);
      document.getElementById("resetBtn").style.display = "inline-block";
    }
  }

  requestAnimationFrame(animate);
}

const labelImages = {
  Tumbler: new Image(),
  Coffee: new Image(),
  Sticker: new Image(),
  Wallet: new Image(),
};

labelImages.Tumbler.src = '/assets/tumbler.png';
labelImages.Coffee.src = '/assets/coffee.png';
labelImages.Sticker.src = '/assets/sticker.png';
labelImages.Wallet.src = '/assets/wallet.png';

function spin() {
  if (spinning) return;
  spinning = true;

  // Acak hadiah
  const prizeIndex = Math.floor(Math.random() * SLICE_COUNT);
  const prizeLabel = segmentLabels[prizeIndex];

  // Tambahkan beberapa putaran (misalnya 5 putaran) lalu stop di hadiah
  const extraRotation = 360 * 5;
  const targetRotation = extraRotation + (SLICE_ANGLE * prizeIndex);

  // Simpan hasil rotasi dalam radian
  const targetRadian = targetRotation * Math.PI / 180;

  // Set easing animasi
  let start = null;
  const duration = 4000;
  const startAngle = angle;

  function animate(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    const t = Math.min(progress / duration, 1);
    const eased = easeOutCubic(t);
    angle = startAngle + (targetRadian - startAngle) * eased;
    drawWheel();

    if (t < 1) {
      requestAnimationFrame(animate);
    } else {
      spinning = false;
      showResult(prizeLabel); // ⬅️ tampilkan label hadiah
    }
  }

  requestAnimationFrame(animate);
}


// function showResult(degree) {
//   const normalized = (360 - degree + 90) % 360;
//   const index = Math.floor(normalized / SLICE_ANGLE);
//   const result = segmentLabels[index] || `Slice ${index + 1}`;
//   document.getElementById("result").textContent = `🎉 Kamu mendapatkan: ${result}!`;
// }

function showResult(label) {
  document.getElementById("result").textContent = `🎉 Kamu mendapatkan: ${label}!`;
}

function resetWheel() {
  angle = 0;
  drawWheel();
  document.getElementById("result").textContent = "";
  document.getElementById("resetBtn").style.display = "none";
  setTimeout(spinWheel, 300);
}

function easeOutCubic(t) {
  return (--t) * t * t + 1;
}

document.getElementById("spinBtn").addEventListener("click", spin);
document.getElementById("resetBtn").addEventListener("click", resetWheel);
