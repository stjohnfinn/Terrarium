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
interface Organism {
  genes: unknown;
  mutationChance: number;
}

/**
 * The "model" that represents the state of a genetic algorithm at any given 
 * moment.
 */
interface GeneticAlgorithmModel {
  populationSize: number;
  generation: number;
  population: Organism[];
}

/**
 * The "controller" that manages a genetic algorithm model. This class handles
 * the flow of the genetic algorithm from start to finish, from frame to frame,
 * and from generation to generation.
 */
class GeneticAlgorithm {
  /**
   * Progresses a genetic algorithm model to it's next frame.
   * 
   * @param model - the GeneticAlgorithmModel that the step function should
   * progress.
   */
  private stepFunction: (model: GeneticAlgorithmModel) => void;
  /**
   * checks if the genetic algorithm should stop running
   * 
   * @param model - the GeneticAlgorithmModel that should be checked.
   * 
   * @returns a boolean value that represents a yes or no answer to "should 
   * this genetic algorithm terminate?". 
   */
  private shouldTerminate: (model: GeneticAlgorithmModel) => boolean;
  /**
   * checks if the genetic algorithm should progress to the next generation
   * 
   * @param model - the GeneticAlgorithmModel that should be checked.
   * 
   * @returns a boolean value that represents a yes or no answer to "should 
   * this genetic algorithm progress to the next generation?".
   */
  private shouldProgressGeneration: (model: GeneticAlgorithmModel) => boolean;
  /**
   * this function is called to produce the next generation after a generation
   * ends.
   * 
   * @param model - the GeneticAlgorithmModel that serves as the starting point.
   * 
   * @returns a GeneticAlgorithmModel that has the new generation.
   */
  private produceNextGeneration: (model: GeneticAlgorithmModel) => GeneticAlgorithmModel;
  /**
   * used to create the firstGeneration and optionally, used in more places than
   * that (but that's up to user's discretion).
   * 
   * @returns a completely new Organism.
   */
  private createOrganism: () => Organism;
  /**
   * calculates the fitness of a single organism.
   * 
   * @param organism - the organism that should be analyzed.
   * 
   * @returns - the number value of the organism's fitness
   */
  private calculateFitness: (organism: Organism) => number;
  /**
   * performs "reproduction" of two organisms, producing a single offspring
   * 
   * @param parentA - the first parent organism
   * @param parentB - the second parent organism
   * 
   * @returns the child organism
   */
  private crossover: (parentA: Organism, parentB: Organism) => Organism;
  /**
   * mutates a single organism
   * 
   * @param organism - the organism that should be mutated
   * 
   * @returns the mutated organism
   */
  private mutate: (organism: Organism) => Organism;
  
  /**
   * model - the GeneticAlgorithmModel that this object manages.
   */
  model: GeneticAlgorithmModel;
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
    createOrganism: () => Organism,
    stepFunction: (model: GeneticAlgorithmModel) => void,
    calculateFitness: (organism: Organism) => number,
    mutate: (organism: Organism) => Organism,
    shouldTerminate: (model: GeneticAlgorithmModel) => boolean,
    shouldProgressGeneration: (model: GeneticAlgorithmModel) => boolean,
    crossover: (parentA: Organism, parentB: Organism) => Organism,
    // this is super ugly, but I decided it was the best method for having a 
    // default value.
    produceNextGeneration?: (model: GeneticAlgorithmModel) => GeneticAlgorithmModel,
    // properties
    populationSize: number = 50,
    debug: boolean = false) {

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
    this.stepFunction = stepFunction;
    this.calculateFitness = calculateFitness;
    this.crossover = crossover;
    this.mutate = mutate;
    this.produceNextGeneration = produceNextGeneration ?? this.prefabs.produceNextGeneration.standard.bind(this);

    // member variables ********************************************************
    this.debug = debug;
    this.isRunning = false;
    
    // generate new population *************************************************
    for (let i = 0; i < this.model.populationSize; i++) {
      this.log("creating the first generation.");
      this.model.population.push(this.createOrganism());
    }

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
  private step(): void {
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
      this.model = this.produceNextGeneration(this.model);
    }

    // we're still running the genetic algorithm, so go to the next frame
    if (this.isRunning) {
      this.log("progressing to the next frame.");
      this.stepFunction(this.model);
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
  private next(): void {
    this.log("adding the step function to the requestAnimationFrame queue.");
    requestAnimationFrame(() => {
      this.step();
    });
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

  pause(): void {
    this.log("stopping the GA.");
    this.isRunning = false;
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
      standard: (model: GeneticAlgorithmModel): GeneticAlgorithmModel => {
        let newModel: GeneticAlgorithmModel = structuredClone(model);
        newModel.generation++;
  
        // find two best parents
        const sortedPopulation: Organism[] = newModel.population.sort((a, b) => {
          return this.calculateFitness(b) - this.calculateFitness(a);
        });
  
        const parentA: Organism = sortedPopulation[0];
        const parentB: Organism = sortedPopulation[1];
  
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
      }
    }
  }
}
