window.initThreeTwoDefense = function(canvasId = "canvas") {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");

  const backgroundImage = new Image();
  backgroundImage.src = 'BACKCOURT.png';

  canvas.width = window.innerWidth + 200;
  canvas.height = window.innerHeight + 610;

  const centerX = canvas.width * 0.4 + 155;
  const semiRadius = 300;
  const yOffset = 400;
  const centerY = canvas.height / 2 + 100 + yOffset;

  let config;
  let currentBallIndex = 2;
  let ballWith;
  let data;

  const ballPositions = [];
  for (let i = 0; i < 5; i++) {
    const angle = Math.PI * (i / 4);
    ballPositions.push({
      x: centerX + semiRadius * Math.cos(angle),
      y: centerY - semiRadius * Math.sin(angle)
    });
  }

  const formationPoints = [
    { x: 0, y: 0, number: 1 },
    { x: -50, y: -50, number: 2 },
    { x: -50, y: 50, number: 3 },
    { x: -150, y: -50, number: 4 },
    { x: -150, y: 50, number: 5 }
  ];

  function drawCircle(x, y, radius = 15, color = "red", label) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
    if (label !== undefined) {
      ctx.fillStyle = "black";
      ctx.font = "bold 16px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, x, y);
    }
  }

  function rotatePoint(p, angle) {
    return {
      x: p.x * Math.cos(angle) - p.y * Math.sin(angle),
      y: p.x * Math.sin(angle) + p.y * Math.cos(angle)
    };
  }

  function isClose(a, b, tolerance = 0.1) {
    return Math.abs(a - b) < tolerance;
  }

  function getFormationCenter(ball) {
    const angle = Math.atan2(ball.y - centerY, ball.x - centerX);
    let distance = 120;
    if (ball.y < centerY && Math.abs(ball.x - centerX) > 50) distance = 80;
    return {
      x: ball.x - Math.cos(angle) * distance,
      y: ball.y - Math.sin(angle) * distance
    };
  }

  function getCustomPentagon(ball, center, ballIndex) {
    const angleToBall = Math.atan2(ball.y - center.y, ball.x - center.x);

    if (ballIndex === 4) {
      return [
        { x: ball.x + 100, y: ball.y, number: 2 },
        { x: ball.x + 250, y: ball.y - 150, number: 1 },
        { x: ball.x + 350, y: ball.y - 150, number: 3 },
        { x: ball.x + 250, y: ball.y, number: 4 },
        { x: ball.x + 350, y: ball.y, number: 5 }
      ];
    }

    if (ballIndex === 0) {
      return [
        { x: ball.x - 100, y: ball.y, number: 3 },
        { x: ball.x - 250, y: ball.y - 150, number: 1 },
        { x: ball.x - 350, y: ball.y - 150, number: 2 },
        { x: ball.x - 250, y: ball.y, number: 5 },
        { x: ball.x - 350, y: ball.y, number: 4 }
      ];
    }

    return formationPoints.map(p => {
      const rotated = rotatePoint(p, angleToBall);
      return {
        x: center.x + rotated.x,
        y: center.y + rotated.y,
        number: p.number
      };
    });
  }

  function drawFormation(ballIndex) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    const imgWidth = backgroundImage.width;
    const imgHeight = backgroundImage.height;
    const targetX = canvas.width / 2;
    const targetY = canvas.height / 2;

    ctx.translate(targetX, targetY);
    ctx.rotate(-Math.PI / 2);

    const scale = 2.0;
    const scaledWidth = imgWidth * scale;
    const scaledHeight = imgHeight * scale;
    ctx.drawImage(
      backgroundImage,
      -scaledWidth / 2,
      -scaledHeight / 2,
      scaledWidth,
      scaledHeight
    );
    
    ctx.restore();

    const ball = ballPositions[ballIndex];
    const formationCenter = getFormationCenter(ball);
    const players = getCustomPentagon(ball, formationCenter, ballIndex);

    drawCircle(ball.x, ball.y, 12, "orange");

    players.forEach(p => {
      drawCircle(p.x, p.y, 30, "lightgreen");

      let displayNumber;
      if (ballIndex === 1) {
        if (p.number === 3) displayNumber = 5;
        else if (p.number === 1) displayNumber = 3;
        else if (p.number === 5) displayNumber = 4;
        else if (p.number === 4) displayNumber = 2;
        else if (p.number === 2) displayNumber = 1;
      } else if (ballIndex === 3) {
        if (p.number === 3) displayNumber = 1;
        else if (p.number === 1) displayNumber = 2;
        else if (p.number === 5) displayNumber = 3;
        else if (p.number === 4) displayNumber = 5;
        else if (p.number === 2) displayNumber = 4;
      } else {
        displayNumber = p.number;
      }

      ctx.fillStyle = "black";
      ctx.font = " 20px Zen Dots";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(displayNumber, p.x, p.y);
      
      if (ballIndex === 0){
        ballWith = "Right Wing";
        data = "excels in scoring from long range, needs strong ball-handling, defense, and off-ball movement skills."
      } else if (ballIndex === 1) {
        ballWith = "Small Forward";
        data = "three-point accuracy, catch-and-shoot ability, shooting off the dribble, and finishing strong at the rim."
      } else if (ballIndex === 2) {
        ballWith = "Point Guard";
        data ="Great ball handler, decent shooter, quick and agile but not very physical.";
      } else if (ballIndex === 3) {
        ballWith = "Small Forward";
        data = "three-point accuracy, catch-and-shoot ability, shooting off the dribble, and finishing strong at the rim."
      } else {
        ballWith = "Left Wing";
        data = "excels in scoring from long range, needs strong ball-handling, defense, and off-ball movement skills.";
      }
      document.getElementById("data").textContent = data;
      document.getElementById("ballIndexLabel").textContent = ballWith;

    });
  }

  backgroundImage.onload = () => drawFormation(currentBallIndex);

  function handleKeyDown(e) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      currentBallIndex = (currentBallIndex + 1) % ballPositions.length;
      drawFormation(currentBallIndex);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      currentBallIndex = (currentBallIndex - 1 + ballPositions.length) % ballPositions.length;
      drawFormation(currentBallIndex);
    } else if (e.key === "D") {
      document.removeEventListener("keydown", handleKeyDown); // ✅ Correct usage
    }
  }
  
  document.addEventListener("keydown", handleKeyDown);
  

  drawFormation(currentBallIndex);
};
