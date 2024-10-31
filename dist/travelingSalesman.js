import { GeneticAlgorithm } from "./terrarium.js";
// "Given a list of cities and the distances between each pair of cities, what 
// is the shortest possible route that visits each city exactly once and returns 
// to the origin city?"
const CANVAS_HEIGHT = 250;
const CANVAS_WIDTH = 250;
const CITIES_COUNT = 40;
const CITY_PLACEMENT_PADDING = 10;
const MUTATION_CHANCE = 0.02;
const HOME_CITY_INDEX = -1;
const FRAME_DELAY = 500;
const POPULATION_SIZE = 25;
const DEBUG = true;
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
        this.genes = [];
        let tempCitiesCopy = [...cities];
        while (tempCitiesCopy.length > 0) {
            const randomIndex = Math.floor(Math.random() * tempCitiesCopy.length);
            this.genes.push(tempCitiesCopy.splice(randomIndex, 1)[0]);
        }
        this.currentCityIndex = HOME_CITY_INDEX;
        this.previousCity = HOME_CITY;
        this.isFinished = false;
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
function mutate(salesman) {
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
    // progress generation if all salesmen have finished their route
    let anyUnfinishedRoutes = false;
    for (const salesman of model.population) {
        if (!salesman.isFinished) {
            anyUnfinishedRoutes = true;
        }
    }
    return anyUnfinishedRoutes;
}
//##############################################################################
// step function
//##############################################################################
function stepFunction(model) {
    for (let i = 0; i < model.population.length; i++) {
        let salesman = model.population[i];
        if (salesman.currentCityIndex >= salesman.genes.length) {
            salesman.isFinished = true;
        }
        if (salesman.isFinished) {
            continue;
        }
        if (salesman.currentCityIndex == 0) {
            salesman.previousCity = HOME_CITY;
        }
        else {
            salesman.previousCity = salesman.genes[salesman.currentCityIndex - 1];
        }
        salesman.currentCityIndex += 1;
    }
    return;
}
//##############################################################################
// initialize the genetic algorithm
//##############################################################################
let geneticAlgorithm = new GeneticAlgorithm(createOrganism, stepFunction, calculateFitness, crossover, mutate, shouldTerminate, shouldProgressGeneration, POPULATION_SIZE, DEBUG, FRAME_DELAY);
//##############################################################################
// display logic?
//##############################################################################
function clearCanvas(cv, color = "rgb(255, 255, 255)") {
    cv.getContext("2d").fillStyle = color;
    cv.getContext("2d").fillRect(0, 0, cv.width, cv.height);
}
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
let playButton = document.createElement("button");
document.querySelector("body").appendChild(playButton);
playButton.innerText = "▶ play ";
playButton.addEventListener("click", () => {
    geneticAlgorithm.play();
});
let pauseButton = document.createElement("button");
document.querySelector("body").appendChild(pauseButton);
pauseButton.innerText = "⏸ pause";
pauseButton.addEventListener("click", () => {
    geneticAlgorithm.pause();
});
let resetButton = document.createElement("button");
document.querySelector("body").appendChild(resetButton);
resetButton.innerText = "⟲ reset";
resetButton.addEventListener("click", () => {
    geneticAlgorithm.reset();
});
let controls = document.createElement("div");
controls.appendChild(playButton);
controls.appendChild(pauseButton);
controls.appendChild(resetButton);
controls.style.display = "flex";
controls.style.flexDirection = "row";
controls.style.alignItems = "flex-start";
controls.style.justifyContent = "space-evenly";
controls.style.width = "100%";
displayDiv.appendChild(canvas);
displayDiv.appendChild(controls);
document.querySelector("#view").appendChild(displayDiv);
function display(canvas, model) {
    const ctx = canvas.getContext("2d");
    clearCanvas(canvas, "rgb(0, 0, 0)");
    for (const city of cities) {
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillRect(city.longitude, city.latitude, 1, 1);
    }
    for (const salesman of model.population) {
        ctx.fillStyle = "rgb(0, 255, 0)";
        if (salesman.currentCityIndex == HOME_CITY_INDEX) {
            ctx.fillRect(HOME_CITY.longitude, HOME_CITY.latitude, 1, 1);
            continue;
        }
        if (salesman.isFinished) {
            ctx.fillRect(HOME_CITY.longitude, HOME_CITY.latitude, 1, 1);
        }
        ctx.fillRect(salesman.genes[salesman.currentCityIndex].longitude, salesman.genes[salesman.currentCityIndex].latitude, 1, 1);
    }
}
;
function gameLoop(model) {
    display(canvas, model);
    requestAnimationFrame(() => {
        gameLoop(geneticAlgorithm.model);
    });
}
gameLoop(geneticAlgorithm.model);
