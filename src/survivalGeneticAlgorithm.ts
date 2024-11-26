import { Organism, GeneticAlgorithm, GeneticAlgorithmModel } from "./terrarium.js";

const MUTATION_CHANCE: number = 0.08;
const POPULATION_SIZE: number = 12;
const FRAME_DELAY: number = 10;

const CANVAS_HEIGHT: number = 250;
const CANVAS_WIDTH: number = 250;

// Survivor parameters
const NUM_ACTIONS: number = 300;
const MAX_HEALTH: number = 100;
const MAX_ENERGY: number = 100;
const MAX_HYDRATION: number = 100;
const RANDOM_POSITION_PADDING: number = CANVAS_HEIGHT * 0.05;
const POSITION_STEP: number = 5;

enum Item {
  water,
  food
}

enum Action {
  walkUp,
  walkDown,
  walkLeft,
  walkRight,

  attackUp,
  attackDown,
  attackLeft,
  attackRight,

  eat,
  drink
}

function randomValidAction(): Action {
  const FIRST_ACTION = Action.walkUp;
  const LAST_ACTION = Action.drink;

  return getRandomInt(FIRST_ACTION, LAST_ACTION);
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
  kills: number;

  currentActionIndex: number;
  private inventory: Item[];

  constructor() {
    this.genes = {
      actions: []
    };
    
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
    this.inventory = [];
  }

  setPosition(x: number, y: number) {
    this.position.setX(x);
    this.position.setY(y);
  }

  hasFood(): boolean {
    for (const item of this.inventory) {
      if (item == Item.food) {
        return true;
      }
    }
  }
  
  hasWater(): boolean {
    for (const item of this.inventory) {
      if (item == Item.water) {
        return true;
      }
    }
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
  fitness *= organism.kills;

  return organism.isAlive ? fitness : 0;
}

function stepFunction(model: GeneticAlgorithmModel<SurvivorOrganism>): void {

  // iterate over every organism and perform the current action
  for (const survivor of model.population) {
    if (survivor.currentActionIndex >= survivor.genes.actions.length) {
      continue;
    }

    switch (survivor.genes.actions[survivor.currentActionIndex]) {
      case Action.walkUp:
        survivor.setPosition(survivor.position.getX(), survivor.position.getY() - POSITION_STEP);
        break;
      case Action.walkDown:
        survivor.setPosition(survivor.position.getX(), survivor.position.getY() + POSITION_STEP);
        break;
      case Action.walkLeft:
        survivor.setPosition(survivor.position.getX() - POSITION_STEP, survivor.position.getY());
        break;
      case Action.walkRight:
        survivor.setPosition(survivor.position.getX() + POSITION_STEP, survivor.position.getY());
        break;
      case Action.attackUp:
        // search above the organism for others nearby and attack
        break;
      case Action.attackDown:
        // search above the organism for others nearby and attack
        break;
      case Action.attackLeft:
        // search above the organism for others nearby and attack
        break;
      case Action.attackRight:
        // search above the organism for others nearby and attack
        break;
      case Action.eat:
        // if the survivor has food, eat it and increase their health
        // and then remove the food from their inventory
        survivor.currentEnergy += Math.round(MAX_ENERGY / 5);
        if (survivor.currentEnergy > MAX_ENERGY) {
          survivor.currentEnergy = MAX_ENERGY;
        }
        break;
      case Action.drink:
        // if the survivor has water, eat it and increase hydration
        // and then remove the water from their inventory
        survivor.currentHydration += Math.round(MAX_HYDRATION / 5);
        if (survivor.currentHydration > MAX_HYDRATION) {
          survivor.currentHydration = MAX_HYDRATION;
        }
        break;
      default:
        console.log(survivor.genes.actions);
        console.log(`bad gene in question: ${survivor.genes.actions[survivor.currentActionIndex]}`);
        throw new Error("Undefined action encountered in organism's genes.");
        break;
    }

    // increment the index now
    survivor.currentActionIndex += 1;
  }

  // check for death conditions
}

function crossover(parentA: SurvivorOrganism, parentB: SurvivorOrganism): SurvivorOrganism {
  // regular crossover, nothing special
  let offspring = new SurvivorOrganism();
  
  for (let i = 0; i < offspring.genes.actions.length; i++) {
    if (Math.random() > 0.5) {
      offspring.genes.actions[i] = parentA.genes.actions[i]
    } else {
      offspring.genes.actions[i] = parentB.genes.actions[i]
    }
  }

  return offspring;
}

function mutate(organism: SurvivorOrganism): SurvivorOrganism {
  for (let i: number = 0; i < organism.genes.actions.length; i++) {
    const shouldMutateThisGene = Math.random() < organism.mutationChance;

    if (shouldMutateThisGene) {
      organism.genes.actions[i] = randomValidAction();
    }
  }

  return organism;
}

function shouldTerminate(model: GeneticAlgorithmModel<SurvivorOrganism>): boolean {
  return false;
}

function shouldProgressGeneration(model: GeneticAlgorithmModel<SurvivorOrganism>): boolean {
  return model.population.every(survivor => survivor.currentActionIndex >= survivor.genes.actions.length);
}

let geneticAlgorithm = new GeneticAlgorithm(
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

/*******************************************************************************
 * Display logic
 */

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
displayDiv.style.position = "relative";

let title: HTMLParagraphElement = document.createElement("p");
title.innerText = "Survival";
title.style.position = "absolute";
title.style.left = "0px";
title.style.top = "0px";
title.style.padding = "0.25rem";
title.style.transform = "translateY(-100%)";
title.style.fontSize = "0.75rem";
displayDiv.appendChild(title);

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
  console.log(geneticAlgorithm.model);
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

function display(canvas: HTMLCanvasElement, model: GeneticAlgorithmModel<SurvivorOrganism>) {
  const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
  clearCanvas(canvas, "rgb(0, 0, 0)");

  ctx.fillStyle = "rgb(255, 255, 0)";
  for (const organism of model.population) {
    ctx.fillStyle = "rgb(255, 255, 0)";
    ctx.fillRect(organism.position.getX(), organism.position.getY(), 5, 5);
    
    switch(organism.genes.actions[organism.currentActionIndex]) {
      case Action.attackUp:
        ctx.fillStyle = "rgba(255, 0, 0, 0.25)";
        ctx.fillRect(organism.position.getX() - 2.5, organism.position.getY() - 10, 10, 10);
        break;
      case Action.attackDown:
        ctx.fillStyle = "rgba(255, 0, 0, 0.25)";
        ctx.fillRect(organism.position.getX() - 2.5, organism.position.getY() + 5, 10, 10);
        break;
      case Action.attackLeft:
        ctx.fillStyle = "rgba(255, 0, 0, 0.25)";
        ctx.fillRect(organism.position.getX() - 10, organism.position.getY() - 2.5, 10, 10);
        break;
      case Action.attackRight:
        ctx.fillStyle = "rgba(255, 0, 0, 0.25)";
        ctx.fillRect(organism.position.getX() + 5, organism.position.getY() - 2.5, 10, 10);
        break;
      case Action.drink:
        ctx.fillStyle = `rgb(0, 0, 0)`;
        if (organism.hasFood()) {
          ctx.fillText("💧", organism.position.getX(), organism.position.getY());
        }
      case Action.eat:
        ctx.fillStyle = `rgb(0, 0, 0)`;
        if (organism.hasWater()) {
          ctx.fillText("🥩", organism.position.getX(), organism.position.getY());
        }
      case Action.walkUp:
      case Action.walkDown:
      case Action.walkLeft:
      case Action.walkRight:
        break;
      default:
        console.log(`bad gene in question: ${organism.genes.actions[organism.currentActionIndex]}`);
        throw new Error("Undefined action encountered in organism's genes.");
        break;
    }
  }
};

function gameLoop(model: GeneticAlgorithmModel<SurvivorOrganism>): void {
  display(canvas, model);
  requestAnimationFrame(() => {
    gameLoop(geneticAlgorithm.model);
  });
}

gameLoop(geneticAlgorithm.model);
