let score = 0;
let frogImg = document.getElementById("frog");
let fishImg = document.getElementById("fish");
let netImg = document.getElementById("net");
let scoreDisplay = document.getElementById("score");

// Store interval IDs for frog and fish
let frogInterval, fishInterval;

const randomPosition = (min, max) => Math.random() * (max - min) + min;

const resetCreaturePosition = (creature) => {
    let newTop = randomPosition(10, 80);
    creature.style.top = `${newTop}%`;
    creature.style.left = "-60px"; // Start the creature off-screen
};

const moveCreature = (creature, speed) => {
    let x = -60; // Start the creature off-screen
    let y = randomPosition(10, 80);
    creature.style.top = `${y}%`;

    // Clear previous interval for this creature
    if (creature === frogImg && frogInterval) {
        clearInterval(frogInterval);
    } else if (creature === fishImg && fishInterval) {
        clearInterval(fishInterval);
    }

    // Create new interval and store ID
    let interval = setInterval(() => {
        x += speed;
        if (x > window.innerWidth) {
            clearInterval(interval);
            resetCreaturePosition(creature);
            // Increase speed based on score
            let newSpeed = randomPosition(3 + score * 0.2, 7 + score * 0.5); 
            moveCreature(creature, newSpeed);
        }
        creature.style.left = `${x}px`;
    }, 20);

    // Store interval ID for this creature
    if (creature === frogImg) {
        frogInterval = interval;
    } else if (creature === fishImg) {
        fishInterval = interval;
    }
};

const detectCollision = () => {
    let frogRect = frogImg.getBoundingClientRect();
    let fishRect = fishImg.getBoundingClientRect();
    let netRect = netImg.getBoundingClientRect();

    if (isCollision(frogRect, netRect)) {
        score++;
        resetCreaturePosition(frogImg);
        let newSpeed = randomPosition(3 + score * 0.2, 7 + score * 0.5); 
        moveCreature(frogImg, newSpeed);
    }

    if (isCollision(fishRect, netRect)) {
        score++;
        resetCreaturePosition(fishImg);
        let newSpeed = randomPosition(4 + score * 0.3, 8 + score * 0.6); 
        moveCreature(fishImg, newSpeed);
    }

    scoreDisplay.textContent = score;
};

const isCollision = (rect1, rect2) => {
    return (
        rect1.left < rect2.right &&
        rect1.right > rect2.left &&
        rect1.top < rect2.bottom &&
        rect1.bottom > rect2.top
    );
};

// Initial setup and movement
resetCreaturePosition(frogImg);
resetCreaturePosition(fishImg);
moveCreature(frogImg, 4);
moveCreature(fishImg, 6);

// Handle mouse or touch movement
const updateNetPosition = (e) => {
    let x, y;
    if (e.type === 'mousemove') {
        x = e.clientX;
        y = e.clientY;
    } else if (e.type === 'touchmove') {
        // For touch events, use the first touch point
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
    }
    
    netImg.style.left = `${x - 40}px`; // Adjust to center the net on the cursor/touch
    netImg.style.top = `${y - 40}px`; // Adjust to center the net on the cursor/touch
};

// Add mousemove event for desktops
document.addEventListener("mousemove", updateNetPosition);

// Add touchmove event for mobile devices
document.addEventListener("touchmove", updateNetPosition);

// Check for collisions every frame
setInterval(detectCollision, 20);