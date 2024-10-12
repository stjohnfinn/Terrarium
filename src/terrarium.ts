/*******************************************************************************
 * terrarium.js
 * 
 * Purpose: defines the main classes that make up the framework.
 */

/**
 * Organism
 * 
 * Purpose: defines the type for a single member of a genetic algorithm's 
 * population. The only assumption we make is that it has genes.
 */
interface Organism<T> {
  genes: T;
}

/**
 * GeneticAlgorithmModel
 * 
 * Purpose: it's basically the model in the MVC design pattern. it's the "state"
 * of the genetic algorithm at any moment.
 */
interface GeneticAlgorithmModel<T> {
  populationSize: number;
  mutationRate: number;
  generation: number;
  population: T[];
}

class GeneticAlgorithm<T> {
  stepFunction: (model: GeneticAlgorithmModel<T>) => void;
  shouldTerminate: (model: GeneticAlgorithmModel<T>) => boolean;
  createOrganism: () => T;
  calculateFitness: (organism: T) => number;
  crossover: (parentA: T, parentB: T) => T;
  mutate: (organism: T) => T;
  
  model: GeneticAlgorithmModel<T>;
  isRunning: boolean;

  constructor(
    // class methods
    createOrganism: () => T,
    stepFunction: (model: GeneticAlgorithmModel<T>) => void,
    calculateFitness: (organism: T) => number,
    crossover: (parentA: T, parentB: T) => T,
    mutate: (organism: T) => T,
    // this is shouldTerminateEntireThing, not shouldTerminateGeneration because
    // shouldTerminateGeneration is handled inside the user-defined stepFunction
    shouldTerminate: (model: GeneticAlgorithmModel<T>) => boolean,
    // properties
    populationSize: number = 50,
    mutationRate: number = 0.02) {

    // input validation ********************************************************
    if (mutationRate < 0 || mutationRate > 1) {
      throw new Error("mutationRate must be a value between 0 and 1. Conceptually, it's a percentage in decimal form.");
    }

    // initialize the model ****************************************************
    this.model = {
      populationSize: populationSize,
      mutationRate: mutationRate,
      generation: 0,
      population: [],
    }

    // methods *****************************************************************
    this.createOrganism = createOrganism;
    this.shouldTerminate = shouldTerminate;
    this.stepFunction = stepFunction;
    this.calculateFitness = calculateFitness;
    this.crossover = crossover;
    this.mutate = mutate;

    // member variables ********************************************************
    this.isRunning = false;
    
    // generate new population *************************************************
    for (let i = 0; i < this.model.populationSize; i++) {
      this.model.population.push(this.createOrganism());
    }

    /**
     * We aren't calling this.play() in here because it's on the user to 
     * initialize the genetic algorithm object and then start it whenever they
     * want.
     */
  }

  step(): void {
    // this block must come before any block that calls next()
    if (this.isRunning === false) {
      // we should NOT continue the loop, so let's just exit
      return;
    }

    // we're still running the genetic algorithm, so go to the next frame
    if (this.isRunning) {
      this.next();
    }

    if (this.shouldTerminate(this.model)) {
      // the genetic algorithm is completely finished, so let's stop
      this.isRunning = false;
    }
  }

  /**
   * This is abstracted only because it's a weird looking block and it was in
   * two places in this code and I don't really want to have to look at it.
   * 
   * next()
   * 
   * Purpose: add the step function to the JavaScript animation loop queue. Read
   * up more on requestAnimationFrame docs for more information.
   */
  next(): void {
    requestAnimationFrame(() => {
      this.step();
    });
  }

  /**
   * play()
   * 
   * Purpose: super abstract way to just be like "hey I want to start the 
   * algorithm".
   */
  play(): void {
    this.isRunning = true;

    this.next();
  }

  pause(): void {
    this.isRunning = false;
  }
}