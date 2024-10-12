/*******************************************************************************
 * terrarium.js
 * 
 * Purpose: defines the main classes that make up the framework.
 */

interface Organism<T> {
  genes: T;
}

interface GeneticAlgorithmModel<T> {
  calculateFitness: (organism: T) => number;
  createOrganism: () => T;
  crossover: (parentA: T, parentB: T) => T;
  mutate: (organism: T) => T;

  populationSize: number;
  mutationRate: number;
  generation: number;
  population: T[];
}

class GeneticAlgorithm<T> {
  stepFunction: (model: GeneticAlgorithmModel<T>) => void;
  shouldTerminate: (model: GeneticAlgorithmModel<T>) => boolean;
  
  model: GeneticAlgorithmModel<T>;
  isRunning: boolean;

  constructor(model: GeneticAlgorithmModel<T>, shouldTerminate: (model: GeneticAlgorithmModel<T>) => boolean) {
    this.model = model;
    this.shouldTerminate = shouldTerminate;
    this.isRunning = false;
    
    // generate new population
    for (let i = 0; i < this.model.populationSize; i++) {
      this.model.population.push(this.model.createOrganism());
    }
  }

  step(): void {
    if (this.shouldTerminate(this.model)) {
      this.isRunning = false;
      console.log("Finished!");
    }

    if (this.isRunning) {
      requestAnimationFrame(() => {
        this.stepFunction(this.model);
      });
    }
  }

  play(): void {
    this.isRunning = true;
  }

  pause(): void {
    this.isRunning = false;
  }
}