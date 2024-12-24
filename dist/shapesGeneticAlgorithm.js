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
const FRAME_DELAY = 0;
const CANVAS_HEIGHT = 250;
const CANVAS_WIDTH = 250;
// Gene bounds
const MIN_RADIUS = 4;
const MAX_RADIUS = 20;
const RADIUS_MUTATION_MARGIN = 2;
const MIN_DAMAGE = 4;
const MAX_DAMAGE = 10;
const DAMAGE_MUTATION_MARGIN = 2;
const MIN_ARMOR = 2;
const MAX_ARMOR = 10;
const ARMOR_MUTATION_MARGIN = 3;
const MIN_COLOR = 0;
const MAX_COLOR = 255;
const COLOR_MUTATION_MARGIN = 20;
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
    x: 0.5,
    y: 0.5
};
const MAX_VEL = {
    x: 2.5,
    y: 2.5
};
class ShapeOrganism {
    constructor() {
        const randomRadius = getRandomInt(MIN_RADIUS, MAX_RADIUS);
        this.genes = {
            radius: randomRadius,
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
            x: getRandomFloat(MIN_VEL.x, MAX_VEL.x),
            y: getRandomFloat(MIN_VEL.y, MAX_VEL.y)
        };
        this.mutationChance = MUTATION_CHANCE;
        this.health = BASE_HEALTH,
            this.isAlive = true;
        this.kills = 0;
    }
    getArea() {
        return Math.PI * 2 * this.genes.radius;
    }
}
function createOrganism() {
    return new ShapeOrganism();
}
function calculateFitness(organism) {
    let fitness = 0;
    fitness += organism.kills;
    if (organism.isAlive) {
        fitness = fitness * 2;
    }
    return fitness;
}
function crossover(parentA, parentB) {
    let offspring = new ShapeOrganism();
    offspring.genes.radius = randomizeWithMargin(getAverage(parentA.genes.radius, parentB.genes.radius), RADIUS_MUTATION_MARGIN);
    offspring.genes.damage = getRandomInt(parentA.genes.damage, parentB.genes.damage);
    offspring.genes.armor = getRandomInt(parentA.genes.armor, parentB.genes.armor);
    offspring.genes.color = {
        red: randomizeWithMargin(getRandomInt(parentA.genes.color.red, parentA.genes.color.red), COLOR_MUTATION_MARGIN),
        green: randomizeWithMargin(getRandomInt(parentA.genes.color.green, parentA.genes.color.green), COLOR_MUTATION_MARGIN),
        blue: randomizeWithMargin(getRandomInt(parentA.genes.color.blue, parentA.genes.color.blue), COLOR_MUTATION_MARGIN),
    };
    return offspring;
}
function mutate(organism) {
    // we need to individually perform mutation for each of the genes
    // height first
    if (Math.random() < MUTATION_CHANCE) {
        organism.genes.radius = clamp(randomizeWithMargin(organism.genes.radius, RADIUS_MUTATION_MARGIN), MIN_RADIUS, MAX_RADIUS);
    }
    // damage
    if (Math.random() < MUTATION_CHANCE) {
        organism.genes.damage = clamp(randomizeWithMargin(organism.genes.damage, DAMAGE_MUTATION_MARGIN), MIN_DAMAGE, MAX_DAMAGE);
    }
    // armor
    if (Math.random() < MUTATION_CHANCE) {
        organism.genes.armor = clamp(randomizeWithMargin(organism.genes.armor, ARMOR_MUTATION_MARGIN), MIN_ARMOR, MAX_ARMOR);
    }
    // color
    organism.genes.color = {
        red: Math.random() < MUTATION_CHANCE ? getRandomInt(MIN_COLOR, MAX_COLOR) : organism.genes.color.red,
        green: Math.random() < MUTATION_CHANCE ? getRandomInt(MIN_COLOR, MAX_COLOR) : organism.genes.color.green,
        blue: Math.random() < MUTATION_CHANCE ? getRandomInt(MIN_COLOR, MAX_COLOR) : organism.genes.color.blue
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
view.style.position = "relative";
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
function distance(positionA, positionB) {
    return Math.sqrt(Math.pow(positionA.x - positionB.x, 2) + Math.pow(positionA.y - positionB.y, 2));
}
function checkCollision(shapeA, shapeB) {
    return distance(shapeA.position, shapeB.position) < shapeA.genes.radius + shapeB.genes.radius;
}
function fixCollision(shapeA, shapeB) {
    if (checkCollision(shapeA, shapeB)) {
        const m1 = shapeA.getArea();
        const m2 = shapeB.getArea();
        const normal = {
            x: shapeA.position.x - shapeB.position.x,
            y: shapeA.position.y - shapeB.position.y
        };
        const magnitude = distance(shapeA.position, shapeB.position);
        if (magnitude === 0) {
            throw new Error("Divide by 0 in physics calculation.");
        }
        const unitNormal = {
            x: normal.x / magnitude,
            y: normal.y / magnitude
        };
        const unitTangent = {
            x: -unitNormal.y,
            y: unitNormal.x
        };
        const v1n = unitNormal.x * shapeA.velocity.x + unitNormal.y * shapeA.velocity.y;
        const v1t = unitTangent.x * shapeA.velocity.x + unitTangent.y * shapeA.velocity.y;
        const v2n = unitNormal.x * shapeB.velocity.x + unitNormal.y * shapeB.velocity.y;
        const v2t = unitTangent.x * shapeB.velocity.x + unitTangent.y * shapeB.velocity.y;
        if (m1 + m2 === 0) {
            throw new Error("Divide by 0 in physics calculation.");
        }
        const v1nAfter = (v1n * (m1 - m2) + 2 * m2 * v2n) / (m1 + m2);
        const v2nAfter = (v2n * (m2 - m1) + 2 * m1 * v1n) / (m1 + m2);
        shapeA.velocity = {
            x: v1nAfter * unitNormal.x + v1t * unitTangent.x,
            y: v1nAfter * unitNormal.y + v1t * unitTangent.y,
        };
        shapeB.velocity = {
            x: v2nAfter * unitNormal.x + v2t * unitTangent.x,
            y: v2nAfter * unitNormal.y + v2t * unitTangent.y,
        };
    }
    return;
}
function applyDamage(attacker, victim) {
    // deal more dmg if high red content
    const maxDamageCoeffOffset = 1.5;
    const damageCoeff = 1 + (attacker.genes.color.red / MAX_COLOR) * maxDamageCoeffOffset;
    // more armor if high blue content
    const maxArmorCoeffOffset = 1.5;
    const armorCoeff = 1 + (victim.genes.color.blue / MAX_COLOR) * maxArmorCoeffOffset;
    victim.health -= (damageCoeff * attacker.genes.damage) / (armorCoeff * victim.genes.armor);
    if (victim.health === 0) {
        victim.isAlive = false;
        attacker.kills += 1;
    }
}
function stepFunction(model) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < model.population.length; i++) {
            if (model.population[i].health <= 0) {
                model.population[i].isAlive = false;
            }
            if (model.population[i].isAlive === false) {
                continue;
            }
            model.population[i].position.x += model.population[i].velocity.x;
            model.population[i].position.y += model.population[i].velocity.y;
            for (let j = i + 1; j < model.population.length; j++) {
                if (model.population[j].isAlive === false) {
                    continue;
                }
                if (checkCollision(model.population[i], model.population[j])) {
                    applyDamage(model.population[i], model.population[j]);
                    applyDamage(model.population[j], model.population[i]);
                }
                fixCollision(model.population[i], model.population[j]);
            }
            keepShapeInbounds(model.population[i], CANVAS_WIDTH, CANVAS_HEIGHT);
            // regen some health based on blue content
            const maxRegenCoeff = 0.00005;
            const regenCoeff = 1 + (model.population[i].genes.color.blue / MAX_COLOR) * maxRegenCoeff;
            model.population[i].health = Math.min(15, model.population[i].health * regenCoeff);
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
    const OPACITY = 0.5;
    clearCanvas(canvas);
    for (const organism of model.population) {
        if (organism.isAlive) {
            ctx.beginPath();
            ctx.fillStyle = `rgba(${organism.genes.color.red}, ${organism.genes.color.green}, ${organism.genes.color.blue}, ${OPACITY})`;
            ctx.arc(organism.position.x, organism.position.y, organism.genes.radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
            // draw the health
            ctx.font = "8px serif";
            ctx.fillStyle = `rgb(0, 0, 0)`;
            ctx.fillText(`♥️${Math.ceil(organism.health)}`, organism.position.x - 4, organism.position.y - (organism.genes.radius + 4));
            ctx.fillStyle = `rgb(255, 0, 0)`;
            ctx.fillText(`✸${Math.ceil(organism.genes.damage)}`, organism.position.x - 12, organism.position.y + organism.genes.radius + 10);
            ctx.fillStyle = `rgb(0, 0, 255)`;
            ctx.fillText(`🛡${Math.ceil(organism.genes.armor)}`, organism.position.x + 8, organism.position.y + organism.genes.radius + 10);
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
/**
 * CONTROLS here!
 */
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
title.innerText = "Circles of death";
title.style.position = "absolute";
title.style.left = "0px";
title.style.top = "0px";
title.style.padding = "0.25rem";
title.style.transform = "translateY(-100%)";
title.style.fontSize = "0.75rem";
view.appendChild(title);
view.appendChild(canvas);
view.appendChild(controls);
document.querySelector("#view").appendChild(view);
