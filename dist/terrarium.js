class Organism {
    constructor(genes, mutationChance = 0.05) {
        this.genes = genes;
        this.mutationChance = mutationChance;
    }
}
class Ecosystem {
    constructor(population, calculateFitness) {
        this.populationSize = population.length;
        this.population = population;
        this.calculateFitness = calculateFitness;
    }
}
class GeneticAlgorithm {
    constructor(ecosystem, stepFunction) {
        this.ecosystem = ecosystem;
        this.isRunning = false;
        this.stepFunction = stepFunction;
    }
    step() {
        if (this.isRunning) {
            // if the algorithm is running, proceed to the next frame
            this.stepFunction(this.ecosystem);
            requestAnimationFrame(this.step);
        }
        else {
            console.log("Genetic algorithm is paused. Doing nothing for now...");
        }
    }
    play() {
        if (!this.isRunning) {
            this.isRunning = true;
            requestAnimationFrame(this.step);
        }
    }
    pause() {
        if (this.isRunning) {
            this.isRunning = false;
        }
    }
}
