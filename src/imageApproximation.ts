import { Organism, GeneticAlgorithm, GeneticAlgorithmModel } from "./terrarium.js";

const MUTATION_CHANCE: number = 0.01;
const POPULATION_SIZE: number = 10;
const FRAME_DELAY: number = 40;
const DISPLAY_DELAY: number = 500;

const CANVAS_HEIGHT: number = 100;
const CANVAS_WIDTH: number = 100;

const GENOME_LENGTH: number = 300;
const TARGET_CANVAS: HTMLCanvasElement = document.createElement("canvas");
TARGET_CANVAS.height = CANVAS_HEIGHT;
TARGET_CANVAS.width = CANVAS_WIDTH;
const TARGET_CTX = TARGET_CANVAS.getContext("2d");
const TARGET_IMAGE = document.createElement("img");
TARGET_IMAGE.src = `https://picsum.photos/${CANVAS_WIDTH}/${CANVAS_HEIGHT}`;
TARGET_IMAGE.crossOrigin = "anonymous";
TARGET_IMAGE.onload = () => {
  TARGET_CTX.drawImage(TARGET_IMAGE, 0, 0);
}

const SANDBOX_CANVAS: HTMLCanvasElement = document.createElement("canvas");
SANDBOX_CANVAS.height = CANVAS_HEIGHT;
SANDBOX_CANVAS.width = CANVAS_WIDTH;
const SANDBOX_CTX = SANDBOX_CANVAS.getContext("2d");
clearCanvas(SANDBOX_CANVAS);

const EMPTY_GENE_CHANCE: number = 0.2;
const EMPTY_GENE_FITNESS_COEFF: number = 0.5;

const COLOR_DIFF_LOSS_COEFF: number = 10;

function clearCanvas(cv: HTMLCanvasElement, color: string = "rgb(255, 255, 255)") {
  cv.getContext("2d").fillStyle = color;
  cv.getContext("2d").fillRect(0, 0, cv.width, cv.height);
}

//##############################################################################
// createOrganism
//##############################################################################

type Position = {
  x: number,
  y: number
};

type Color = {
  red: number,
  green: number,
  blue: number,
  alpha: number
}

function getRandomColor(): Color {
  return {
    red: getRandomInt(0, 255),
    green: getRandomInt(0, 255),
    blue: getRandomInt(0, 255),
    alpha: Math.random()
  };
}

function getRandomColorGray(): Color {
  const value: number = getRandomInt(0, 255);

  return {
    red: value,
    green: value,
    blue: value,
    alpha: Math.random()
  };
}

class Ellipse {
  position: Position;
  radiusX: number;
  radiusY: number;
  color: Color;
  
  constructor(position: Position, radiusX: number, radiusY: number, color: Color) {
    this.position = position;
    this.radiusX = radiusX;
    this.radiusY = radiusY;
    this.color = color;
  }
}

function getRandomEllipse(): Ellipse{
  const randomValue = Math.random();

  if (Math.random() < EMPTY_GENE_CHANCE) {
    return null;
  }
  
  // return ellipse
  return new Ellipse(
    {
      x: getRandomInt(0, CANVAS_WIDTH),
      y: getRandomInt(0, CANVAS_HEIGHT)
    },
    getRandomInt(1, CANVAS_WIDTH / 10),
    getRandomInt(1, CANVAS_HEIGHT / 10),
    getRandomColorGray()
  )
}

class ImageApproxOrganism implements Organism {
  mutationChance: number;
  genes: Ellipse[];

  constructor() {
    this.mutationChance = MUTATION_CHANCE;
    this.genes = [];

    for (let i = 0; i < GENOME_LENGTH; i++) {
      this.genes.push(getRandomEllipse());
    }
  }
}

function createOrganism(): ImageApproxOrganism {
  return new ImageApproxOrganism();
}

//##############################################################################
// crossover
//##############################################################################

function crossover(parentA: ImageApproxOrganism, parentB: ImageApproxOrganism): ImageApproxOrganism {
  let offspring: ImageApproxOrganism = structuredClone(parentA);

  for (let i = 0; i < offspring.genes.length; i++) {
    offspring.genes[i] = Math.random() > 0.5 ? parentA.genes[i] : parentB.genes[i];
  }

  return offspring;
}

//##############################################################################
// fitness
//##############################################################################

