import { Organism, GeneticAlgorithm, GeneticAlgorithmModel } from "./terrarium.js";

const MUTATION_CHANCE: number = 0.2;
const POPULATION_SIZE: number = 3;
const FRAME_DELAY: number = 500;

const CANVAS_HEIGHT: number = 250;
const CANVAS_WIDTH: number = 250;

const canvas: HTMLCanvasElement = document.createElement("canvas");
canvas.height = CANVAS_HEIGHT;
canvas.width = CANVAS_WIDTH;

const BEST_CANVAS_HEIGHT: number = 50;
const BEST_CANVAS_WIDTH: number = CANVAS_WIDTH;

const bestCanvas: HTMLCanvasElement = document.createElement("canvas");
bestCanvas.height = BEST_CANVAS_HEIGHT;
bestCanvas.width = BEST_CANVAS_WIDTH;

//##############################################################################
// hyperparamters
//##############################################################################

const WEIGHT_CAPACITY: number = 400;
const MIN_WEIGHT: number = 50;
const MAX_WEIGHT: number = 100;
const MIN_VALUE: number = 10;
const MAX_VALUE: number = 40;
const MIN_SIZE: number = 5;
const MAX_SIZE: number = 20;

const NUM_ITEMS: number = 15;

enum Shape {
  Triangle,
  Circle,
  Square
}

type Color = {
  red: number,
  green: number,
  blue: number,
}

class Item {
  shape: Shape;
  weight: number;
  value: number;
  color: Color;

  constructor(shape: Shape, weight: number, value: number, color: Color) {
    this.shape = shape;
    this.weight = weight;
    this.value = value;
    this.color = color;
  }

  draw(canvas: HTMLCanvasElement, x: number, y: number) {
    const ctx = canvas.getContext("2d");
    const scaledSize: number = MIN_SIZE  + (this.weight - MIN_WEIGHT) * (MAX_SIZE - MIN_SIZE) / (MAX_WEIGHT - MIN_WEIGHT);

    ctx.fillStyle = `rgba(${this.color.red}, ${this.color.green}, ${this.color.blue}, 0.25)`;
    
    ctx.beginPath();

    switch (this.shape) {
      case Shape.Triangle:
        // draw a triangle at x and y
        ctx.moveTo(x, y - (scaledSize / 2));
        ctx.lineTo(x - (scaledSize / 2), y + (scaledSize / 2));
        ctx.lineTo(x + (scaledSize / 2), y + (scaledSize / 2));
        break;
      case Shape.Circle:
        // draw a circle at x and y
        ctx.ellipse(x, y, (scaledSize / 2), (scaledSize / 2), 0, 0, Math.PI * 2);
        break;
      case Shape.Square:
        // draw a squer at x and y
        ctx.rect(x - (scaledSize / 2), y - (scaledSize / 2), scaledSize, scaledSize);
        break;
      default:
        console.error("Invalid shape.");
        break;
    }

    ctx.closePath();
    ctx.fill();
    ctx.beginPath();

    ctx.fillStyle = "black";
    ctx.font = "8px Sans";
    ctx.textAlign = "center";
    ctx.fillText(`${this.value}`, x, y + 5);
  }
}

function getRandomItem() {
  return new Item(
    getRandomInt(0, Shape.Square),
    getRandomInt(MIN_WEIGHT, MAX_WEIGHT),
    getRandomInt(MIN_VALUE, MAX_VALUE),
    {
      red: getRandomInt(0, 255),
      green: getRandomInt(0, 255),
      blue: getRandomInt(0, 255),
    }
  );
}

function clearCanvas(cv: HTMLCanvasElement, color: string = "rgb(255, 255, 255)") {
  cv.getContext("2d").fillStyle = color;
  cv.getContext("2d").fillRect(0, 0, cv.width, cv.height);
}

// create available items

let AVAILABLE_ITEMS: Item[] = [];

