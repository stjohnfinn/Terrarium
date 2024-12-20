import { GeneticAlgorithm } from "./terrarium.js";
const MUTATION_CHANCE = 0.08;
const POPULATION_SIZE = 12;
const FRAME_DELAY = 40;
const CANVAS_HEIGHT = 250;
const CANVAS_WIDTH = 250;
const TARGET_STRING = "bark 183  ababgg";
// should include all valid regex characters, and a space
const SPECIAL_REGEX_CHARS = ".^&*+?{}[]\\|() ";
const STANDARD_REGEX_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const ALLOWED_CHARS = SPECIAL_REGEX_CHARS + STANDARD_REGEX_CHARS;
class RegexOrganism {
    constructor() {
        // genes are just all valid regex characters
        this.genes = "";
        for (let i = 0; i < TARGET_STRING.length * 2; i++) {
            const randomIndex = Math.floor(Math.random() * ALLOWED_CHARS.length);
            this.genes += ALLOWED_CHARS[randomIndex];
        }
        this.mutationChance = MUTATION_CHANCE;
    }
}
function createOrganism() {
    return new RegexOrganism();
}
function calculateFitness(organism) {
    let fitness = 0;
    try {
        const regex = new RegExp(organism.genes.trim());
        const match = TARGET_STRING.match(regex);
        fitness += match[0].length / TARGET_STRING.length;
        // reward a shorter string (more efficient regex)
        fitness = fitness / organism.genes.trim().length;
        return fitness;
    }
    catch (_a) {
        return 0;
    }
}
function crossover(parentA, parentB) {
    // let offspring: RegexOrganism = structuredClone(parentA);
    // for (let i = 0; i < offspring.genes.length; i++) {
    //   if (Math.random() > 0.5) {
    //     offspring.genes = offspring.genes.slice(0, i) + parentB.genes[i] + offspring.genes.slice(i + 1);
    //   }
    // }
    // return offspring;
    return structuredClone(Math.random() > 0.5 ? parentA : parentB);
}
function mutate(organism) {
    // need claude to help with this as well
    // might just be as simple as replacing a random character with another random
    // possible valid regex character
    for (let i = 0; i < organism.genes.length; i++) {
        if (Math.random() < MUTATION_CHANCE) {
            const randomIndex = Math.floor(Math.random() * ALLOWED_CHARS.length);
            organism.genes = organism.genes.slice(0, i) + ALLOWED_CHARS[randomIndex] + organism.genes.slice(i + 1);
        }
    }
    return organism;
}
function shouldProgressGeneration(model) {
    return true;
}
function shouldTerminate(model) {
    return false;
}
function stepFunction(model) {
    return;
}
let geneticAlgorithm = new GeneticAlgorithm(createOrganism, stepFunction, calculateFitness, crossover, mutate, shouldTerminate, shouldProgressGeneration, POPULATION_SIZE, false, FRAME_DELAY);
/*******************************************************************************
 * VIEW LOGIC
 ******************************************************************************/
let environment = document.createElement("div");
environment.style.display = "grid";
environment.style.gridTemplateColumns = "1fr 1fr";
environment.style.gap = "0.5rem";
environment.style.overflowY = "scroll";
environment.style.justifyItems = "center";
environment.style.fontSize = "0.5rem";
environment.style.width = "100%";
environment.style.height = "200px";
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
let targetWordElement = document.createElement("p");
targetWordElement.innerText = `Target: "${TARGET_STRING}"`;
let averageFitnessElement = document.createElement("p");
averageFitnessElement.innerText = "Average fitness: 0";
let view = document.createElement("div");
view.appendChild(targetWordElement);
view.appendChild(averageFitnessElement);
view.appendChild(environment);
view.appendChild(controls);
view.style.display = "flex";
view.style.flexDirection = "column";
view.style.alignItems = "center";
view.style.gap = "1rem";
view.style.justifyContent = "space-between";
view.style.position = "relative";
let title = document.createElement("p");
title.innerText = "Regex";
title.style.position = "absolute";
title.style.left = "0px";
title.style.top = "0px";
title.style.padding = "0.25rem";
title.style.transform = "translateY(-100%)";
title.style.fontSize = "0.75rem";
view.appendChild(title);
document.querySelector("#view").appendChild(view);
function displayWordGeneticAlgorithm(model) {
    environment.innerHTML = "";
    for (const word of model.population) {
        let wordElement = document.createElement("p");
        wordElement.innerText = String(word.genes);
        wordElement.style.fontFamily = "monospace";
        environment.appendChild(wordElement);
    }
    requestAnimationFrame(() => {
        displayWordGeneticAlgorithm(geneticAlgorithm.model);
    });
}
displayWordGeneticAlgorithm(geneticAlgorithm.model);
setInterval(() => {
    averageFitnessElement.innerText = `Average fitness: ${Math.trunc((geneticAlgorithm.model.population.reduce((sum, organism) => sum + calculateFitness(organism), 0) / geneticAlgorithm.model.population.length) * 10000)}`;
}, 300);