function calculateFitness(organism: ImageApproxOrganism): number {
  let fitness = 0;

  // Penalize empty shapes first
  const emptyShapeCounter = organism.genes.filter(gene => gene == null).length;
  fitness -= EMPTY_GENE_FITNESS_COEFF * emptyShapeCounter;
  
  // Clear and draw to sandbox canvas
  clearCanvas(SANDBOX_CANVAS);

  organism.genes.forEach(gene => {
    if (gene == null) return;
    
    SANDBOX_CTX.fillStyle = `rgba(${gene.color.red}, ${gene.color.green}, ${gene.color.blue}, ${gene.color.alpha})`;
    SANDBOX_CTX.beginPath();
    SANDBOX_CTX.ellipse(gene.position.x, gene.position.y, gene.radiusX, gene.radiusY, 0, 0, Math.PI * 2);
    SANDBOX_CTX.fill();
  });

  const targetImageData = TARGET_CTX.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
  const sandboxImageData = SANDBOX_CTX.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;

  // Compare pixel data directly from Uint8ClampedArrays
  for (let i = 0; i < targetImageData.length; i += 4) {
    // Each pixel has 4 values (R,G,B,A)
    fitness -= Math.abs(targetImageData[i] - sandboxImageData[i]) / 255 * COLOR_DIFF_LOSS_COEFF;       // Red
    fitness -= Math.abs(targetImageData[i+1] - sandboxImageData[i+1]) / 255 * COLOR_DIFF_LOSS_COEFF;   // Green
    fitness -= Math.abs(targetImageData[i+2] - sandboxImageData[i+2]) / 255 * COLOR_DIFF_LOSS_COEFF;   // Blue
    fitness -= Math.abs((targetImageData[i+3] / 255) - (sandboxImageData[i+3] / 255)) * COLOR_DIFF_LOSS_COEFF; // Alpha
  }

  return Math.trunc(fitness);
}

//##############################################################################
// mutation
//##############################################################################

function mutate(organism: ImageApproxOrganism): ImageApproxOrganism {

  for (let i = 0; i < organism.genes.length; i++) {
    const shouldMutate = Math.random() < MUTATION_CHANCE;

    if (shouldMutate) {
      organism.genes[i] = getRandomEllipse();
    }
  }

  return organism;
}

//##############################################################################
// stepFunction
//##############################################################################

function stepFunction(module: GeneticAlgorithmModel<ImageApproxOrganism>): void {
  return;
}

//##############################################################################
// shouldProgressGeneration
//##############################################################################

function shouldProgressGeneration(model: GeneticAlgorithmModel<ImageApproxOrganism>): boolean {
  return true;
}

//##############################################################################
// shouldTerminate
//##############################################################################

function shouldTerminate(model: GeneticAlgorithmModel<ImageApproxOrganism>): boolean {
  return false;
}

//##############################################################################
// setup
//##############################################################################

let geneticAlgorithm: GeneticAlgorithm<ImageApproxOrganism> = new GeneticAlgorithm(
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

//##############################################################################
// display
//##############################################################################

const DISPLAY_CANVAS = document.createElement("canvas");
DISPLAY_CANVAS.height = CANVAS_HEIGHT;
DISPLAY_CANVAS.width = CANVAS_WIDTH;
const DISPLAY_CTX = DISPLAY_CANVAS.getContext("2d");
clearCanvas(DISPLAY_CANVAS);

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
title.innerText = "Image approximation";
title.style.position = "absolute";
title.style.left = "0px";
title.style.top = "0px";
title.style.padding = "0.25rem";
title.style.transform = "translateY(-100%)";
title.style.fontSize = "0.75rem";

let canvasContainer: HTMLDivElement = document.createElement("div");
canvasContainer.style.display = "flex";
canvasContainer.style.flexDirection = "row";
canvasContainer.style.justifyContent = "space-between";
canvasContainer.style.alignItems = "center";
canvasContainer.style.gap = "1rem";

canvasContainer.appendChild(DISPLAY_CANVAS);
canvasContainer.appendChild(TARGET_CANVAS);

// append the whole view
view.appendChild(canvasContainer);
view.appendChild(title);
view.appendChild(controls);
document.querySelector("#view").appendChild(view);

function display(canvas: HTMLCanvasElement, model: GeneticAlgorithmModel<ImageApproxOrganism>) {
  clearCanvas(canvas);

  const mostFitOrganism = geneticAlgorithm.model.population.reduce((best, curr) => {
    return calculateFitness(curr) > calculateFitness(best) ? curr : best;
  });

  for (let i = 0; i < mostFitOrganism.genes.length; i++) {
    // skip null shapes
    if (mostFitOrganism.genes[i] == null) {
      continue;
    }
  
    DISPLAY_CTX.fillStyle = `rgba(${mostFitOrganism.genes[i].color.red}, ${mostFitOrganism.genes[i].color.green}, ${mostFitOrganism.genes[i].color.blue}, ${mostFitOrganism.genes[i].color.alpha})`
    DISPLAY_CTX.beginPath();
    DISPLAY_CTX.ellipse(mostFitOrganism.genes[i].position.x, mostFitOrganism.genes[i].position.y, mostFitOrganism.genes[i].radiusX, mostFitOrganism.genes[i].radiusY, 0, 0, Math.PI * 2);
    DISPLAY_CTX.fill();
  }
}

async function gameLoop(model: GeneticAlgorithmModel<ImageApproxOrganism>): Promise<void> {
  display(DISPLAY_CANVAS, model);
  requestAnimationFrame(async () => {
    await new Promise(r => setTimeout(r, DISPLAY_DELAY));
    await gameLoop(geneticAlgorithm.model);
  });
}

gameLoop(geneticAlgorithm.model);
