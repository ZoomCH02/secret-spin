let min = 1;
let max = 469;
let spinning = false;
let canvas = document.getElementById("wheelCanvas");
let ctx = canvas.getContext("2d");
let currentRotation = 0;

function drawWheel() {
  const total = max - min + 1;
  const anglePerSlice = (2 * Math.PI) / total;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = centerX;
  const textMargin = 20;
  const textOffset = 5;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < total; i++) {
    const angle = i * anglePerSlice;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, angle, angle + anglePerSlice);
    ctx.fillStyle = i % 2 === 0 ? "#f4f4f4" : "#000000";
    ctx.fill();
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle + anglePerSlice / 2);
    ctx.fillStyle = i % 2 === 0 ? "#000000" : "#f4f4f4";
    ctx.font = "14px Arial";
    ctx.textAlign = "right";
    ctx.fillText(min + i, radius - textMargin, textOffset);
    ctx.restore();
  }
}

function applySettings() {
  let newMin = parseInt(document.getElementById("minInput").value);
  let newMax = parseInt(document.getElementById("maxInput").value);
  if (isNaN(newMin) || isNaN(newMax) || newMin >= newMax) {
    alert("Неверный диапазон.");
    return;
  }
  min = newMin;
  max = newMax;
  drawWheel();
}

function spinWheel() {
    if (spinning) return;
    spinning = true;
    document.getElementById("winner").classList.remove("show");
    document.getElementById("winner").textContent = "";
  
    const total = max - min + 1;
    const winnerNumber = Math.floor(Math.random() * total) + min;
    const winnerIndex = winnerNumber - min;
    const sliceAngle = 360 / total;
    const angle_middle = sliceAngle * (winnerIndex + 0.5) + 1.023; // Добавляем смещение
    const target_angle = 270;
    const totalRotation = 360 * 10;
    const stopAngle = totalRotation + (target_angle - angle_middle);
  
    currentRotation += stopAngle;
    canvas.style.transition = "transform 5s cubic-bezier(0.33, 1, 0.68, 1)";
    canvas.style.transform = `rotate(${currentRotation}deg)`;
  
    setTimeout(() => {
      // Определяем окончательный номер, учитывая смещение
      const finalAngle = (currentRotation % 360 + 360) % 360;
      const adjustedIndex = Math.floor(((270 - finalAngle + 360) % 360) / sliceAngle);
      const correctedWinner = min + ((adjustedIndex + total - 1) % total); // Корректировка для точности
      document.getElementById("winner").textContent = `Победитель: №${correctedWinner}`;
      document.getElementById("winner").classList.add("show");
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      spinning = false;
    }, 5200);
  }

// Первая отрисовка при загрузке
drawWheel();
