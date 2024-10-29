import { Organism, GeneticAlgorithm, GeneticAlgorithmModel } from "./terrarium.js";

// "Given a list of cities and the distances between each pair of cities, what 
// is the shortest possible route that visits each city exactly once and returns 
// to the origin city?"

const CANVAS_HEIGHT: number = 250;
const CANVAS_WIDTH: number = 250;

const CITIES_COUNT: number = 40;
const CITY_PLACEMENT_PADDING: number = 10;

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

  constructor(cities: Location[]) {
    // select N random cities, where N is a random number between 1 + 1 + 1 and CITIES_COUNT
    this.genes = [];

    let tempCitiesCopy: Location[] = [...cities];
    while (tempCitiesCopy.length > 0) {
      const randomIndex: number = Math.floor(Math.random() * tempCitiesCopy.length);

      this.genes.push(tempCitiesCopy.splice(randomIndex, 1)[0]);
    }
  }
}

function createOrganism(): SalesmanRouteOrganism {
  return new SalesmanRouteOrganism(structuredClone(cities))
}

//##############################################################################
// calculateFitness
//##############################################################################

function calculateFitness(salesman: SalesmanRouteOrganism): number {
  let fitness: number = 0;

  let currentCity: Location = HOME_CITY;
  for (let i = 0; i < salesman.genes.length; i++) {
    // fitness += 
  }
  fitness += distance(currentCity, HOME_CITY);

  return fitness;
}

console.log(createOrganism());