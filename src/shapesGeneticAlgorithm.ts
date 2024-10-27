import { Organism, GeneticAlgorithm, GeneticAlgorithmModel } from "./terrarium.js";

const MUTATION_CHANCE: number = 0.2;
const POPULATION_SIZE: number = 30;
const FRAME_DELAY: number = 25;

const CANVAS_HEIGHT: number = 250;
const CANVAS_WIDTH: number = 250;

// Gene bounds
const MIN_RADIUS: number = 2;
const MAX_RADIUS: number = 8;
const MIN_DAMAGE: number = 1;
const MAX_DAMAGE: number = 4;
const MIN_ARMOR: number = 2;
const MAX_ARMOR: number = 10;
const MIN_COLOR: number = 0;
const MAX_COLOR: number = 255;
const BASE_HEALTH: number = 15;
const MIN_POS: Vector2d = {
  x: 20,
  y: 20
}
const MAX_POS: Vector2d = {
  x: CANVAS_WIDTH - 20,
  y: CANVAS_HEIGHT - 20
}
const MIN_VEL: Vector2d = {
  x: 1,
  y: 1
}
const MAX_VEL: Vector2d = {
  x: 4,
  y: 4
}


type Color = {
  red: number;
  green: number;
  blue: number;
}

type Vector2d = {
  x: number;
  y: number;
}

type ShapeGenes = {
  radius: number;
  area: number;
  damage: number;
  armor: number;
  color: Color;
}

class ShapeOrganism implements Organism {
  mutationChance: number;
  genes: ShapeGenes;
  isAlive: boolean;
  kills: number;
  health: number;
  velocity: Vector2d;
  position: Vector2d;

