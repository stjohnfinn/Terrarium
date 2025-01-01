import { GeneticAlgorithm } from "./terrarium.js";
const MUTATION_CHANCE = 0.2;
const POPULATION_SIZE = 7;
const FRAME_DELAY = 40;
const CANVAS_HEIGHT = 250;
const CANVAS_WIDTH = 250;
const canvas = document.createElement("canvas");
canvas.height = CANVAS_HEIGHT;
canvas.width = CANVAS_WIDTH;
const BEST_CANVAS_HEIGHT = 50;
const BEST_CANVAS_WIDTH = CANVAS_WIDTH;
const bestCanvas = document.createElement("canvas");
bestCanvas.height = BEST_CANVAS_HEIGHT;
bestCanvas.width = BEST_CANVAS_WIDTH;
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
        ctx.beginPath();
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
    let organism = new KnapsackOrganism();
    const items_count = parentA.genes.length > parentB.genes.length ? parentB.genes.length : parentA.genes.length;
    organism.genes = [];
    for (let i = 0; i < items_count; i++) {
        organism.genes.push(Math.random() > 0.5 ? parentA.genes[i] : parentB.genes[i]);
    }
    return organism;
}
//##############################################################################
// fitness
//##############################################################################
// fitness is just the total value of all objects in the knapsack
function calculateFitness(organism) {
    if (organism.getWeight() > WEIGHT_CAPACITY) {
        return 0;
    }
    return organism.getValue() - organism.getWeight();
}
//##############################################################################
// mutation
//##############################################################################
// trade random object out with other object
function mutate(organism) {
    let available_items_copy = AVAILABLE_ITEMS.map(item => Object.assign(Object.create(Object.getPrototypeOf(item)), item));
    for (const item of organism.genes) {
        available_items_copy = available_items_copy.filter(el => el != item);
    }
    for (let i = 0; i < organism.genes.length; i++) {
        const shouldMutate = Math.random() < organism.mutationChance;
        if (shouldMutate) {
            console.log(`mutating at index ${i}`);
            organism.genes[i] = available_items_copy[getRandomInt(0, available_items_copy.length - 1)];
        }
    }
    while (organism.getWeight() > WEIGHT_CAPACITY) {
        console.log("genes before");
        console.log(organism.genes);
        organism.genes.pop();
    }
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
let geneticAlgorithm = new GeneticAlgorithm(createOrganism, stepFunction, calculateFitness, crossover, mutate, shouldTerminate, shouldProgressGeneration, POPULATION_SIZE, true, FRAME_DELAY);
let bestKnapsack = geneticAlgorithm.model.population[0];
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
function drawAvailableItems(ctx) {
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
function drawKnapsacks(ctx, geneticAlgorithm) {
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
            currentKnapsack.genes[j].draw(canvas, start_x + w_i / 2, start_y_item);
        }
    }
}
function updateBestCanvas(ctx, geneticAlgorithm) {
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
function display(canvas, model) {
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
function gameLoop(model) {
    display(canvas, model);
    requestAnimationFrame(() => {
        gameLoop(geneticAlgorithm.model);
    });
}
gameLoop(geneticAlgorithm.model);
// draw a green square around the current best knapsack
