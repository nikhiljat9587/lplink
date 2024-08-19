// Get the necessary HTML elements
const spinBtn = document.getElementById('spin-btn');
const wheel = document.getElementById('wheel');
const ctx = wheel.getContext('2d');
const leaderboardList = document.getElementById('leaderboard-list');

// Segments on the wheel and their corresponding colors
const segments = ['Next Time', '20 RS', '50 RS', 'ADD FRIEND 100RS', 'Buy product 10% off', '200 RS'];
const colors = ['red', 'blue', '#3357FF', 'pink', '#FF33A1', '#A133FF'];

let currentAngle = 0;   // Starting angle for the wheel
let spinning = false;   // To check if the wheel is currently spinning
let spinStartTime;      // Time when the spin started
let spinDuration = 5000; // Total spin duration (5 seconds)
let startAngle = 0;     // Angle at which the spin started
let targetAngle = 0;    // Target angle where the wheel should stop

// Function to draw the wheel with segments
function drawWheel() {
    const segmentAngle = 2 * Math.PI / segments.length; // Angle of each segment
    ctx.clearRect(0, 0, wheel.width, wheel.height);     // Clear canvas before redraw
    segments.forEach((segment, i) => {
        ctx.beginPath();
        ctx.moveTo(wheel.width / 2, wheel.height / 2);
        ctx.arc(wheel.width / 2, wheel.height / 2, wheel.width / 2, currentAngle, currentAngle + segmentAngle);
        ctx.fillStyle = colors[i]; // Set segment color
        ctx.fill();
        ctx.save();
        ctx.translate(wheel.width / 2, wheel.height / 2);
        ctx.rotate(currentAngle + segmentAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.fillText(segment, wheel.width / 2 - 10, 10); // Segment text
        ctx.restore();
        currentAngle += segmentAngle; // Update angle for next segment
    });
}

// Function to animate the spinning of the wheel
function animateSpin(timestamp) {
    if (!spinStartTime) spinStartTime = timestamp;
    const elapsedTime = timestamp - spinStartTime;

    if (elapsedTime < spinDuration) {
        const easeOut = (t) => (--t) * t * t + 1; // Easing function for smooth slowing
        const progress = easeOut(elapsedTime / spinDuration);
        currentAngle = startAngle + (targetAngle - startAngle) * progress; // Calculate current angle
        drawWheel();
        requestAnimationFrame(animateSpin); // Continue animation
    } else {
        spinning = false;
        spinStartTime = null;
        const segmentAngle = 2 * Math.PI / segments.length;
        const winningSegmentIndex = Math.floor(((currentAngle + Math.PI / 2) % (2 * Math.PI)) / segmentAngle); 
        const winningSegment = segments[segments.length - 1 - winningSegmentIndex]; // Fix to ensure correct segment
        
        // Show the winning result in a green box
        showWinningMessage(`You won ${winningSegment}!`);
        
        // Add the winning segment to the leaderboard
        addToLeaderboard(`Player won ${winningSegment}`);
    }
}

// Function to spin the wheel
function spinWheel() {
    if (spinning) return;
    spinning = true;
    startAngle = currentAngle; // Set start angle
    targetAngle = startAngle + (Math.random() * 4 + 6) * 2 * Math.PI; // Determine random target angle
    spinStartTime = null;
    requestAnimationFrame(animateSpin); // Start the spin animation
}

// Function to add winning result to the leaderboard
function addToLeaderboard(entry) {
    const li = document.createElement('li');
    li.textContent = entry;
    leaderboardList.appendChild(li);
}

// Function to show the winning message in a green box on the HTML page
function showWinningMessage(message) {
    // Create a div element for the green box
    const winBox = document.createElement('div');
    winBox.textContent = message;
    winBox.style.position = 'fixed';
    winBox.style.top = '50%';
    winBox.style.left = '50%';
    winBox.style.transform = 'translate(-50%, -50%)';
    winBox.style.backgroundColor = '#28a745'; // Green background color
    winBox.style.color = '#fff';
    winBox.style.padding = '20px';
    winBox.style.fontSize = '24px';
    winBox.style.borderRadius = '10px';
    winBox.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    document.body.appendChild(winBox); // Add the green box to the body

    // Remove the green box after 5 seconds
    setTimeout(() => {
        document.body.removeChild(winBox);
    }, 5000);
}

// Event listener for the spin button
spinBtn.addEventListener('click', spinWheel);

// Initial draw of the wheel
drawWheel();
  function goBack() {
            window.history.back();
        }