const CHARS = "abcdefghijklmnopqrstuvwxyz";
const TARGET_STRING = "icebreaker exotic sniper rifle";
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
let playButton = document.createElement("button");
document.querySelector("body").appendChild(playButton);
playButton.innerText = "play";
playButton.addEventListener("click", () => {
    geneticAlgorithm.play();
});
let pauseButton = document.createElement("button");
document.querySelector("body").appendChild(pauseButton);
pauseButton.innerText = "pause";
pauseButton.addEventListener("click", () => {
    geneticAlgorithm.pause();
});
/**
 * TESTING AREA ################################################################
 */
let objectA = {
    genes: {
        letters: "uiogioweogiw",
        size: 124,
        position: {
            x: 10,
            y: 15
        }
    }
};
let objectB = {
    genes: {
        letters: "awdaacwawc",
        size: 1235,
        position: {
            x: 10,
            y: 20,
        }
    }
};
let objectC = {
    genes: {
        letters: "axxxx",
        size: "awd",
        position: {
            x: 12
        }
    }
};
/**
 * congruent()
 *
 * Purpose: determine if two organisms are congruent, where "congruent" is
 * defined as having the same general "shape" as another organism. This function
 * cannot handle checking this for every single type in existence, but we check
 * for some common ones.
 *
 * This function signature needs to be changed to expect Organism<{}> type
 * arguments.
 */
function congruent(a, b) {
    let areCongruent = true;
    // simple type check
    if (typeof a.genes != typeof b.genes) {
        areCongruent = false;
    }
    // they should be objects, so check to make sure the keys are at least equal
    if (Object.keys(objectA.genes) != Object.keys(objectB.genes)) {
        console.log(Object.keys(objectA.genes));
        console.log(Object.keys(objectB.genes));
        areCongruent = false;
    }
    return areCongruent;
}
if (!congruent(objectA, objectB)) {
    throw new Error("objects are different!");
}
if (congruent(objectA, objectC)) {
    throw new Error("object are similar!");
}
