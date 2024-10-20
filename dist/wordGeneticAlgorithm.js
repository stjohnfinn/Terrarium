const CHARS = "abcdefghijklmnopqrstuvwxyz ";
const TARGET_STRING = "rice and weird";
const TARGET_STRING_LENGTH = TARGET_STRING.length;
const mutationChance = 0.02;
class WordOrganism {
    constructor() {
        this.genes = "";
    }
}
function createOrganism() {
    let newOrganism = new WordOrganism();
    for (let i = 0; i < TARGET_STRING_LENGTH; i++) {
        newOrganism.genes += CHARS[Math.floor(Math.random() * CHARS.length)];
    }
    newOrganism.mutationChance = mutationChance;
    return newOrganism;
}
function crossover(parentA, parentB) {
    let offspring = structuredClone(parentA);
    for (let i = 0; i < offspring.genes.length; i++) {
        if (Math.random() > 0.5) {
            offspring.genes = offspring.genes.substring(0, i) + parentB.genes[i] + offspring.genes.substring(i + 1);
        }
        if (offspring.genes.length != parentA.genes.length) {
            console.log(offspring);
            console.log(parentA);
            throw new Error("Crossover has created an organism that is a different species.");
        }
    }
    return offspring;
}
function calculateFitness(organism) {
    let totalLettersCorrect = 0;
    for (let i = 0; i < organism.genes.length; i++) {
        if (organism.genes[i] === TARGET_STRING[i]) {
            totalLettersCorrect++;
        }
    }
    return totalLettersCorrect / TARGET_STRING_LENGTH;
}
function mutate(organism) {
    let mutatedOrganism = structuredClone(organism);
    for (let i = 0; i < mutatedOrganism.genes.length; i++) {
        let shouldMutate = Math.random() < mutatedOrganism.mutationChance;
        if (shouldMutate) {
            let mutatedGene = CHARS[Math.floor(Math.random() * CHARS.length)];
            mutatedOrganism.genes = mutatedOrganism.genes.substring(0, i) + mutatedGene + mutatedOrganism.genes.substring(i + 1);
        }
    }
    if (mutatedOrganism.genes.length != organism.genes.length) {
        throw new Error("Mutation has created an organism that is a different species.");
    }
    return mutatedOrganism;
}
function shouldTerminate(model) {
    let targetStringFound = false;
    for (let i = 0; i < model.populationSize; i++) {
        if (model.population[i].genes == TARGET_STRING) {
            targetStringFound = true;
            console.log("Match found!");
            console.log(model.population[i]);
        }
    }
    return targetStringFound;
}
function shouldProgressGeneration(model) {
    console.log("New generation!");
    return true;
}
function stepFunction(model) {
    return;
}
let geneticAlgorithm = new GeneticAlgorithm(createOrganism, stepFunction, calculateFitness, crossover, mutate, shouldTerminate, shouldProgressGeneration);
console.log(geneticAlgorithm);
let environment = document.createElement("div");
environment.style.display = "grid";
environment.style.gridTemplateColumns = "1fr 1fr 1fr 1fr";
environment.style.gap = "0.5rem";
environment.style.overflowY = "scroll";
environment.style.justifyItems = "center";
environment.style.fontSize = "0.5rem";
environment.style.width = "100%";
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
let controls = document.createElement("div");
controls.appendChild(playButton);
controls.appendChild(pauseButton);
controls.style.display = "flex";
controls.style.flexDirection = "row";
controls.style.alignItems = "flex-start";
controls.style.justifyContent = "space-evenly";
controls.style.width = "100%";
let view = document.createElement("div");
view.appendChild(controls);
view.appendChild(environment);
view.style.display = "flex";
view.style.flexDirection = "column";
view.style.alignItems = "center";
view.style.gap = "1rem";
document.querySelector("#view").appendChild(view);
function displayWordGeneticAlgorithm(model) {
    environment.innerHTML = "";
    for (const word of model.population) {
        let wordElement = document.createElement("p");
        wordElement.innerText = String(word.genes);
        environment.appendChild(wordElement);
        if (word.genes == TARGET_STRING) {
            wordElement.style.color = "green";
        }
    }
    requestAnimationFrame(() => {
        displayWordGeneticAlgorithm(geneticAlgorithm.model);
    });
}
displayWordGeneticAlgorithm(geneticAlgorithm.model);
