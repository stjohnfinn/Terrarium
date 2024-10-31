import { Organism, GeneticAlgorithm, GeneticAlgorithmModel } from "./terrarium.js";

// "Given a list of cities and the distances between each pair of cities, what 
// is the shortest possible route that visits each city exactly once and returns 
// to the origin city?"

const CANVAS_HEIGHT: number = 250;
const CANVAS_WIDTH: number = 250;

const CITIES_COUNT: number = 40;
const CITY_PLACEMENT_PADDING: number = 10;
const MUTATION_CHANCE: number = 0.02;

const HOME_CITY_INDEX = -1;

const FRAME_DELAY: number = 500;
const POPULATION_SIZE: number = 25;
const DEBUG: boolean = true;

type Location = {
  longitude: number,
  latitude: number
}

function distance(start: Location, end: Location): number {
  return Math.sqrt(Math.pow(start.longitude - end.longitude, 2) + Math.pow(start.latitude - end.latitude, 2));
}

function generateCity(): Location {
  return {
    longitude: getRandomInt(0 + CITY_PLACEMENT_PADDING, CANVAS_WIDTH - CITY_PLACEMENT_PADDING),
    latitude: getRandomInt(0 + CITY_PLACEMENT_PADDING, CANVAS_HEIGHT - CITY_PLACEMENT_PADDING)
  };
}

function findDuplicate(cities: Location[]): number {
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
let duplicateIndex: number = findDuplicate(cities);
while (duplicateIndex > -1) {
  cities[duplicateIndex] = generateCity();
  duplicateIndex = findDuplicate(cities);
}

const HOME_CITY: Location = cities.pop();

//##############################################################################
// createOrganism
//##############################################################################

class SalesmanRouteOrganism implements Organism {
  mutationChance: number;
  genes: Location[];
  currentCityIndex: number;
  previousCity: Location;
  isFinished: boolean;

  constructor(cities: Location[], mutation_chance: number) {
    this.mutationChance = mutation_chance;
    this.genes = [];

    let tempCitiesCopy: Location[] = [...cities];
    while (tempCitiesCopy.length > 0) {
      const randomIndex: number = Math.floor(Math.random() * tempCitiesCopy.length);

      this.genes.push(tempCitiesCopy.splice(randomIndex, 1)[0]);
    }

    this.currentCityIndex = HOME_CITY_INDEX;
    this.previousCity = HOME_CITY;
    this.isFinished = false;
  }
}

function createOrganism(): SalesmanRouteOrganism {
  return new SalesmanRouteOrganism(structuredClone(cities), MUTATION_CHANCE);
}

//##############################################################################
// calculateFitness
//##############################################################################

function calculateFitness(salesman: SalesmanRouteOrganism): number {
  let fitness: number = 0;
  
  let currentCity: Location = HOME_CITY;
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

function crossover(parentA: SalesmanRouteOrganism, parentB: SalesmanRouteOrganism): SalesmanRouteOrganism {
  return parentA;
}

//##############################################################################
// mutation
//##############################################################################

function mutate(salesman: SalesmanRouteOrganism): SalesmanRouteOrganism {
  
  for (let i = 0; i < CITIES_COUNT; i++) {
    const randomValue: number = Math.random();
    
    if (randomValue < salesman.mutationChance) {
      const randomSwapIndexA: number = Math.floor(Math.random() * CITIES_COUNT);
      const randomSwapIndexB: number = Math.floor(Math.random() * CITIES_COUNT);
      
      [salesman.genes[randomSwapIndexA], salesman.genes[randomSwapIndexB]] = [salesman.genes[randomSwapIndexB], salesman.genes[randomSwapIndexA]];
    }
  }
  
  return salesman;
}

//##############################################################################
// GA termination
//##############################################################################

function shouldTerminate(model: GeneticAlgorithmModel<SalesmanRouteOrganism>): boolean {
  return false;
}

//##############################################################################
// generation termination condition
//##############################################################################

function shouldProgressGeneration(model: GeneticAlgorithmModel<SalesmanRouteOrganism>): boolean {
  // progress generation if all salesmen have finished their route
  let anyUnfinishedRoutes: boolean = false;

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

function stepFunction(model: GeneticAlgorithmModel<SalesmanRouteOrganism>): void {
  
  for (let i: number = 0; i < model.population.length; i++) {
    let salesman: SalesmanRouteOrganism = model.population[i];
    
    if (salesman.currentCityIndex >= salesman.genes.length) {
      salesman.isFinished = true;
    }

    if (salesman.isFinished) {
      continue;
    }

    if (salesman.currentCityIndex == 0) {
      salesman.previousCity = HOME_CITY;
    } else {
      salesman.previousCity = salesman.genes[salesman.currentCityIndex - 1];
    }
    
    salesman.currentCityIndex += 1;
  }

  return;
}

//##############################################################################
// initialize the genetic algorithm
//##############################################################################

let geneticAlgorithm = new GeneticAlgorithm(
  createOrganism,
  stepFunction,
  calculateFitness,
  crossover,
  mutate,
  shouldTerminate,
  shouldProgressGeneration,
  POPULATION_SIZE,
  DEBUG,
  FRAME_DELAY
)

//##############################################################################
// display logic?
//##############################################################################

function clearCanvas(cv: HTMLCanvasElement, color: string = "rgb(255, 255, 255)") {
  cv.getContext("2d").fillStyle = color;
  cv.getContext("2d").fillRect(0, 0, cv.width, cv.height);
}

let displayDiv: HTMLDivElement = document.createElement("div");
displayDiv.style.display = "flex";
displayDiv.style.alignItems = "center";
displayDiv.style.flexDirection = "column";
displayDiv.style.gap = "1rem";
displayDiv.style.justifyContent = "space-evenly";

let canvas: HTMLCanvasElement = document.createElement("canvas");
canvas.height = CANVAS_HEIGHT;
canvas.width = CANVAS_WIDTH;
canvas.style.border = "1px solid white";
canvas.style.background = "black";

let playButton: HTMLButtonElement = document.createElement("button");
document.querySelector("body").appendChild(playButton);
playButton.innerText = "▶ play ";
playButton.addEventListener("click", () => {
  geneticAlgorithm.play();
})

let pauseButton: HTMLButtonElement = document.createElement("button");
document.querySelector("body").appendChild(pauseButton);
pauseButton.innerText = "⏸ pause";
pauseButton.addEventListener("click", () => {
  geneticAlgorithm.pause();
});

let resetButton: HTMLButtonElement = document.createElement("button");
document.querySelector("body").appendChild(resetButton);
resetButton.innerText = "⟲ reset";
resetButton.addEventListener("click", () => {
  geneticAlgorithm.reset();
});

let controls: HTMLDivElement = document.createElement("div");
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

function display(canvas: HTMLCanvasElement, model: GeneticAlgorithmModel<SalesmanRouteOrganism>) {
  const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
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
};

function gameLoop(model: GeneticAlgorithmModel<SalesmanRouteOrganism>): void {
  display(canvas, model);
  requestAnimationFrame(() => {
    gameLoop(geneticAlgorithm.model);
  });
}

gameLoop(geneticAlgorithm.model);
