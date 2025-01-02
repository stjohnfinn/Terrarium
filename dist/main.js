function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}
function randomizeWithMargin(initial, margin, signed = false) {
    const min = initial - margin;
    const max = initial + margin;
    return signed ? Math.max(getRandomInt(min, max), 0) : getRandomInt(min, max);
}
function getAverage(...numbers) {
    const total = numbers.reduce((sum, num) => sum + num, 0);
    return numbers.length ? total / numbers.length : 0;
}
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
function clearCanvas(cv, color = "rgb(255, 255, 255)") {
    cv.getContext("2d").fillStyle = color;
    cv.getContext("2d").fillRect(0, 0, cv.width, cv.height);
}
