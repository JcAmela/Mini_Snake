document.addEventListener('touchstart', handleTouchStart, false);        
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;                                                        
var yDown = null;                                                        

function handleTouchStart(evt) {                                         
    xDown = evt.touches[0].clientX;                                      
    yDown = evt.touches[0].clientY;                                      
};                                                

function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return;
    }

    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
            /* left swipe */ 
            Game.direction = { x: -1, y: 0 };
        } else {
            /* right swipe */
            Game.direction = { x: 1, y: 0 };
        }                       
    } else {
        if (yDiff > 0) {
            /* up swipe */ 
            Game.direction = { x: 0, y: -1 };
        } else { 
            /* down swipe */
            Game.direction = { x: 0, y: 1 };
        }                                                                 
    }
    /* reset values */
    xDown = null;
    yDown = null;                                             
};

window.addEventListener('resize', function() {
  if (window.innerWidth < 1100) {
    document.getElementById('game-info-desktop').style.display = 'none';
    document.getElementById('game-info-mobile').style.display = 'block';
  } else {
    document.getElementById('game-info-desktop').style.display = 'block';
    document.getElementById('game-info-mobile').style.display = 'none';
  }
});
