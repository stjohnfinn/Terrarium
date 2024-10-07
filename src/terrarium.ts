type stepFunctionType = (ecosystem: Ecosystem) => void;
type calculateFitnessType = (organism: Organism) => number;

class Organism {
  genes: {};
  mutationChance: number;

  constructor(genes: {}, mutationChance = 0.05) {
    this.genes = genes;
    this.mutationChance = mutationChance;
  }  
}  

class Ecosystem {
  population: Organism[];
  populationSize: number;
  calculateFitness: calculateFitnessType;

  constructor(population: Organism[], calculateFitness: calculateFitnessType) {
    this.populationSize = population.length;
    this.population = population;
    this.calculateFitness = calculateFitness;
  }  
}  

class GeneticAlgorithm {
  ecosystem: Ecosystem;
  isRunning: boolean;
  stepFunction: stepFunctionType;

  constructor(ecosystem: Ecosystem, stepFunction: stepFunctionType) {
    this.ecosystem = ecosystem;
    this.isRunning = false;
    this.stepFunction = stepFunction;
  }

  step() {
    if (this.isRunning) {
      // if the algorithm is running, proceed to the next frame
      this.stepFunction(this.ecosystem);
      requestAnimationFrame(this.step);
    } else {
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
