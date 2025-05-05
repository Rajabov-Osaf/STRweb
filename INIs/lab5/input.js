
const targets = document.querySelectorAll('.target');

let currentDragged = null;
let isSticky = false;
let initialPosition = null;

let onMouseMove = null;
let onMouseClick = null;

function startDrag(event, target) {
    if (isSticky) return;
    currentDragged = target;
    initialPosition = { top: target.offsetTop, left: target.offsetLeft };
    const offsetX = event.clientX - target.offsetLeft;
    const offsetY = event.clientY - target.offsetTop;

    const moveHandler = (e) => {
        if (currentDragged) {
            currentDragged.style.left = `${e.clientX - offsetX}px`;
            currentDragged.style.top = `${e.clientY - offsetY}px`;
        }
    };

    const upHandler = () => {
        currentDragged = null;
        document.removeEventListener('mousemove', moveHandler);
        document.removeEventListener('mouseup', upHandler);
    };

    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', upHandler);
}

function stickToMouse(event, target) {
    if (isSticky) return;
    isSticky = true;
    currentDragged = target;
    target.style.backgroundColor = 'green';

    onMouseMove = (e) => {
        if (isSticky && currentDragged) {
            currentDragged.style.left = `${e.clientX}px`;
            currentDragged.style.top = `${e.clientY}px`;
        }
    };

    onMouseClick = () => {
        isSticky = false;
        if (currentDragged) {
            currentDragged.style.backgroundColor = 'red';
        }
        currentDragged = null;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('click', onMouseClick);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('click', onMouseClick);
}

function resetPosition(event) {
    if (event.key === 'Escape' && currentDragged) {
        currentDragged.style.left = `${initialPosition.left}px`;
        currentDragged.style.top = `${initialPosition.top}px`;
        currentDragged.style.backgroundColor = 'red';
        currentDragged = null;
        isSticky = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('click', onMouseClick);
    }
}

let isTouchMode = false;
let initialTouchPosition = null;
let moveHandlerTouch = null;

function handleTouchStart(event, target) {
    if (isSticky || event.touches.length > 1) return;  

    if (!isTouchMode) {
        stickToMouse(event, target);  
        isTouchMode = true;
    }

    const touch = event.touches[0];
    initialTouchPosition = { top: target.offsetTop, left: target.offsetLeft };
    const offsetX = touch.clientX - target.offsetLeft;
    const offsetY = touch.clientY - target.offsetTop;

    moveHandlerTouch = (e) => {
        if (target) {
            const touch = e.touches[0];
            target.style.left = `${touch.clientX - offsetX}px`;
            target.style.top = `${touch.clientY - offsetY}px`;
        }
    };

    document.addEventListener('touchmove', moveHandlerTouch);
}

function handleTouchEnd(event) {
    if (event.touches.length === 0) {
        isTouchMode = false;
        document.removeEventListener('touchmove', moveHandlerTouch);
    }

    if (event.touches.length > 1) {
        if (currentDragged) {
            currentDragged.style.left = `${initialPosition.left}px`;
            currentDragged.style.top = `${initialPosition.top}px`;
            currentDragged.style.backgroundColor = 'red';
        }
    }
}

targets.forEach((target) => {
    target.addEventListener('mousedown', (event) => startDrag(event, target));
    target.addEventListener('dblclick', (event) => stickToMouse(event, target));
    target.addEventListener('touchstart', (event) => handleTouchStart(event, target));
    target.addEventListener('touchend', handleTouchEnd);
});

document.addEventListener('keydown', resetPosition);