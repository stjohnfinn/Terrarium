var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class GeneticAlgorithm {
    constructor(config) {
        this.config = config;
        this.generation = 0;
        this.population = this.initializePopulation();
    }
    initializePopulation() {
        return Array.from({ length: this.config.populationSize }, () => {
            const genes = this.config.createIndividual();
            return {
                genes,
                fitness: this.config.calculateFitness(genes)
            };
        });
    }
    step() {
        // Create next generation
        const newPopulation = [];
        while (newPopulation.length < this.config.populationSize) {
            // Select parents using tournament selection
            const parent1 = this.tournamentSelect();
            const parent2 = this.tournamentSelect();
            // Create offspring
            let offspring = this.config.crossover(parent1.genes, parent2.genes);
            // Possibly mutate
            if (Math.random() < this.config.mutationRate) {
                offspring = this.config.mutate(offspring);
            }
            // Add to new population
            newPopulation.push({
                genes: offspring,
                fitness: this.config.calculateFitness(offspring)
            });
        }
        this.population = newPopulation;
        this.generation++;
    }
    tournamentSelect(tournamentSize = 3) {
        let best = null;
        for (let i = 0; i < tournamentSize; i++) {
            const contestant = this.population[Math.floor(Math.random() * this.population.length)];
            if (!best || contestant.fitness > best.fitness) {
                best = contestant;
            }
        }
        return best;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            while (!this.shouldTerminate()) {
                this.step();
                // Optional: Add a small delay to prevent blocking
                yield new Promise(resolve => setTimeout(resolve, 0));
            }
        });
    }
    shouldTerminate() {
        var _a, _b;
        if ((_b = (_a = this.config).terminationCondition) === null || _b === void 0 ? void 0 : _b.call(_a, this.population, this.generation)) {
            return true;
        }
        if (this.config.maxGenerations && this.generation >= this.config.maxGenerations) {
            return true;
        }
        return false;
    }
    // Getter methods for monitoring progress
    getBestIndividual() {
        return [...this.population].sort((a, b) => b.fitness - a.fitness)[0];
    }
    getGeneration() {
        return this.generation;
    }
    getAverageFitness() {
        return this.population.reduce((sum, ind) => sum + ind.fitness, 0) / this.population.length;
    }
}