for (let i = 0; i < NUM_ITEMS; i++) {
  AVAILABLE_ITEMS.push(getRandomItem());
}

function remainingItems(items: Item[]): Item[] {
  let available_items_copy: Item[] = AVAILABLE_ITEMS.map(item => Object.assign(Object.create(Object.getPrototypeOf(item)), item));

  for (const j of items) {
    for (const i of available_items_copy) {
      if (i.weight == j.weight && i.value == j.value) {
        available_items_copy.splice(available_items_copy.indexOf(i), 1);
      }
    }
  }

  return available_items_copy;
}

class KnapsackOrganism implements Organism {
  mutationChance: number;
  genes: Item[];

  constructor() {
    this.mutationChance = MUTATION_CHANCE;
    this.genes = [];
    
    let available_items_copy: Item[] = AVAILABLE_ITEMS.map(item => Object.assign(Object.create(Object.getPrototypeOf(item)), item));

    while (this.getWeight() < WEIGHT_CAPACITY || available_items_copy.length <= 0) {
      const randomIndex = getRandomInt(0, available_items_copy.length - 1);
      const randomItem = available_items_copy.splice(randomIndex, 1)[0];
      this.genes.push(randomItem);
    }

    // remove the top item because it caused the overflow
    this.genes.pop();
  }

  getWeight(): number {
    let weight: number = 0;

    for (let i = 0; i < this.genes.length; i++) {
      weight += this.genes[i].weight;
    }
    
    return weight;
  }
  
  getValue(): number {
    let value: number = 0;

    for (let i = 0; i < this.genes.length; i++) {
      value += this.genes[i].value;
    }
    
    return value;
  }
}

//##############################################################################
// createOrganism
//##############################################################################

// randomly select items from the group until the weight limit is hit
function createOrganism(): KnapsackOrganism {
  return new KnapsackOrganism();
}

//##############################################################################
// crossover
//##############################################################################

// trade objects but make sure it's still within the weight limit
function crossover(parentA: KnapsackOrganism, parentB: KnapsackOrganism): KnapsackOrganism {
  let organism = new KnapsackOrganism();

  organism.genes = [];
  
  let possibleGenes: Item[] = [...new Set([...parentA.genes, ...parentB.genes])];

  while (organism.getWeight() < WEIGHT_CAPACITY && possibleGenes.length > 0) {
    const randomGeneIndex = getRandomInt(0, possibleGenes.length - 1);
    const randomGene = possibleGenes.splice(randomGeneIndex, 1)[0];

    if (organism.getWeight() + randomGene.weight <= WEIGHT_CAPACITY) {
      organism.genes.push(randomGene);
    }
  }

  while (organism.getWeight() > WEIGHT_CAPACITY && organism.genes.length > 0) {
    const randomIndex = getRandomInt(0, organism.genes.length - 1);
    organism.genes.splice(randomIndex, 1);
  }

  return organism;
}

//##############################################################################
// fitness
//##############################################################################

// fitness is just the total value of all objects in the knapsack
function calculateFitness(organism: KnapsackOrganism): number {
  if (organism.getWeight() > WEIGHT_CAPACITY) {
    return 0;
  }
  
  return organism.getValue();
}

//##############################################################################
// mutation
//##############################################################################

// trade random object out with other object
function mutate(organism: KnapsackOrganism): KnapsackOrganism {
  let available_items_copy: Item[] = remainingItems(organism.genes);
  
  for (let i = 0; i < organism.genes.length; i++) {
    const shouldMutate = Math.random() < organism.mutationChance;
    
    if (shouldMutate) {
      organism.genes[i] = available_items_copy[getRandomInt(0, available_items_copy.length - 1)];
    }
  }
  
  while (organism.getWeight() > WEIGHT_CAPACITY) {
    organism.genes.splice(getRandomInt(0, organism.genes.length - 1), 1);
  }
  
  return organism;
}

//##############################################################################
// stepFunction
//##############################################################################

