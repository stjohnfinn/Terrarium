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
  mutationChance: number;
}

/**
 * GeneticAlgorithmModel
 * 
 * Purpose: it's basically the model in the MVC design pattern. it's the "state"
 * of the genetic algorithm at any moment.
 */
interface GeneticAlgorithmModel<T> {
  populationSize: number;
  generation: number;
  population: T[];
}

class GeneticAlgorithm<T> {
  stepFunction: (model: GeneticAlgorithmModel<T>) => void;
  shouldTerminate: (model: GeneticAlgorithmModel<T>) => boolean;
  shouldProgressGeneration: (model: GeneticAlgorithmModel<T>) => boolean;
  produceNextGeneration: (model: GeneticAlgorithmModel<T>) => GeneticAlgorithmModel<T>;
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
    shouldTerminate: (model: GeneticAlgorithmModel<T>) => boolean,
    shouldProgressGeneration: (model: GeneticAlgorithmModel<T>) => boolean,
    // this is super ugly, but I decided it was the best method for having a 
    // default value.
    produceNextGeneration: (model: GeneticAlgorithmModel<T>) => GeneticAlgorithmModel<T> = (model: GeneticAlgorithmModel<T>) => {
      let newModel = structuredClone(model);
      newModel.generation++;

      // find two best parents
      const sortedPopulation: T[] = newModel.population.sort((a, b) => {
        return this.calculateFitness(b) - this.calculateFitness(a);
      });

      const parentA: T = sortedPopulation[0];
      const parentB: T = sortedPopulation[1];

      // perform crossover
      newModel.population = [];
      for (let i: number = 0; i < newModel.populationSize; i++) {
        newModel.population.push(this.crossover(parentA, parentB));
      }

      // mutation
      for (let i: number = 0; i < newModel.populationSize; i++) {
        newModel.population[i] = this.mutate(newModel.population[i]);
      }

      return newModel;
    },
    // properties
    populationSize: number = 50) {

    // initialize the model ****************************************************
    this.model = {
      populationSize: populationSize,
      generation: 0,
      population: [],
    }

    // methods *****************************************************************
    this.createOrganism = createOrganism;
    this.shouldTerminate = shouldTerminate;
    this.shouldProgressGeneration = shouldProgressGeneration;
    this.produceNextGeneration = produceNextGeneration;
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
    if (this.shouldTerminate(this.model)) {
      // the genetic algorithm is completely finished, so let's stop
      this.isRunning = false;
    }

    // this block must come before any block that calls next()
    if (this.isRunning === false) {
      // we should NOT continue the loop, so let's just exit
      return;
    }
    
    // generation is finished, lets create offspring and mutate
    if (this.shouldProgressGeneration(this.model)) {
      this.model = this.produceNextGeneration(this.model);
    }

    // we're still running the genetic algorithm, so go to the next frame
    if (this.isRunning) {
      this.next();
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
