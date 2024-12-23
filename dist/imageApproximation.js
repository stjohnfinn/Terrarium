import { GeneticAlgorithm } from "./terrarium.js";
const MUTATION_CHANCE = 0.01;
const POPULATION_SIZE = 10;
const FRAME_DELAY = 0;
const CANVAS_HEIGHT = 150;
const CANVAS_WIDTH = 150;
const GENOME_LENGTH = 250;
const TARGET_CANVAS = document.createElement("canvas");
TARGET_CANVAS.height = CANVAS_HEIGHT;
TARGET_CANVAS.width = CANVAS_WIDTH;
const TARGET_CTX = TARGET_CANVAS.getContext("2d");
const TARGET_IMAGE = document.createElement("img");
TARGET_IMAGE.src = `https://picsum.photos/${CANVAS_WIDTH}/${CANVAS_HEIGHT}`;
TARGET_IMAGE.crossOrigin = "anonymous";
TARGET_IMAGE.onload = () => {
    TARGET_CTX.drawImage(TARGET_IMAGE, 0, 0);
};
const SANDBOX_CANVAS = document.createElement("canvas");
SANDBOX_CANVAS.height = CANVAS_HEIGHT;
SANDBOX_CANVAS.width = CANVAS_WIDTH;
const SANDBOX_CTX = SANDBOX_CANVAS.getContext("2d");
clearCanvas(SANDBOX_CANVAS);
const EMPTY_GENE_CHANCE = 0.2;
const EMPTY_GENE_FITNESS_COEFF = 0.5;
function clearCanvas(cv, color = "rgb(255, 255, 255)") {
    cv.getContext("2d").fillStyle = color;
    cv.getContext("2d").fillRect(0, 0, cv.width, cv.height);
}
function getRandomColor() {
    return {
        red: getRandomInt(0, 255),
        green: getRandomInt(0, 255),
        blue: getRandomInt(0, 255),
        alpha: Math.random()
    };
}
class Ellipse {
    constructor(position, radiusX, radiusY, color) {
        this.position = position;
        this.radiusX = radiusX;
        this.radiusY = radiusY;
        this.color = color;
    }
}
function getRandomEllipse() {
    const randomValue = Math.random();
    if (Math.random() < EMPTY_GENE_CHANCE) {
        return null;
    }
    // return ellipse
    return new Ellipse({
        x: getRandomInt(0, CANVAS_WIDTH),
        y: getRandomInt(0, CANVAS_HEIGHT)
    }, getRandomInt(1, 25), getRandomInt(1, 25), getRandomColor());
}
class ImageApproxOrganism {
    constructor() {
        this.mutationChance = MUTATION_CHANCE;
        this.genes = [];
        for (let i = 0; i < GENOME_LENGTH; i++) {
            this.genes.push(getRandomEllipse());
        }
    }
}
function createOrganism() {
    return new ImageApproxOrganism();
}
//##############################################################################
// crossover
//##############################################################################
function crossover(parentA, parentB) {
    let offspring = structuredClone(parentA);
    for (let i = 0; i < offspring.genes.length; i++) {
        offspring.genes[i] = Math.random() > 0.5 ? parentA.genes[i] : parentB.genes[i];
    }
    return offspring;
}
//##############################################################################
// fitness
//##############################################################################
function calculateFitness(organism) {
    let fitness = 0;
    // Penalize empty shapes first
    const emptyShapeCounter = organism.genes.filter(gene => gene == null).length;
    fitness -= EMPTY_GENE_FITNESS_COEFF * emptyShapeCounter;
    // Clear and draw to sandbox canvas
    clearCanvas(SANDBOX_CANVAS);
    organism.genes.forEach(gene => {
        if (gene == null)
            return;
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
        fitness -= Math.abs(targetImageData[i] - sandboxImageData[i]) / 255; // Red
        fitness -= Math.abs(targetImageData[i + 1] - sandboxImageData[i + 1]) / 255; // Green
        fitness -= Math.abs(targetImageData[i + 2] - sandboxImageData[i + 2]) / 255; // Blue
        fitness -= Math.abs((targetImageData[i + 3] / 255) - (sandboxImageData[i + 3] / 255)); // Alpha
    }
    return Math.trunc(fitness);
}
//##############################################################################
// mutation
//##############################################################################
function mutate(organism) {
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
function stepFunction(module) {
    return;
}
//##############################################################################
// shouldProgressGeneration
//##############################################################################
function shouldProgressGeneration(model) {
    return true;
}
//##############################################################################
// shouldTerminate
//##############################################################################
function shouldTerminate(model) {
    return false;
}
//##############################################################################
// setup
//##############################################################################
let geneticAlgorithm = new GeneticAlgorithm(createOrganism, stepFunction, calculateFitness, crossover, mutate, shouldTerminate, shouldProgressGeneration, POPULATION_SIZE, false, FRAME_DELAY);
//##############################################################################
// display
//##############################################################################
const DISPLAY_CANVAS = document.createElement("canvas");
DISPLAY_CANVAS.height = CANVAS_HEIGHT;
DISPLAY_CANVAS.width = CANVAS_WIDTH;
const DISPLAY_CTX = DISPLAY_CANVAS.getContext("2d");
clearCanvas(DISPLAY_CANVAS);
let view = document.createElement("div");
view.style.display = "flex";
view.style.alignItems = "center";
view.style.flexDirection = "column";
view.style.gap = "1rem";
view.style.justifyContent = "space-evenly";
view.style.position = "relative";
let playButton = document.createElement("button");
playButton.innerText = "▶ play ";
playButton.addEventListener("click", () => {
    geneticAlgorithm.play();
});
let pauseButton = document.createElement("button");
pauseButton.innerText = "⏸ pause";
pauseButton.addEventListener("click", () => {
    geneticAlgorithm.pause();
});
let resetButton = document.createElement("button");
resetButton.innerText = "⟲ reset";
resetButton.addEventListener("click", () => {
    geneticAlgorithm.reset();
});
let controls = document.createElement("div");
controls.appendChild(playButton);
controls.appendChild(pauseButton);
controls.appendChild(resetButton);
controls.style.display = "flex";
controls.style.flexDirection = "row";
controls.style.alignItems = "flex-start";
controls.style.justifyContent = "space-evenly";
controls.style.width = "100%";
let title = document.createElement("p");
title.innerText = "Image approximation";
title.style.position = "absolute";
title.style.left = "0px";
title.style.top = "0px";
title.style.padding = "0.25rem";
title.style.transform = "translateY(-100%)";
title.style.fontSize = "0.75rem";
let fitnessMetric = document.createElement("p");
fitnessMetric.innerText = "Average highest fitness: 0";
fitnessMetric.style.padding = "0.25rem";
fitnessMetric.style.fontSize = "0.75rem";
let canvasContainer = document.createElement("div");
canvasContainer.style.display = "flex";
canvasContainer.style.flexDirection = "row";
canvasContainer.style.justifyContent = "space-between";
canvasContainer.style.alignItems = "center";
canvasContainer.style.gap = "1rem";
canvasContainer.appendChild(DISPLAY_CANVAS);
canvasContainer.appendChild(TARGET_CANVAS);
// append the whole view
view.appendChild(fitnessMetric);
view.appendChild(canvasContainer);
view.appendChild(title);
view.appendChild(controls);
document.querySelector("#view").appendChild(view);
function display(canvas, model) {
    clearCanvas(canvas);
    const mostFitOrganism = geneticAlgorithm.model.population.reduce((best, curr) => {
        return calculateFitness(curr) > calculateFitness(best) ? curr : best;
    });
    const averageFitness = geneticAlgorithm.model.population.reduce((sum, current) => sum + calculateFitness(current), 0) / geneticAlgorithm.model.population.length;
    fitnessMetric.innerText = `Average highest fitness: ${averageFitness}`;
    for (let i = 0; i < mostFitOrganism.genes.length; i++) {
        // skip null shapes
        if (mostFitOrganism.genes[i] == null) {
            continue;
        }
        DISPLAY_CTX.fillStyle = `rgba(${mostFitOrganism.genes[i].color.red}, ${mostFitOrganism.genes[i].color.green}, ${mostFitOrganism.genes[i].color.blue}, ${mostFitOrganism.genes[i].color.alpha})`;
        DISPLAY_CTX.beginPath();
        DISPLAY_CTX.ellipse(mostFitOrganism.genes[i].position.x, mostFitOrganism.genes[i].position.y, mostFitOrganism.genes[i].radiusX, mostFitOrganism.genes[i].radiusY, 0, 0, Math.PI * 2);
        DISPLAY_CTX.fill();
    }
}
function gameLoop(model) {
    display(DISPLAY_CANVAS, model);
    requestAnimationFrame(() => {
        gameLoop(geneticAlgorithm.model);
    });
}
gameLoop(geneticAlgorithm.model);