  constructor() {
    const randomRadius: number = getRandomInt(MIN_RADIUS, MAX_RADIUS);

    this.genes = {
      radius: randomRadius,
      area: Math.trunc(randomRadius * 2 * Math.PI),
      damage: getRandomInt(MIN_DAMAGE, MAX_DAMAGE),
      armor: getRandomInt(MIN_ARMOR, MAX_ARMOR),
      color: {
        red: getRandomInt(MIN_COLOR, MAX_COLOR),
        green: getRandomInt(MIN_COLOR, MAX_COLOR),
        blue: getRandomInt(MIN_COLOR, MAX_COLOR)
      }
    };
    
    this.position = {
      x: getRandomInt(MIN_POS.x, MAX_POS.x),
      y: getRandomInt(MIN_POS.y, MAX_POS.y)
    }
    this.velocity = {
      x: getRandomInt(MIN_VEL.x, MAX_VEL.x),
      y: getRandomInt(MIN_VEL.y, MAX_VEL.y)
    }
    this.mutationChance = MUTATION_CHANCE;
    this.health = BASE_HEALTH,
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

  offspring.genes.radius = randomizeWithMargin(
    getAverage(parentA.genes.radius, parentB.genes.radius),
    3
  );

  offspring.genes.area = offspring.genes.radius * 2 * Math.PI;

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
  // we need to individually perform mutation for each of the genes

  // height first
  if (Math.random() < MUTATION_CHANCE) {
    organism.genes.radius = clamp(randomizeWithMargin(organism.genes.radius, 3), 4, 20);
  }

  // damage
  if (Math.random() < MUTATION_CHANCE) {
    organism.genes.damage = clamp(randomizeWithMargin(organism.genes.damage, 1), 1, 4);
  }

  // armor
  if (Math.random() < MUTATION_CHANCE) {
    organism.genes.armor = clamp(randomizeWithMargin(organism.genes.damage, 3), 1, 10);
  }

  // color
  organism.genes.color = {
    red: Math.random() < MUTATION_CHANCE ? getRandomInt(0, 255) : organism.genes.color.red,
    green: Math.random() < MUTATION_CHANCE ? getRandomInt(0, 255) : organism.genes.color.green,
    blue: Math.random() < MUTATION_CHANCE ? getRandomInt(0, 255) : organism.genes.color.blue
  };

  return organism;
}

function shouldTerminate(model: GeneticAlgorithmModel<ShapeOrganism>): boolean {
  return false;
}

function shouldProgressGeneration(model: GeneticAlgorithmModel<ShapeOrganism>): boolean {
  let aliveCountgtOne: boolean = model.population.reduce((accumulator: number, currentValue: ShapeOrganism): number => accumulator + Number(currentValue.isAlive), 0) <= 1;

  return aliveCountgtOne;
}

let view: HTMLDivElement = document.createElement("div");
view.style.display = "flex";
view.style.alignItems = "center";
view.style.flexDirection = "column";
view.style.gap = "1rem";
view.style.justifyContent = "space-evenly";

let canvas: HTMLCanvasElement = document.createElement("canvas");
canvas.height = CANVAS_HEIGHT;
canvas.width = CANVAS_WIDTH;
canvas.style.border = "1px dashed lightblue";

function clearCanvas(cv: HTMLCanvasElement, color: string = "rgb(255, 255, 255)") {
  cv.getContext("2d").fillStyle = color;
  cv.getContext("2d").fillRect(0, 0, cv.width, cv.height);
}

/**
 * REAL MEAT OF THIS ALL
 * 
 * this is all of the really important stuff
 */

function keepShapeInbounds(shape: ShapeOrganism, xMax: number, yMax: number, xMin: number = 0, yMin: number = 0): void {

  // check top side
  if (shape.position.y < yMin + shape.genes.radius) {
    shape.position.y = yMin + shape.genes.radius;
    shape.velocity.y = -shape.velocity.y;
  }
  
  // check left side
  if (shape.position.x < xMin + shape.genes.radius) {
    shape.position.x = xMin + shape.genes.radius;
    shape.velocity.x = -shape.velocity.x;
  }
  
  // check bottom side
  if (shape.position.y > yMax - shape.genes.radius) {
    shape.position.y = yMax - shape.genes.radius;
    shape.velocity.y = -shape.velocity.y;
  }

  // check right side
  if (shape.position.x > xMax - shape.genes.radius) {
    shape.position.x = xMax - shape.genes.radius;
    shape.velocity.x = -shape.velocity.x;
  }

  return;
}

async function stepFunction(model: GeneticAlgorithmModel<ShapeOrganism>): Promise<GeneticAlgorithmModel<ShapeOrganism>> {

  for (let i = 0; i < model.population.length; i++) {
    model.population[i].position.x += model.population[i].velocity.x;
    model.population[i].position.y += model.population[i].velocity.y;

    keepShapeInbounds(model.population[i], CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  return;
}

let geneticAlgorithm: GeneticAlgorithm<ShapeOrganism> = new GeneticAlgorithm(
  createOrganism,
  stepFunction,
  calculateFitness,
  crossover,
  mutate,
  shouldTerminate,
  shouldProgressGeneration,
  POPULATION_SIZE,
  false,
  FRAME_DELAY
);

/**
 * View logic is here baby!!!
 */

function display(canvas: HTMLCanvasElement, model: GeneticAlgorithmModel<ShapeOrganism>) {
  const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
  const OPACITY = 0.2;

  clearCanvas(canvas);

  for (const organism of model.population) {
    ctx.beginPath();
    ctx.fillStyle = `rgba(${organism.genes.color.red}, ${organism.genes.color.green}, ${organism.genes.color.blue}, ${OPACITY})`
    ctx.arc(organism.position.x, organism.position.y, organism.genes.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }
};

function gameLoop(model: GeneticAlgorithmModel<ShapeOrganism>): void {
  display(canvas, model);
  requestAnimationFrame(() => {
    gameLoop(geneticAlgorithm.model);
  });
}

gameLoop(geneticAlgorithm.model);

/**
 * CONTROLS here!
 */
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

view.appendChild(controls);
view.appendChild(canvas);
document.querySelector("#view").appendChild(view);