// nothing
function stepFunction(model: GeneticAlgorithmModel<KnapsackOrganism>): void {
  return;
}

//##############################################################################
// shouldProgressGeneration
//##############################################################################

function shouldProgressGeneration(model: GeneticAlgorithmModel<KnapsackOrganism>): boolean {
  return true;
}

//##############################################################################
// shouldTerminate
//##############################################################################

function shouldTerminate(model: GeneticAlgorithmModel<KnapsackOrganism>): boolean {
  if (model.population.length == 0) {
    return true;
  }

  return false;
}

//##############################################################################
// setup
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
  true,
  FRAME_DELAY
)

let bestKnapsack: KnapsackOrganism = geneticAlgorithm.model.population[0];

let view: HTMLDivElement = document.createElement("div");
view.style.display = "flex";
view.style.alignItems = "center";
view.style.flexDirection = "column";
view.style.gap = "1rem";
view.style.justifyContent = "space-evenly";
view.style.position = "relative";

let playButton: HTMLButtonElement = document.createElement("button");
playButton.innerText = "▶ play ";
playButton.addEventListener("click", () => {
  geneticAlgorithm.play();
});

let pauseButton: HTMLButtonElement = document.createElement("button");
pauseButton.innerText = "⏸ pause";
pauseButton.addEventListener("click", () => {
  geneticAlgorithm.pause();
});

let resetButton: HTMLButtonElement = document.createElement("button");
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

let title: HTMLParagraphElement = document.createElement("p");
title.innerText = `Knapsack problem (weight capacity: ${WEIGHT_CAPACITY})`;
title.style.position = "absolute";
title.style.left = "0px";
title.style.top = "0px";
title.style.padding = "0.25rem";
title.style.transform = "translateY(-100%)";
title.style.fontSize = "0.75rem";

// append the whole view
view.appendChild(canvas);
view.appendChild(bestCanvas);
view.appendChild(title);
view.appendChild(controls);
document.querySelector("#view").appendChild(view);

//##############################################################################
// display
//##############################################################################

const DISPLAY_PADDING = 10;
const KNAPSACK_PADDING = 15;
const GAP = 5;
const DEFAULT_KNAPSACK_HEIGHT = 40;

function drawAvailableItems(ctx: CanvasRenderingContext2D) {
  const N = NUM_ITEMS;
  const g = GAP;
  const p_o = DISPLAY_PADDING;
  const p_i = KNAPSACK_PADDING;
  
  const w_d = CANVAS_WIDTH;
  const w_i = (w_d - (2 * p_o) - (2 * p_i) - (N - 1) * g) / N;

  ctx.rect(p_o, p_o, CANVAS_WIDTH - (2 * p_o), DEFAULT_KNAPSACK_HEIGHT);
  ctx.stroke();
  
  for (let i = 0; i < AVAILABLE_ITEMS.length; i++) {
    const item = AVAILABLE_ITEMS[i];
    
    item.draw(canvas, p_o + p_i + (i * w_i) + (i * g) + (w_i / 2), p_o + ((DEFAULT_KNAPSACK_HEIGHT - p_i) / 2));
  }
}

