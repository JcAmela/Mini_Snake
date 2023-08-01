// touchControl.js

var touchStartX = 0;
var touchStartY = 0;

function handleTouchStart(e) {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}

function handleTouchMove(e) {
  e.preventDefault();
  if (!touchStartX || !touchStartY) {
    return;
  }

  var xUp = e.touches[0].clientX;
  var yUp = e.touches[0].clientY;

  var xDiff = touchStartX - xUp;
  var yDiff = touchStartY - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff > 0) {
      changeDirection({x: -1, y: 0});
    } else {
      changeDirection({x: 1, y: 0});
    }                       
  } else {
    if (yDiff > 0) {
      changeDirection({x: 0, y: -1});
    } else { 
      changeDirection({x: 0, y: 1});
    }                                                                 
  }
  touchStartX = null;
  touchStartY = null;                                           
}

window.addEventListener('touchstart', handleTouchStart, false);
window.addEventListener('touchmove', handleTouchMove, false);
