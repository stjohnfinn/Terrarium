import { Organism, GeneticAlgorithm, GeneticAlgorithmModel } from "./terrarium.js";

const MUTATION_CHANCE: number = 0.2;
const POPULATION_SIZE: number = 30;
const FRAME_DELAY: number = 0;

const CANVAS_HEIGHT: number = 250;
const CANVAS_WIDTH: number = 250;

const NUM_HOUSES: number = 10;

// data types for everything

type Position = {
  x: number,
  y: number
}

interface Structure {
  position: Position
}

class PowerPlant implements Structure {
  position: Position

  constructor(x: number, y: number) {
    this.position.x = x;
    this.position.y = y;
  }
}

// generate the initial layout

// one single power plant

const CENTRAL_POWER_PLANT = new PowerPlant(getRandomInt(0, CANVAS_WIDTH), getRandomInt(0, CANVAS_HEIGHT));

// generate a few houses with different locations