function drawKnapsacks(ctx: CanvasRenderingContext2D, geneticAlgorithm: GeneticAlgorithm<KnapsackOrganism>) {
  const TEXT_LINE_HEIGHT = 10;
  const ITEM_GAP = 10;

  const N = geneticAlgorithm.model.population.length;
  const h_d = CANVAS_HEIGHT;
  const p_o = DISPLAY_PADDING;
  const p_i = KNAPSACK_PADDING;
  const g = GAP;
  const w_d = CANVAS_WIDTH;
  const w_i = (w_d - (2 * p_o) - ((N - 1) * g)) / N;
  const h_l = TEXT_LINE_HEIGHT;
  const h_k = h_d - 2 * p_o - g - 2 * h_l - DEFAULT_KNAPSACK_HEIGHT;

  const currentBestKnapsack = geneticAlgorithm.model.population.reduce((best, curr) => {
    return calculateFitness(curr) > calculateFitness(best) ? curr : best;
  });

  for (let i = 0; i < geneticAlgorithm.model.population.length; i++) {
    const currentKnapsack = geneticAlgorithm.model.population[i];
    const start_x = p_o + (i * w_i) + (i * g);
    const start_y = p_o + DEFAULT_KNAPSACK_HEIGHT + g;
    const start_y_d = start_y + 2 * h_l;
    const n_items = currentKnapsack.genes.length;
    const h_item = (h_k - 2 * p_i - (n_items - 1) * g) / n_items;
    
    ctx.fillStyle = "black";
    ctx.font = "8px Sans";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(`$${currentKnapsack.getValue()}`, start_x, start_y);
    ctx.fillText(`w: ${currentKnapsack.getWeight()}`, start_x, start_y + h_l);
    ctx.textBaseline = "alphabetic";
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.rect(start_x, start_y_d, w_i, h_k);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    
    for (let j = 0; j < currentKnapsack.genes.length; j++) {
      const start_y_item = start_y_d + p_i + j * ITEM_GAP + j * h_item;

      currentKnapsack.genes[j].draw(
        canvas, start_x + w_i / 2, start_y_item);
    }
  }
}

function updateBestCanvas(ctx: CanvasRenderingContext2D, geneticAlgorithm: GeneticAlgorithm<KnapsackOrganism>) {
  for (const knapsack of geneticAlgorithm.model.population) {
    if (calculateFitness(knapsack) >= calculateFitness(bestKnapsack)) {
      bestKnapsack = knapsack;
    }
  }

  const g = GAP;
  const n = bestKnapsack.genes.length;
  const w_d = BEST_CANVAS_WIDTH;
  const h_d = BEST_CANVAS_HEIGHT;
  const h_l = 10;
  const p_o = 5;
  const p_i = 5;
  const h_i = h_d - h_l - 2 * p_o;
  const w_i = w_d - 2 * p_o;
  const w_item = (w_i - 2 * p_i - (n - 1) * g) / n;
  
  const start_x = p_o;
  const start_y = p_o;

  ctx.beginPath();
  ctx.rect(start_x, start_y, w_i, h_i);
  ctx.stroke();
  ctx.closePath();

  for (let i = 0; i < bestKnapsack.genes.length; i++) {
    const start_x_i = start_x + p_i + (i) * g + (i) * w_item + w_item / 2;
    const start_y_i = start_y + p_i + (h_i - 2 * p_i) / 2;

    bestKnapsack.genes[i].draw(bestCanvas, start_x_i, start_y_i);
  }

  ctx.fillStyle = "black";
  ctx.font = "8px Sans";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(`Value: $${bestKnapsack.getValue()}`, start_x, start_y + g + h_i);
  ctx.fillText(`Weight: ${bestKnapsack.getWeight()}`, start_x + (w_i / 2), start_y + g + h_i);
  ctx.textBaseline = "alphabetic";
  ctx.strokeStyle = "black";
}

function display(canvas: HTMLCanvasElement, model: GeneticAlgorithmModel<KnapsackOrganism>) {
  clearCanvas(canvas);
  clearCanvas(bestCanvas);

  //#####################
  // draw available items
  //#####################

  drawAvailableItems(canvas.getContext("2d"));
  
  //#####################
  // draw each knapsack
  //#####################
  
  drawKnapsacks(canvas.getContext("2d"), geneticAlgorithm);

  //#####################
  // draw best knapsack ever
  //#####################

  updateBestCanvas(bestCanvas.getContext("2d"), geneticAlgorithm);
}

function gameLoop(model: GeneticAlgorithmModel<KnapsackOrganism>): void {
  display(canvas, model);

  requestAnimationFrame(() => {
    gameLoop(geneticAlgorithm.model);
  });
}

gameLoop(geneticAlgorithm.model);
