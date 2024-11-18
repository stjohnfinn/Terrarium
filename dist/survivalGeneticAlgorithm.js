const MUTATION_CHANCE = 0.08;
const POPULATION_SIZE = 12;
const FRAME_DELAY = 40;
const CANVAS_HEIGHT = 250;
const CANVAS_WIDTH = 250;
// Survivor parameters
const NUM_ACTIONS = 300;
const MAX_HEALTH = 100;
const MAX_ENERGY = 100;
const MAX_HYDRATION = 100;
const RANDOM_POSITION_PADDING = CANVAS_HEIGHT * 0.05;
const VALID_ACTIONS = [
    "walkUp",
    "walkDown",
    "walkLeft",
    "walkRight",
    "attackUp",
    "attackDown",
    "attackLeft",
    "attackRight",
    "eat",
    "drink"
];
function randomValidAction() {
    return VALID_ACTIONS[getRandomInt(0, VALID_ACTIONS.length - 1)];
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
        this.genes.actions = [];
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
    }
    setPosition(x, y) {
        this.position.setX(x);
        this.position.setY(y);
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
    return organism.isAlive ? fitness : 0;
}
function stepFunction(model) {
    // iterate over every organism and perform the current action
    for (const survivor of model.population) {
        switch (survivor.genes.actions[survivor.currentActionIndex]) {
            case "walkUp":
                survivor.setPosition(survivor.position.getX(), survivor.position.getY() - 1);
                break;
            case "walkDown":
                survivor.setPosition(survivor.position.getX(), survivor.position.getY() + 1);
                break;
            case "walkLeft":
                survivor.setPosition(survivor.position.getX() - 1, survivor.position.getY());
                break;
            case "walkRight":
                survivor.setPosition(survivor.position.getX() + 1, survivor.position.getY());
                break;
            default:
                throw new Error("Undefined action encountered in organism's genes.");
                break;
        }
    }
    // check for death conditions
}
function crossover(parentA, parentB) {
    // regular crossover, nothing special
    let offspring = new SurvivorOrganism();
    for (let i = 0; i < offspring.genes.actions.length; i++) {
        if (Math.random() > 0.5) {
        }
    }
    return offspring;
}
export {};
