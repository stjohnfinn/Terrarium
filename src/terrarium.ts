/*******************************************************************************
 * terrarium.js
 * 
 * Defines the main classes and interfaces that make up the framework.
 */

/**
 * Defines the type for a single member of a genetic algorithm's 
 * population. The only assumption we make is that it has genes.
 * 
 * `genes`: the value of this member variable represents the 
 * organism's genes.
 * 
 * `mutationChance`: the chance for each gene to mutate when 
 * offspring are created.
 */
export interface Organism {
  genes: unknown;
  mutationChance: number;
}

/**
 * The "model" that represents the state of a genetic algorithm at any given 
 * moment.
 */
export interface GeneticAlgorithmModel<TOrganism extends Organism> {
  populationSize: number;
  generation: number;
  population: TOrganism[];
  frameCountSinceGenStart: number;
}

/**
 * The "controller" that manages a genetic algorithm model. This class handles
 * the flow of the genetic algorithm from start to finish, from frame to frame,
 * and from generation to generation.
 */
export class GeneticAlgorithm<TOrganism extends Organism> {
  /**
   * Progresses a genetic algorithm model to it's next frame.
   * 
   * @param model - the GeneticAlgorithmModel that the step function should
   * progress.
   */
  private stepFunction: (model: GeneticAlgorithmModel<TOrganism>) => void;
  /**
   * checks if the genetic algorithm should stop running
   * 
   * @param model - the GeneticAlgorithmModel that should be checked.
   * 
   * @returns a boolean value that represents a yes or no answer to "should 
   * this genetic algorithm terminate?". 
   */
  private shouldTerminate: (model: GeneticAlgorithmModel<TOrganism>) => boolean;
  /**
   * checks if the genetic algorithm should progress to the next generation
   * 
   * @param model - the GeneticAlgorithmModel that should be checked.
   * 
   * @returns a boolean value that represents a yes or no answer to "should 
   * this genetic algorithm progress to the next generation?".
   */
  private shouldProgressGeneration: (model: GeneticAlgorithmModel<TOrganism>) => boolean;
  /**
   * this function is called to produce the next generation after a generation
   * ends.
   * 
   * @param model - the GeneticAlgorithmModel that serves as the starting point.
   * 
   * @returns a GeneticAlgorithmModel that has the new generation.
   */
  private produceNextGeneration: (model: GeneticAlgorithmModel<TOrganism>) => GeneticAlgorithmModel<TOrganism>;
  /**
   * used to create the firstGeneration and optionally, used in more places than
   * that (but that's up to user's discretion).
   * 
   * @returns a completely new Organism.
   */
  private createOrganism: () => TOrganism;
  /**
   * calculates the fitness of a single organism.
   * 
   * @param organism - the organism that should be analyzed.
   * 
   * @returns - the number value of the organism's fitness
   */
  private calculateFitness: (organism: TOrganism) => number;
  /**
   * performs "reproduction" of two organisms, producing a single offspring
   * 
   * @param parentA - the first parent organism
   * @param parentB - the second parent organism
   * 
   * @returns the child organism
   */
  private crossover: (parentA: TOrganism, parentB: TOrganism) => TOrganism;
  /**
   * mutates a single organism
   * 
   * @param organism - the organism that should be mutated
   * 
   * @returns the mutated organism
   */
  private mutate: (organism: TOrganism) => TOrganism;
  
  /**
   * model - the GeneticAlgorithmModel that this object manages.
   */
  model: GeneticAlgorithmModel<TOrganism>;
  /**
   * isRunning - represents the "running" state of the genetic algorithm at the 
   * moment.
   */
  private isRunning: boolean;
  /**
   * debug - enables or disables logging.
   */
  private debug: boolean;

  /**
   * frameDelayMilliseconds - time in milliseconds between each "step"
   */
  private frameDelayMilliseconds: number;

  /**
   * 
   * @param createOrganism user-defined function that will be used as the 
   * class's createOrganism function
   * @param stepFunction user-defined function that will be used as the 
   * objects's stepFunction function
   * @param calculateFitness user-defined function that will be used as the 
   * object's calculateFitness function
   * @param crossover user-defined function that will be used as the object's
   * crossover function
   * @param mutate user-defined function that will be used as the object's 
   * mutate function
   * @param shouldTerminate user-defined function that will be used as the 
   * object's shouldTerminate function 
   * @param shouldProgressGeneration user-defined function that will be used as 
   * the object's shouldProgressGeneration function
   * @param produceNextGeneration user-defined function that will be used as the
   * object's produceNextGeneration function
   * @param populationSize the number of organisms that the first generation
   * will start with
   */
  constructor(
    // class methods
    createOrganism: () => TOrganism,
    stepFunction: (model: GeneticAlgorithmModel<TOrganism>) => void,
    calculateFitness: (organism: TOrganism) => number,
    crossover: (parentA: TOrganism, parentB: TOrganism) => TOrganism,
    mutate: (organism: TOrganism) => TOrganism,
    shouldTerminate: (model: GeneticAlgorithmModel<TOrganism>) => boolean,
    shouldProgressGeneration: (model: GeneticAlgorithmModel<TOrganism>) => boolean,
    populationSize: number = 50,
    debug: boolean = false,
    frameDelayMilliseconds: number = 0,
    // this is super ugly, but I decided it was the best method for having a 
    // default value.
    produceNextGeneration?: (model: GeneticAlgorithmModel<TOrganism>) => GeneticAlgorithmModel<TOrganism>) {

    // initialize the model ****************************************************
    this.model = {
      populationSize: populationSize,
      generation: 0,
      population: [],
      frameCountSinceGenStart: 0
    }

    // methods *****************************************************************
    this.createOrganism = createOrganism;
    this.shouldTerminate = shouldTerminate;
    this.shouldProgressGeneration = shouldProgressGeneration;
    this.stepFunction = stepFunction;
    this.calculateFitness = calculateFitness;
    this.crossover = crossover;
    this.mutate = mutate;
    this.produceNextGeneration = produceNextGeneration ?? this.prefabs.produceNextGeneration.standard.bind(this);

    // member variables ********************************************************
    this.debug = debug;
    this.isRunning = false;
    this.frameDelayMilliseconds = frameDelayMilliseconds;
    
    // generate new population *************************************************
    this.initializePopulation();

    /**
     * We aren't calling this.play() in here because it's on the user to 
     * initialize the genetic algorithm object and then start it whenever they
     * want.
     */

    this.log("Here's the model:");
    this.log(this.model);
  }

