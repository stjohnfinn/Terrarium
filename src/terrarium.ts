type stepFunctionType = (ecosystem: Ecosystem) => void;
type calculateFitnessType = (organism: Organism) => number;

class Organism {
  genes: {};

  constructor(genes: {}) {
    this.genes = genes
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
  step: FrameRequestCallback;

  // TODO: make this constructor handle everything beneath it and accept 
  // parameters for every class that it contains
  constructor(ecosystem: Ecosystem, stepFunction: stepFunctionType) {
    this.ecosystem = ecosystem;
    this.isRunning = false;
    this.step = () => {
      if (this.isRunning) {
        stepFunction(this.ecosystem);
        requestAnimationFrame(this.step);
      } else {
        console.log("Genetic algorithm is paused. Doing nothing for now...");
      }
    };
  }

  play() {
    this.isRunning = true;
    requestAnimationFrame(this.step);
  }

  pause() {
    this.isRunning = false;
  }
}
