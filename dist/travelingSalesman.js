// "Given a list of cities and the distances between each pair of cities, what 
// is the shortest possible route that visits each city exactly once and returns 
// to the origin city?"
const CANVAS_HEIGHT = 250;
const CANVAS_WIDTH = 250;
const CITIES_COUNT = 40;
const CITY_PLACEMENT_PADDING = 10;
const MUTATION_CHANCE = 0.02;
function distance(start, end) {
    return Math.sqrt(Math.pow(start.longitude - end.longitude, 2) + Math.pow(start.latitude - end.latitude, 2));
}
function generateCity() {
    return {
        longitude: getRandomInt(0 + CITY_PLACEMENT_PADDING, CANVAS_WIDTH - CITY_PLACEMENT_PADDING),
        latitude: getRandomInt(0 + CITY_PLACEMENT_PADDING, CANVAS_HEIGHT - CITY_PLACEMENT_PADDING)
    };
}
function findDuplicate(cities) {
    const seen = new Set();
    for (let i = 0; i < cities.length; i++) {
        if (seen.has(cities[i])) {
            return i;
        }
        seen.add(cities[i]);
    }
    return -1;
}
let cities = [];
// add one so that we can .pop() the home city off the top
for (let i = 0; i < CITIES_COUNT + 1; i++) {
    cities.push(generateCity());
}
// remove duplicates
let duplicateIndex = findDuplicate(cities);
while (duplicateIndex > -1) {
    cities[duplicateIndex] = generateCity();
    duplicateIndex = findDuplicate(cities);
}
const HOME_CITY = cities.pop();
//##############################################################################
// createOrganism
//##############################################################################
class SalesmanRouteOrganism {
    constructor(cities, mutation_chance) {
        this.mutationChance = mutation_chance;
        // select N random cities, where N is a random number between 1 + 1 + 1 and CITIES_COUNT
        this.genes = [];
        let tempCitiesCopy = [...cities];
        while (tempCitiesCopy.length > 0) {
            const randomIndex = Math.floor(Math.random() * tempCitiesCopy.length);
            this.genes.push(tempCitiesCopy.splice(randomIndex, 1)[0]);
        }
    }
}
function createOrganism() {
    return new SalesmanRouteOrganism(structuredClone(cities), MUTATION_CHANCE);
}
//##############################################################################
// calculateFitness
//##############################################################################
function calculateFitness(salesman) {
    let fitness = 0;
    let currentCity = HOME_CITY;
    for (let i = 0; i < salesman.genes.length; i++) {
        fitness += distance(currentCity, salesman.genes[i]);
        currentCity = salesman.genes[i];
    }
    fitness += distance(currentCity, HOME_CITY);
    return fitness;
}
//##############################################################################
// crossover
//##############################################################################
function crossover(parentA, parentB) {
    return parentA;
}
//##############################################################################
// mutation
//##############################################################################
function mutation(salesman) {
    for (let i = 0; i < CITIES_COUNT; i++) {
        const randomValue = Math.random();
        if (randomValue < salesman.mutationChance) {
            const randomSwapIndexA = Math.floor(Math.random() * CITIES_COUNT);
            const randomSwapIndexB = Math.floor(Math.random() * CITIES_COUNT);
            [salesman.genes[randomSwapIndexA], salesman.genes[randomSwapIndexB]] = [salesman.genes[randomSwapIndexB], salesman.genes[randomSwapIndexA]];
        }
    }
    return salesman;
}
//##############################################################################
// GA termination
//##############################################################################
function shouldTerminate(model) {
    return false;
}
//##############################################################################
// generation termination condition
//##############################################################################
function shouldProgressGeneration(model) {
    return true;
}
//##############################################################################
// step function
//##############################################################################
function stepFunction(model) {
    return;
}
//##############################################################################
// step function
//##############################################################################
let displayDiv = document.createElement("div");
displayDiv.style.display = "flex";
displayDiv.style.alignItems = "center";
displayDiv.style.flexDirection = "column";
displayDiv.style.gap = "1rem";
displayDiv.style.justifyContent = "space-evenly";
let canvas = document.createElement("canvas");
canvas.height = CANVAS_HEIGHT;
canvas.width = CANVAS_WIDTH;
canvas.style.border = "1px solid white";
canvas.style.background = "black";
function clearCanvas(cv, color = "rgb(255, 255, 255)") {
    cv.getContext("2d").fillStyle = color;
    cv.getContext("2d").fillRect(0, 0, cv.width, cv.height);
}
displayDiv.appendChild(canvas);
document.querySelector("#view").appendChild(displayDiv);
let canvasCtx = canvas.getContext("2d");
for (const city of cities) {
    canvasCtx.fillStyle = "rgb(255, 255, 255)";
    canvasCtx.fillRect(city.longitude, city.latitude, 1, 1);
}
export {};
