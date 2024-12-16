import { GeneticAlgorithm } from "./terrarium.js";
const MUTATION_CHANCE = 0.08;
const POPULATION_SIZE = 12;
const FRAME_DELAY = 10;
const CANVAS_HEIGHT = 250;
const CANVAS_WIDTH = 250;
// Survivor parameters
const NUM_ACTIONS = 300;
const MAX_HEALTH = 100;
const MAX_ENERGY = 100;
const MAX_HYDRATION = 100;
const RANDOM_POSITION_PADDING = CANVAS_HEIGHT * 0.05;
const POSITION_STEP = 5;
var Item;
(function (Item) {
    Item[Item["water"] = 0] = "water";
    Item[Item["food"] = 1] = "food";
})(Item || (Item = {}));
var Action;
(function (Action) {
    Action[Action["walkUp"] = 0] = "walkUp";
    Action[Action["walkDown"] = 1] = "walkDown";
    Action[Action["walkLeft"] = 2] = "walkLeft";
    Action[Action["walkRight"] = 3] = "walkRight";
    Action[Action["attackUp"] = 4] = "attackUp";
    Action[Action["attackDown"] = 5] = "attackDown";
    Action[Action["attackLeft"] = 6] = "attackLeft";
    Action[Action["attackRight"] = 7] = "attackRight";
    Action[Action["eat"] = 8] = "eat";
    Action[Action["drink"] = 9] = "drink";
})(Action || (Action = {}));
function randomValidAction() {
    const FIRST_ACTION = Action.walkUp;
    const LAST_ACTION = Action.drink;
    return getRandomInt(FIRST_ACTION, LAST_ACTION);
}
class Position {
    constructor(x, y, minX, maxX, minY, maxY) {
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
    setX(value) {
        if (value < this.minX) {
            value = this.minX;
        }
        if (value > this.maxX) {
            value = this.maxX;
        }
        this.x = value;
    }
    setY(value) {
        if (value < this.minY) {
            value = this.minY;
        }
        if (value > this.maxY) {
            value = this.maxY;
        }
        this.y = value;
    }
}
class SurvivorOrganism {
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
        this.position = new Position(getRandomInt(0 + RANDOM_POSITION_PADDING, CANVAS_WIDTH - RANDOM_POSITION_PADDING), getRandomInt(0 + RANDOM_POSITION_PADDING, CANVAS_HEIGHT - RANDOM_POSITION_PADDING), 0, CANVAS_WIDTH, 0, CANVAS_HEIGHT);
        this.currentActionIndex = 0;
        this.inventory = [];
    }
    setPosition(x, y) {
        this.position.setX(x);
        this.position.setY(y);
    }
    hasFood() {
        for (const item of this.inventory) {
            if (item == Item.food) {
                return true;
            }
        }
    }
    hasWater() {
        for (const item of this.inventory) {
            if (item == Item.water) {
                return true;
            }
        }
    }
}
function createOrganism() {
    return new SurvivorOrganism();
}
function calculateFitness(organism) {
    let fitness = 0;
    fitness += organism.currentEnergy;
    fitness += organism.currentHealth;
    fitness += organism.currentHydration;
    fitness *= organism.kills;
    return organism.isAlive ? fitness : 0;
}
function stepFunction(model) {
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
function crossover(parentA, parentB) {
    // regular crossover, nothing special
    let offspring = new SurvivorOrganism();
    for (let i = 0; i < offspring.genes.actions.length; i++) {
        if (Math.random() > 0.5) {
            offspring.genes.actions[i] = parentA.genes.actions[i];
        }
        else {
            offspring.genes.actions[i] = parentB.genes.actions[i];
        }
    }
    return offspring;
}
function mutate(organism) {
    for (let i = 0; i < organism.genes.actions.length; i++) {
        const shouldMutateThisGene = Math.random() < organism.mutationChance;
        if (shouldMutateThisGene) {
            organism.genes.actions[i] = randomValidAction();
        }
    }
    return organism;
}
function shouldTerminate(model) {
    return false;
}
function shouldProgressGeneration(model) {
    return model.population.every(survivor => survivor.currentActionIndex >= survivor.genes.actions.length);
}
let geneticAlgorithm = new GeneticAlgorithm(createOrganism, stepFunction, calculateFitness, crossover, mutate, shouldTerminate, shouldProgressGeneration, POPULATION_SIZE, false, FRAME_DELAY);
/*******************************************************************************
 * Display logic
 */
function clearCanvas(cv, color = "rgb(255, 255, 255)") {
    cv.getContext("2d").fillStyle = color;
    cv.getContext("2d").fillRect(0, 0, cv.width, cv.height);
}
let displayDiv = document.createElement("div");
displayDiv.style.display = "flex";
displayDiv.style.alignItems = "center";
displayDiv.style.flexDirection = "column";
displayDiv.style.gap = "1rem";
displayDiv.style.justifyContent = "space-evenly";
displayDiv.style.position = "relative";
let title = document.createElement("p");
title.innerText = "Survival";
title.style.position = "absolute";
title.style.left = "0px";
title.style.top = "0px";
title.style.padding = "0.25rem";
title.style.transform = "translateY(-100%)";
title.style.fontSize = "0.75rem";
displayDiv.appendChild(title);
let canvas = document.createElement("canvas");
canvas.height = CANVAS_HEIGHT;
canvas.width = CANVAS_WIDTH;
canvas.style.border = "1px solid white";
canvas.style.background = "black";
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
    console.log(geneticAlgorithm.model);
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
displayDiv.appendChild(canvas);
displayDiv.appendChild(controls);
document.querySelector("#view").appendChild(displayDiv);
function display(canvas, model) {
    const ctx = canvas.getContext("2d");
    clearCanvas(canvas, "rgb(0, 0, 0)");
    ctx.fillStyle = "rgb(255, 255, 0)";
    for (const organism of model.population) {
        ctx.fillStyle = "rgb(255, 255, 0)";
        ctx.fillRect(organism.position.getX(), organism.position.getY(), 5, 5);
        switch (organism.genes.actions[organism.currentActionIndex]) {
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
}
;
function gameLoop(model) {
    display(canvas, model);
    requestAnimationFrame(() => {
        gameLoop(geneticAlgorithm.model);
    });
}
gameLoop(geneticAlgorithm.model);
