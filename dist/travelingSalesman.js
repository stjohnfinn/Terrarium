import { GeneticAlgorithm } from "./terrarium.js";
// "Given a list of cities and the distances between each pair of cities, what 
// is the shortest possible route that visits each city exactly once and returns 
// to the origin city?"
const CANVAS_HEIGHT = 250;
const CANVAS_WIDTH = 250;
const CITIES_COUNT = 10;
const CITY_PLACEMENT_PADDING = 30;
const MUTATION_CHANCE = 0.05;
const FRAME_DELAY = 200;
const POPULATION_SIZE = 20;
const DEBUG = false;
function calculateTotalCoords(routeCities) {
    let total = {
        longitude: 0,
        latitude: 0
    };
    for (const city of routeCities) {
        total.longitude += city.longitude;
        total.latitude += city.latitude;
    }
    return total;
}
function validateRoute(route, startingCity, routeCities) {
    const staticTotalCoords = calculateTotalCoords([startingCity, ...routeCities, startingCity]);
    const sampleTotalCoords = calculateTotalCoords(route);
    const isValid = staticTotalCoords.longitude == sampleTotalCoords.longitude && staticTotalCoords.latitude == sampleTotalCoords.latitude;
    if (!isValid) {
        throw new Error("invalid route!");
    }
}
function distance(start, end) {
    return Math.sqrt(Math.pow(start.longitude - end.longitude, 2) + Math.pow(start.latitude - end.latitude, 2));
}
function generateCity() {
    return {
        longitude: getRandomInt(0 + CITY_PLACEMENT_PADDING, CANVAS_WIDTH - CITY_PLACEMENT_PADDING),
        latitude: getRandomInt(0 + CITY_PLACEMENT_PADDING, CANVAS_HEIGHT - CITY_PLACEMENT_PADDING)
    };
}
function generateCitySet(num_cities) {
    if (num_cities < 0) {
        throw new Error("Number of cities must be non-negative.");
    }
    const cities = [];
    while (cities.length < num_cities) {
        const newCity = generateCity();
        const isDuplicate = cities.some(existingCity => newCity === existingCity);
        if (!isDuplicate) {
            cities.push(newCity);
        }
    }
    return cities;
}
const ROUTE_CITIES = generateCitySet(CITIES_COUNT);
const HOME_CITY = ROUTE_CITIES.pop();
//##############################################################################
// createOrganism
//##############################################################################
class SalesmanRouteOrganism {
    constructor(cities, mutation_chance) {
        this.mutationChance = mutation_chance;
        this.genes = [HOME_CITY];
        while (cities.length > 0) {
            const randomIndex = Math.floor(Math.random() * cities.length);
            this.genes.push(cities.splice(randomIndex, 1)[0]);
        }
        this.genes.push(HOME_CITY);
        this.currentCityIndex = 0;
        this.isFinished = false;
        validateRoute(this.genes, HOME_CITY, ROUTE_CITIES);
    }
}
function createOrganism() {
    return new SalesmanRouteOrganism(structuredClone(ROUTE_CITIES), MUTATION_CHANCE);
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
    return -fitness;
}
//##############################################################################
// crossover
//##############################################################################
function crossover(parentA, parentB) {
    const P_parentA = 1 - calculateFitness(parentA) / calculateFitness(parentA) + calculateFitness(parentB);
    let offspring = createOrganism();
    offspring.genes = Math.random() > P_parentA ? structuredClone(parentA).genes : structuredClone(parentB).genes;
    validateRoute(offspring.genes, HOME_CITY, ROUTE_CITIES);
    return offspring;
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
        validateRoute(salesman.genes, HOME_CITY, ROUTE_CITIES);
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
    return model.population.every(salesman => salesman.isFinished);
}
//##############################################################################
// step function
//##############################################################################
function stepFunction(model) {
    // travel to next city
    for (const salesman of model.population) {
        if (!salesman.isFinished) {
            salesman.currentCityIndex += 1;
            if (salesman.currentCityIndex >= salesman.genes.length) {
                salesman.currentCityIndex = salesman.genes.length - 1;
                salesman.isFinished = true;
            }
        }
    }
}
//##############################################################################
// initialize the genetic algorithm
//##############################################################################
let geneticAlgorithm = new GeneticAlgorithm(createOrganism, stepFunction, calculateFitness, crossover, mutate, shouldTerminate, shouldProgressGeneration, POPULATION_SIZE, DEBUG, FRAME_DELAY);
//##############################################################################
// display logic?
//##############################################################################
let displayDiv = document.createElement("div");
displayDiv.style.display = "flex";
displayDiv.style.alignItems = "center";
displayDiv.style.flexDirection = "column";
displayDiv.style.gap = "1rem";
displayDiv.style.justifyContent = "space-evenly";
displayDiv.style.position = "relative";
let title = document.createElement("p");
title.innerText = "Traveling salesman";
title.style.position = "absolute";
title.style.left = "0px";
title.style.top = "0px";
title.style.padding = "0.25rem";
title.style.transform = "translateY(-100%)";
title.style.fontSize = "0.75rem";
displayDiv.appendChild(title);
let canvas = document.createElement("canvas");
canvas.height = CANVAS_HEIGHT;
canvas.width = CANVAS_WIDTH;
canvas.style.border = "1px solid white";
canvas.style.background = "black";
let playButton = document.createElement("button");
playButton.innerText = "▶ play ";
playButton.addEventListener("click", () => {
    geneticAlgorithm.play();
});
let pauseButton = document.createElement("button");
pauseButton.innerText = "⏸ pause";
pauseButton.addEventListener("click", () => {
    geneticAlgorithm.pause();
});
let resetButton = document.createElement("button");
resetButton.innerText = "⟲ reset";
resetButton.addEventListener("click", () => {
    geneticAlgorithm.reset();
    console.log(geneticAlgorithm.model);
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
function drawRoute(route, ctx, lineWidth, strokeStyle, lineCap) {
    ctx.lineWidth = lineWidth;
    ctx.lineCap = lineCap;
    ctx.strokeStyle = strokeStyle;
    ctx.beginPath();
    ctx.moveTo(route[0].longitude, route[0].latitude);
    for (let i = 1; i < route.length; i++) {
        ctx.lineTo(route[i].longitude, route[i].latitude);
    }
    ctx.stroke();
}
function display(canvas, model) {
    const ctx = canvas.getContext("2d");
    clearCanvas(canvas, "rgb(0, 0, 0)");
    ctx.font = "10px Consolas";
    ctx.fillStyle = "blue";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`Average fitness: ${Math.round(model.population.reduce((sum, organism) => sum + calculateFitness(organism), 0) / model.population.length)}`, CANVAS_WIDTH / 2, 18);
    ctx.fillStyle = "rgb(255, 255, 0)";
    ctx.fillRect(HOME_CITY.longitude, HOME_CITY.latitude, 3, 3);
    for (const city of ROUTE_CITIES) {
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillRect(city.longitude, city.latitude, 1, 1);
    }
    for (const salesman of model.population) {
        drawRoute(salesman.genes.slice(0, salesman.currentCityIndex + 1), ctx, 1, 'rgba(255, 255, 255, 0.1)', 'round');
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
