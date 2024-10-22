const MUTATION_CHANCE = 0.2;
class ShapeOrganism {
    constructor() {
        const randomHeight = getRandomInt(4, 20);
        const randomWidth = getRandomInt(4, 20);
        this.genes = {
            height: randomHeight,
            width: randomWidth,
            area: randomHeight * randomWidth,
            damage: getRandomInt(1, 4),
            armor: getRandomInt(2, 10),
            color: {
                red: getRandomInt(0, 255),
                green: getRandomInt(0, 255),
                blue: getRandomInt(0, 255)
            },
            position: {
                x: 0,
                y: 0
            },
        };
        this.mutationChance = MUTATION_CHANCE;
        this.health = 15,
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
    offspring.genes.height = randomizeWithMargin(getAverage(parentA.genes.height, parentB.genes.height), 3);
    offspring.genes.width = randomizeWithMargin(getAverage(parentA.genes.width, parentB.genes.width), 3);
    offspring.genes.area = offspring.genes.height * offspring.genes.width;
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
    let mutatedOrganism = structuredClone(organism);
    // we need to individually perform mutation for each of the genes
    // height first
    if (Math.random() < MUTATION_CHANCE) {
        mutatedOrganism.genes.height = clamp(randomizeWithMargin(mutatedOrganism.genes.height, 3), 4, 20);
    }
    // width next
    if (Math.random() < MUTATION_CHANCE) {
        mutatedOrganism.genes.width = clamp(randomizeWithMargin(mutatedOrganism.genes.width, 3), 4, 20);
    }
    // damage
    if (Math.random() < MUTATION_CHANCE) {
        mutatedOrganism.genes.damage = clamp(randomizeWithMargin(mutatedOrganism.genes.damage, 1), 1, 4);
    }
    // armor
    if (Math.random() < MUTATION_CHANCE) {
        mutatedOrganism.genes.armor = clamp(randomizeWithMargin(mutatedOrganism.genes.damage, 3), 1, 10);
    }
    // color
    mutatedOrganism.genes.color = {
        red: Math.random() < MUTATION_CHANCE ? getRandomInt(0, 255) : mutatedOrganism.genes.color.red,
        green: Math.random() < MUTATION_CHANCE ? getRandomInt(0, 255) : mutatedOrganism.genes.color.green,
        blue: Math.random() < MUTATION_CHANCE ? getRandomInt(0, 255) : mutatedOrganism.genes.color.blue
    };
    return mutatedOrganism;
}
function shouldTerminate(model) {
    return false;
}
function shouldProgressGeneration(model) {
    let aliveCountgtOne = model.population.reduce((accumulator, currentValue) => accumulator + Number(currentValue.isAlive), 0) <= 1;
    return aliveCountgtOne;
}
/**
 * DISPLAY LOGIC
 */
let view = document.createElement("div");
view.style.display = "flex";
view.style.alignItems = "center";
view.style.justifyContent = "space-evenly";
document.querySelector("#view").appendChild(view);
let canvas = document.createElement("canvas");
canvas.height = 250;
canvas.width = 250;
canvas.style.border = "1px dashed lightblue";
view.appendChild(canvas);
const ctx = canvas.getContext("2d");
function clearCanvas(cv, color = "rgb(255, 255, 255)") {
    cv.getContext("2d").fillStyle = color;
    cv.getContext("2d").fillRect(0, 0, cv.width, cv.height);
}
let square = {
    position: {
        x: 40,
        y: 20
    },
    velocity: {
        x: 1,
        y: 1
    }
};
function keepInbound(shape, width, height) {
    if (shape.position.x + 5 >= width) {
        shape.position.x -= 1;
        shape.velocity.x = -shape.velocity.x;
    }
    if (shape.position.x - 5 <= 0) {
        shape.position.x += 1;
        shape.velocity.x = -shape.velocity.x;
    }
    if (shape.position.y + 5 >= height) {
        shape.position.y -= 1;
        shape.velocity.y = -shape.velocity.y;
    }
    if (shape.position.y - 5 <= 0) {
        shape.position.y += 1;
        shape.velocity.y = -shape.velocity.y;
    }
    console.log(shape.position);
}
function draw() {
    clearCanvas(canvas);
    square.position.x += square.velocity.x;
    square.position.y += square.velocity.y;
    keepInbound(square, canvas.width, canvas.height);
    console.log(square.position.x);
    ctx.fillStyle = "rgb(0, 0, 0, 0.5)";
    ctx.fillRect(square.position.x, square.position.y, 10, 10);
    requestAnimationFrame(draw);
}
draw();
/**
 * REAL MEAT OF THIS ALL
 *
 * this is all of the really important stuff
 */
function stepFunction(model) {
    let newModel = structuredClone(model);
    return newModel;
}
export {};