  /**
   * this function handles the progression & flow of the genetic algorithm. it 
   * progresses from frame to frame, generation to generation, and stops running
   * if that's appropriate.
   * 
   * @returns nothing
   */
  private async step(): Promise<void> {
    this.log("model right now:");
    this.log(this.model);

    if (this.isRunning) {
      this.log("progressing to the next frame.");
      this.log(`current frame count: ${this.model.frameCountSinceGenStart}`);
      this.model.frameCountSinceGenStart += 1;
      this.stepFunction(this.model);
      await new Promise(r => setTimeout(r, this.frameDelayMilliseconds));
      this.next();
    }

    if (this.shouldTerminate(this.model)) {
      // the genetic algorithm is completely finished, so let's stop
      this.isRunning = false;
      this.log("determined the GA should stop here.");
    }

    // this block must come before any block that calls next()
    if (this.isRunning === false) {
      this.log("the GA is not running right now, exiting game loop.");
      // we should NOT continue the loop, so let's just exit
      return;
    }
    
    // generation is finished, lets create offspring and mutate
    if (this.shouldProgressGeneration(this.model)) {
      this.log("progressing to the next generation.");
      this.model.frameCountSinceGenStart = 0;
      this.model = this.produceNextGeneration(this.model);
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
  private next(): void {
    this.log("adding the step function to the requestAnimationFrame queue.");
    requestAnimationFrame(() => {
      this.step();
    });
  }

  /**
   * Adds `populationSize` organisms to the model's population array using the 
   * user-defined `createOrganism` function.
   * 
   * This code was used raw in the constructor, then it was put into a function
   * so that there is a "reset" function.
   */
  private initializePopulation(): void {
    this.log("initializing the population.");
    this.model.population = [];
    for (let i = 0; i < this.model.populationSize; i++) {
      this.model.population.push(this.createOrganism());
    }
  }

  /**
   * Purpose: super abstract way to just be like "hey I want to start the 
   * algorithm".
   */
  play(): void {
    this.log("trying to start the GA.");
    if (!this.isRunning) {
      this.isRunning = true;

      this.next();
    }
  }

  /**
   * pauses the genetic algorithm.
   */
  pause(): void {
    this.log("stopping the GA.");
    this.isRunning = false;
  }

  reset(): void {
    this.log("stopping and resetting the GA.");

    this.pause();
    requestAnimationFrame(() => {
      this.initializePopulation();
    });
  }

  /**
   * can be used to log content to the console, only actually logs stuff if the
   * `debug` variable is `true`.
   * 
   * @param message content that should be logged to the console
   */
  log(message: unknown): void {
    if (this.debug) {
      console.log(message);
    }
  }

  /**
   * returns the model's population property
   */
  getPopulation(): TOrganism[] {
    return this.model.population;
  }

  private readonly prefabs = {
    produceNextGeneration: {
      /**
       * performs pretty basic stuff to produce a new generation. first, finds 
       * the two most fit organisms from the current population (to be used as 
       * parents). Then it performs crossover. Then it mutates the offspring.
       * Can be used as a pretty reliable default.
       * 
       * @param model genetic algorithm model to modify
       * @returns a genetic algorithm model with a new generation
       */
      standard: (model: GeneticAlgorithmModel<TOrganism>): GeneticAlgorithmModel<TOrganism> => {
        model.generation++;
  
        // find two best parents
        const sortedPopulation: TOrganism[] = model.population.sort((a, b) => {
          return this.calculateFitness(b) - this.calculateFitness(a);
        });
  
        const parentA: TOrganism = sortedPopulation[0];
        const parentB: TOrganism = sortedPopulation[1];
  
        // perform crossover
        model.population = [];
        for (let i: number = 0; i < model.populationSize; i++) {
          model.population.push(this.crossover(parentA, parentB));
        }
  
        // mutation
        for (let i: number = 0; i < model.populationSize; i++) {
          model.population[i] = this.mutate(model.population[i]);
        }
  
        return model;
      }
    }
  }
}
