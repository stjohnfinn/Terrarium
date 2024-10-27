var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GeneticAlgorithm } from "./terrarium.js";
const MUTATION_CHANCE = 0.2;
const POPULATION_SIZE = 30;
const FRAME_DELAY = 25;
const CANVAS_HEIGHT = 250;
const CANVAS_WIDTH = 250;
// Gene bounds
const MIN_RADIUS = 2;
const MAX_RADIUS = 8;
const MIN_DAMAGE = 1;
const MAX_DAMAGE = 4;
const MIN_ARMOR = 2;
const MAX_ARMOR = 10;
const MIN_COLOR = 0;
const MAX_COLOR = 255;
const BASE_HEALTH = 15;
const MIN_POS = {
    x: 20,
    y: 20
};
const MAX_POS = {
    x: CANVAS_WIDTH - 20,
    y: CANVAS_HEIGHT - 20
};
const MIN_VEL = {
    x: 1,
    y: 1
};
const MAX_VEL = {
    x: 4,
    y: 4
};
class ShapeOrganism {
    constructor() {
        const randomRadius = getRandomInt(MIN_RADIUS, MAX_RADIUS);
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
        };
        this.velocity = {
            x: getRandomInt(MIN_VEL.x, MAX_VEL.x),
            y: getRandomInt(MIN_VEL.y, MAX_VEL.y)
        };
        this.mutationChance = MUTATION_CHANCE;
        this.health = BASE_HEALTH,
            this.isAlive = true;
        this.kills = 0;
    }
}
function createOrganism() {
    return new ShapeOrganism();
}
function calculateFitness(organism) {
    let fitness = 0;
    fitness += organism.kills;
    return fitness;
}
function crossover(parentA, parentB) {
    let offspring = new ShapeOrganism();
    offspring.genes.radius = randomizeWithMargin(getAverage(parentA.genes.radius, parentB.genes.radius), 3);
    offspring.genes.area = offspring.genes.radius * 2 * Math.PI;
    offspring.genes.damage = getRandomInt(parentA.genes.damage, parentB.genes.damage);
    offspring.genes.armor = getRandomInt(parentA.genes.armor, parentB.genes.armor);
    offspring.genes.color = {
        red: randomizeWithMargin(getRandomInt(parentA.genes.color.red, parentA.genes.color.red), 30),
        green: randomizeWithMargin(getRandomInt(parentA.genes.color.green, parentA.genes.color.green), 30),
        blue: randomizeWithMargin(getRandomInt(parentA.genes.color.blue, parentA.genes.color.blue), 30),
    };
    return offspring;
}
function mutate(organism) {
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
function shouldTerminate(model) {
    return false;
}
function shouldProgressGeneration(model) {
    let aliveCountgtOne = model.population.reduce((accumulator, currentValue) => accumulator + Number(currentValue.isAlive), 0) <= 1;
    return aliveCountgtOne;
}
let view = document.createElement("div");
view.style.display = "flex";
view.style.alignItems = "center";
view.style.flexDirection = "column";
view.style.gap = "1rem";
view.style.justifyContent = "space-evenly";
let canvas = document.createElement("canvas");
canvas.height = CANVAS_HEIGHT;
canvas.width = CANVAS_WIDTH;
canvas.style.border = "1px dashed lightblue";
function clearCanvas(cv, color = "rgb(255, 255, 255)") {
    cv.getContext("2d").fillStyle = color;
    cv.getContext("2d").fillRect(0, 0, cv.width, cv.height);
}
/**
 * REAL MEAT OF THIS ALL
 *
 * this is all of the really important stuff
 */
function keepShapeInbounds(shape, xMax, yMax, xMin = 0, yMin = 0) {
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
function stepFunction(model) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < model.population.length; i++) {
            model.population[i].position.x += model.population[i].velocity.x;
            model.population[i].position.y += model.population[i].velocity.y;
            keepShapeInbounds(model.population[i], CANVAS_WIDTH, CANVAS_HEIGHT);
        }
        return;
    });
}
let geneticAlgorithm = new GeneticAlgorithm(createOrganism, stepFunction, calculateFitness, crossover, mutate, shouldTerminate, shouldProgressGeneration, POPULATION_SIZE, false, FRAME_DELAY);
/**
 * View logic is here baby!!!
 */
function display(canvas, model) {
    const ctx = canvas.getContext("2d");
    const OPACITY = 0.2;
    clearCanvas(canvas);
    for (const organism of model.population) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(${organism.genes.color.red}, ${organism.genes.color.green}, ${organism.genes.color.blue}, ${OPACITY})`;
        ctx.arc(organism.position.x, organism.position.y, organism.genes.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
}
;
function gameLoop(model) {
    display(canvas, model);
    requestAnimationFrame(() => {
        gameLoop(geneticAlgorithm.model);
    });
}
gameLoop(geneticAlgorithm.model);
/**
 * CONTROLS here!
 */
let playButton = document.createElement("button");
document.querySelector("body").appendChild(playButton);
playButton.innerText = "▶ play ";
playButton.addEventListener("click", () => {
    geneticAlgorithm.play();
});
let pauseButton = document.createElement("button");
document.querySelector("body").appendChild(pauseButton);
pauseButton.innerText = "⏸ pause";
pauseButton.addEventListener("click", () => {
    geneticAlgorithm.pause();
});
let resetButton = document.createElement("button");
document.querySelector("body").appendChild(resetButton);
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
view.appendChild(controls);
view.appendChild(canvas);
document.querySelector("#view").appendChild(view);
