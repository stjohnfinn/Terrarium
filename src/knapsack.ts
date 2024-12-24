import { Organism, GeneticAlgorithm, GeneticAlgorithmModel } from "./terrarium.js";

const MUTATION_CHANCE: number = 0.01;
const POPULATION_SIZE: number = 10;
const FRAME_DELAY: number = 40;

const CANVAS_HEIGHT: number = 250;
const CANVAS_WIDTH: number = 250;

const canvas: HTMLCanvasElement = document.createElement("canvas");
canvas.height = CANVAS_HEIGHT;
canvas.width = CANVAS_WIDTH;

//##############################################################################
// hyperparamters
//##############################################################################

const WEIGHT_CAPACITY: number = 1000;
const MIN_WEIGHT: number = 50;
const MAX_WIDTH: number = 100;
const MIN_VALUE: number = 10;
const MAX_VALUE: number = 40;

const NUM_ITEMS: number = 15;

//##############################################################################
// createOrganism
//##############################################################################

// randomly select items from the group until the weight limit is hit

//##############################################################################
// crossover
//##############################################################################

// trade objects but make sure it's still within the weight limit

//##############################################################################
// fitness
//##############################################################################

// fitness is just the total value of all objects in the knapsack

//##############################################################################
// mutation
//##############################################################################

// trade random object out with other object

//##############################################################################
// stepFunction
//##############################################################################

// nothing

//##############################################################################
// shouldProgressGeneration
//##############################################################################

//##############################################################################
// shouldTerminate
//##############################################################################

//##############################################################################
// setup
//##############################################################################

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
  // geneticAlgorithm.play();
});

let pauseButton: HTMLButtonElement = document.createElement("button");
pauseButton.innerText = "⏸ pause";
pauseButton.addEventListener("click", () => {
  // geneticAlgorithm.pause();
});

let resetButton: HTMLButtonElement = document.createElement("button");
resetButton.innerText = "⟲ reset";
resetButton.addEventListener("click", () => {
  // geneticAlgorithm.reset();
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
title.innerText = "Knapsack problem";
title.style.position = "absolute";
title.style.left = "0px";
title.style.top = "0px";
title.style.padding = "0.25rem";
title.style.transform = "translateY(-100%)";
title.style.fontSize = "0.75rem";

// append the whole view
view.appendChild(canvas);
view.appendChild(title);
view.appendChild(controls);
document.querySelector("#view").appendChild(view);

//##############################################################################
// display
//##############################################################################

// draw each knapsack

// draw each knapsack's weight and total value

// draw the available objects

// draw a green square around the current best knapsack
