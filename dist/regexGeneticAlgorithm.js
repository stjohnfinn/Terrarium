const MUTATION_CHANCE = 0.05;
const POPULATION_SIZE = 30;
const FRAME_DELAY = 0;
const CANVAS_HEIGHT = 250;
const CANVAS_WIDTH = 250;
const TARGET_STRING = "0100028b3uehawoxawd";
class RegexOrganism {
    constructor() {
        // genes are just all valid regex characters
    }
}
function createOrganism() {
    return new RegexOrganism();
}
function calculateFitness() {
    // how well does the string match the target string
    // remove all trailing whitespace maybe?
    // reward a shorter string (more efficient regex)
    // should be punished for a faulty, invalid regex
    return 0;
}
function crossover() {
    // need claude to help with this probably
    // simples way will be to just return parentA or parentB based on fitness
}
function mutate() {
    // need claude to help with this as well
    // might just be as simple as replacing a random character with another random
    // possible valid regex character
}
function shouldProgressGeneration() {
    return true;
}
function shouldTerminate() {
    return false;
}
function stepFunction() {
    return;
}
export {};
