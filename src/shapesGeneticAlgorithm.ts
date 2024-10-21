import { Organism, GeneticAlgorithm, GeneticAlgorithmModel } from "./terrarium.js";

const MUTATION_CHANCE = 0.2;

type Color = {
  red: number;
  green: number;
  blue: number;
}

type Position = {
  x: number;
  y: number;
}

type ShapeGenes = {
  height: number;
  width: number;
  area: number;
  damage: number;
  armor: number;
  color: Color;
  position: Position;
}

class ShapeOrganism implements Organism {
  mutationChance: number;
  genes: ShapeGenes;
  isAlive: boolean;
  kills: number;
  health: number;

  constructor() {
    const randomHeight: number = getRandomInt(4, 20);
    const randomWidth: number = getRandomInt(4, 20);

    this.genes = {
      height: randomHeight,
      width: randomWidth,
      area: randomHeight * randomWidth,
      damage: getRandomInt(1, 4),
      armor: getRandomInt(2, 10),
      color: {
        red: getRandomInt(0, 255),
        green: getRandomInt(0, 255),
        blue: getRandomInt(0, 255)
      },
      position: {
        x: 0,
        y: 0
      },
    };
    
    this.mutationChance = MUTATION_CHANCE;
    this.health = 15,
    this.isAlive = true;
    this.kills = 0;
  }
}

function createOrganism(): ShapeOrganism {
  return new ShapeOrganism();
}

function calculateFitness(organism: ShapeOrganism): number {
  let fitness: number = 0;

  fitness += organism.kills;

  return fitness;
}

function crossover(parentA: ShapeOrganism, parentB: ShapeOrganism): ShapeOrganism {
  let offspring: ShapeOrganism = new ShapeOrganism();

  offspring.genes.height = randomizeWithMargin(
    getAverage(parentA.genes.height, parentB.genes.height),
    3
  );

  offspring.genes.width = randomizeWithMargin(
    getAverage(parentA.genes.width, parentB.genes.width),
    3
  );

  offspring.genes.area = offspring.genes.height * offspring.genes.width;

  offspring.genes.damage = getRandomInt(parentA.genes.damage, parentB.genes.damage);

  offspring.genes.armor = getRandomInt(parentA.genes.armor, parentB.genes.armor);

  offspring.genes.color = {
    red: randomizeWithMargin(getRandomInt(parentA.genes.color.red, parentA.genes.color.red), 30),
    green: randomizeWithMargin(getRandomInt(parentA.genes.color.green, parentA.genes.color.green), 30),
    blue: randomizeWithMargin(getRandomInt(parentA.genes.color.blue, parentA.genes.color.blue), 30),
  }

  return offspring;
}

function mutate(organism: ShapeOrganism): ShapeOrganism {
  let mutatedOrganism: ShapeOrganism = structuredClone(organism);

  // we need to individually perform mutation for each of the genes

  // height first
  if (Math.random() < MUTATION_CHANCE) {
    mutatedOrganism.genes.height = clamp(randomizeWithMargin(mutatedOrganism.genes.height, 3), 4, 20);
  }

  // width next
  if (Math.random() < MUTATION_CHANCE) {
    mutatedOrganism.genes.width = clamp(randomizeWithMargin(mutatedOrganism.genes.width, 3), 4, 20);
  }

  // damage
  if (Math.random() < MUTATION_CHANCE) {
    mutatedOrganism.genes.damage = clamp(randomizeWithMargin(mutatedOrganism.genes.damage, 1), 1, 4);
  }

  // armor
  if (Math.random() < MUTATION_CHANCE) {
    mutatedOrganism.genes.armor = clamp(randomizeWithMargin(mutatedOrganism.genes.damage, 3), 1, 10);
  }

  // color
  mutatedOrganism.genes.color = {
    red: Math.random() < MUTATION_CHANCE ? getRandomInt(0, 255) : mutatedOrganism.genes.color.red,
    green: Math.random() < MUTATION_CHANCE ? getRandomInt(0, 255) : mutatedOrganism.genes.color.green,
    blue: Math.random() < MUTATION_CHANCE ? getRandomInt(0, 255) : mutatedOrganism.genes.color.blue
  };

  return mutatedOrganism;
}

function shouldTerminate(model: GeneticAlgorithmModel): boolean {
  return false;
}

function shouldProgressGeneration(model: GeneticAlgorithmModel): boolean {
  let aliveCountgtOne: boolean = model.population.reduce((accumulator: number, currentValue: ShapeOrganism): number => accumulator + Number(currentValue.isAlive), 0) <= 1;

  return aliveCountgtOne;
}

function stepFunction(model: GeneticAlgorithmModel): GeneticAlgorithmModel {
  let newModel: GeneticAlgorithmModel = structuredClone(model);

  return newModel;
}