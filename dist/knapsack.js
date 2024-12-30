import { GeneticAlgorithm } from "./terrarium.js";
const MUTATION_CHANCE = 0.01;
const POPULATION_SIZE = 5;
const FRAME_DELAY = 40;
const CANVAS_HEIGHT = 250;
const CANVAS_WIDTH = 250;
const canvas = document.createElement("canvas");
canvas.height = CANVAS_HEIGHT;
canvas.width = CANVAS_WIDTH;
//##############################################################################
// hyperparamters
//##############################################################################
const WEIGHT_CAPACITY = 400;
const MIN_WEIGHT = 50;
const MAX_WEIGHT = 100;
const MIN_VALUE = 10;
const MAX_VALUE = 40;
const MIN_SIZE = 5;
const MAX_SIZE = 20;
const NUM_ITEMS = 15;
var Shape;
(function (Shape) {
    Shape[Shape["Triangle"] = 0] = "Triangle";
    Shape[Shape["Circle"] = 1] = "Circle";
    Shape[Shape["Square"] = 2] = "Square";
})(Shape || (Shape = {}));
class Item {
    constructor(shape, weight, value, color) {
        this.shape = shape;
        this.weight = weight;
        this.value = value;
        this.color = color;
    }
    draw(canvas, x, y) {
        const ctx = canvas.getContext("2d");
        const scaledSize = MIN_SIZE + (this.weight - MIN_WEIGHT) * (MAX_SIZE - MIN_SIZE) / (MAX_WEIGHT - MIN_WEIGHT);
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
        ctx.fillStyle = "black";
        ctx.font = "8px Sans";
        ctx.textAlign = "center";
        ctx.fillText(`${this.value}`, x, y + 5);
    }
}
function getRandomItem() {
    return new Item(getRandomInt(0, Shape.Square), getRandomInt(MIN_WEIGHT, MAX_WEIGHT), getRandomInt(MIN_VALUE, MAX_VALUE), {
        red: getRandomInt(0, 255),
        green: getRandomInt(0, 255),
        blue: getRandomInt(0, 255),
    });
}
function clearCanvas(cv, color = "rgb(255, 255, 255)") {
    cv.getContext("2d").fillStyle = color;
    cv.getContext("2d").fillRect(0, 0, cv.width, cv.height);
}
// create available items
let AVAILABLE_ITEMS = [];
for (let i = 0; i < NUM_ITEMS; i++) {
    AVAILABLE_ITEMS.push(getRandomItem());
}
console.log(AVAILABLE_ITEMS);
class KnapsackOrganism {
    constructor() {
        this.mutationChance = MUTATION_CHANCE;
        this.genes = [];
        let available_items_copy = AVAILABLE_ITEMS.map(item => Object.assign(Object.create(Object.getPrototypeOf(item)), item));
        while (this.getWeight() < WEIGHT_CAPACITY || available_items_copy.length <= 0) {
            const randomIndex = getRandomInt(0, available_items_copy.length - 1);
            this.genes.push(available_items_copy[randomIndex]);
            available_items_copy.splice(randomIndex, 1);
        }
        // remove the top item because it caused the overflow
        this.genes.pop();
    }
    getWeight() {
        let weight = 0;
        for (let i = 0; i < this.genes.length; i++) {
            weight += this.genes[i].weight;
        }
        return weight;
    }
    getValue() {
        let value = 0;
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
function createOrganism() {
    return new KnapsackOrganism();
}
//##############################################################################
// crossover
//##############################################################################
// trade objects but make sure it's still within the weight limit
function crossover(parentA, parentB) {
    return structuredClone(parentA);
}
//##############################################################################
// fitness
//##############################################################################
// fitness is just the total value of all objects in the knapsack
function calculateFitness(organism) {
    return organism.getValue();
}
//##############################################################################
// mutation
//##############################################################################
// trade random object out with other object
function mutate(organism) {
    return organism;
}
//##############################################################################
// stepFunction
//##############################################################################
// nothing
function stepFunction(model) {
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
const DISPLAY_PADDING = 10;
const KNAPSACK_PADDING = 5;
const GAP = 10;
const DEFAULT_KNAPSACK_HEIGHT = 40;
const t = CANVAS_WIDTH;
const g = GAP;
const p_o = DISPLAY_PADDING;
const n = geneticAlgorithm.model.population.length;
const p_i = KNAPSACK_PADDING;
const d_iw = (p_i + p_i - t) / -n;
const d_h = DEFAULT_KNAPSACK_HEIGHT;
function display(canvas, model) {
    clearCanvas(canvas);
    const ctx = canvas.getContext("2d");
    //#####################
    // draw available items
    //#####################
    ctx.rect(p_o, p_o, CANVAS_WIDTH - (2 * p_o), DEFAULT_KNAPSACK_HEIGHT);
    ctx.stroke();
    for (let i = 0; i < AVAILABLE_ITEMS.length; i++) {
        const item = AVAILABLE_ITEMS[i];
        item.draw(canvas, i * d_iw, p_o + (d_h / 2));
    }
    //#####################
    // draw each knapsack
    //#####################
    const KNAPSACK_WIDTH = ((2 * p_o) + (n - 1) * g - t) / -n;
    for (let i = 0; i < geneticAlgorithm.model.population.length; i++) {
        const currentKnapsack = geneticAlgorithm.model.population[i];
        const x = p_o + i * g + i * KNAPSACK_WIDTH;
        const y = 100;
        ctx.beginPath();
        ctx.rect(x, y, KNAPSACK_WIDTH, CANVAS_HEIGHT - y - 10);
        ctx.stroke();
        ctx.closePath();
        ctx.fillStyle = "black";
        ctx.font = "8px Sans";
        ctx.textAlign = "left";
        ctx.fillText(`$${currentKnapsack.getValue()}`, x, y - 6);
        ctx.fillText(`w: ${currentKnapsack.getWeight()}`, x, y - 16);
        for (let j = 0; j < geneticAlgorithm.model.population[i].genes.length; j++) {
            geneticAlgorithm.model.population[i].genes[j].draw(canvas, x + KNAPSACK_PADDING + 15, y + (j * 10) + 20);
        }
    }
}
function gameLoop(model) {
    display(canvas, model);
    requestAnimationFrame(() => {
        gameLoop(geneticAlgorithm.model);
    });
}
gameLoop(geneticAlgorithm.model);
// draw a green square around the current best knapsack
