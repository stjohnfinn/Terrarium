import { Organism, GeneticAlgorithm, GeneticAlgorithmModel } from "./terrarium.js";

const MUTATION_CHANCE: number = 0.08;
const POPULATION_SIZE: number = 12;
const FRAME_DELAY: number = 40;

const CANVAS_HEIGHT: number = 250;
const CANVAS_WIDTH: number = 250;

// Survivor parameters
const NUM_ACTIONS: number = 300;
const MAX_HEALTH: number = 100;
const MAX_ENERGY: number = 100;
const MAX_HYDRATION: number = 100;
const RANDOM_POSITION_PADDING: number = CANVAS_HEIGHT * 0.05;

type Action = string;

const VALID_ACTIONS: Action[] = [
  "walkUp",
  "walkDown",
  "walkLeft",
  "walkRight",

  "attackUp",
  "attackDown",
  "attackLeft",
  "attackRight",
  "eat",
  "drink"
]

function randomValidAction() {
  return VALID_ACTIONS[getRandomInt(0, VALID_ACTIONS.length - 1)];
}

type SurvivorGenes = {
  actions: Action[]
}

class Position {
  private x: number;
  private y: number;

  readonly minX: number;
  readonly maxX: number;
  readonly minY: number;
  readonly maxY: number;

  constructor(x: number, y: number, minX: number, maxX: number, minY: number, maxY: number) {
    this.x = x;
    this.y = y;

    this.minX = minX;
    this.maxX = maxX;
    this.minY = minY;
    this.maxY = maxY;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  setX(value: number) {
    if (value < this.minX) {
      value = this.minX;
    }

    if (value > this.maxX) {
      value = this.maxX;
    }

    this.x = value;
  }

  setY(value: number) {
    if (value < this.minY) {
      value = this.minY;
    }

    if (value > this.maxY) {
      value = this.maxY;
    }

    this.y = value;
  }
}

class SurvivorOrganism implements Organism {
  genes: SurvivorGenes;
  mutationChance: number;

  currentHealth: number;
  currentEnergy: number;
  currentHydration: number;

  isAlive: boolean;
  position: Position;

  currentActionIndex: number;

  constructor() {
    this.genes.actions = [];
    
    for (let i = 0; i < NUM_ACTIONS; i++) {
      this.genes.actions.push(randomValidAction());
    }

    this.currentEnergy = MAX_ENERGY;
    this.currentHealth = MAX_HEALTH;
    this.currentHydration = MAX_HYDRATION;
    this.isAlive = true;
    this.mutationChance = MUTATION_CHANCE;
    this.position = new Position(
      getRandomInt(0 + RANDOM_POSITION_PADDING, CANVAS_WIDTH - RANDOM_POSITION_PADDING),
      getRandomInt(0 + RANDOM_POSITION_PADDING, CANVAS_HEIGHT - RANDOM_POSITION_PADDING),
      0,
      CANVAS_WIDTH,
      0,
      CANVAS_HEIGHT
    );
    this.currentActionIndex = 0;
  }

  setPosition(x: number, y: number) {
    this.position.setX(x);
    this.position.setY(y);
  }
}

function createOrganism(): SurvivorOrganism {
  return new SurvivorOrganism();
}

function calculateFitness(organism: SurvivorOrganism): number {
  let fitness: number = 0;

  fitness += organism.currentEnergy;
  fitness += organism.currentHealth;
  fitness += organism.currentHydration;

  return organism.isAlive ? fitness : 0;
}

function stepFunction(model: GeneticAlgorithmModel<SurvivorOrganism>): void {

  // iterate over every organism and perform the current action
  for (const survivor of model.population) {
    switch (survivor.genes.actions[survivor.currentActionIndex]) {
      case "walkUp":
        survivor.setPosition(survivor.position.getX(), survivor.position.getY() - 1);
        break;
      case "walkDown":
        survivor.setPosition(survivor.position.getX(), survivor.position.getY() + 1);
        break;
      case "walkLeft":
        survivor.setPosition(survivor.position.getX() - 1, survivor.position.getY());
        break;
      case "walkRight":
        survivor.setPosition(survivor.position.getX() + 1, survivor.position.getY());
        break;
      
    
      default:
        throw new Error("Undefined action encountered in organism's genes.");
        break;
    }
  }

  // check for death conditions
}

function crossover(parentA: SurvivorOrganism, parentB: SurvivorOrganism): SurvivorOrganism {
  // regular crossover, nothing special
  let offspring = new SurvivorOrganism();
  
  for (let i = 0; i < offspring.genes.actions.length; i++) {
    if (Math.random() > 0.5) {

    }
  }

  return offspring;
}