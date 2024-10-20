/*******************************************************************************
 * terrarium.js
 *
 * Defines the main classes and interfaces that make up the framework.
 */
/**
 * The "controller" that manages a genetic algorithm model. This class handles
 * the flow of the genetic algorithm from start to finish, from frame to frame,
 * and from generation to generation.
 */
class GeneticAlgorithm {
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
    createOrganism, stepFunction, calculateFitness, crossover, mutate, shouldTerminate, shouldProgressGeneration, 
    // this is super ugly, but I decided it was the best method for having a 
    // default value.
    produceNextGeneration, 
    // properties
    populationSize = 50, debug = false) {
        this.prefabs = {
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
                standard: (model) => {
                    let newModel = structuredClone(model);
                    newModel.generation++;
                    // find two best parents
                    const sortedPopulation = newModel.population.sort((a, b) => {
                        return this.calculateFitness(b) - this.calculateFitness(a);
                    });
                    const parentA = sortedPopulation[0];
                    const parentB = sortedPopulation[1];
                    // perform crossover
                    newModel.population = [];
                    for (let i = 0; i < newModel.populationSize; i++) {
                        newModel.population.push(this.crossover(parentA, parentB));
                    }
                    // mutation
                    for (let i = 0; i < newModel.populationSize; i++) {
                        newModel.population[i] = this.mutate(newModel.population[i]);
                    }
                    return newModel;
                }
            }
        };
        // initialize the model ****************************************************
        this.model = {
            populationSize: populationSize,
            generation: 0,
            population: [],
        };
        // methods *****************************************************************
        this.createOrganism = createOrganism;
        this.shouldTerminate = shouldTerminate;
        this.shouldProgressGeneration = shouldProgressGeneration;
        this.stepFunction = stepFunction;
        this.calculateFitness = calculateFitness;
        this.crossover = crossover;
        this.mutate = mutate;
        this.produceNextGeneration = produceNextGeneration !== null && produceNextGeneration !== void 0 ? produceNextGeneration : this.prefabs.produceNextGeneration.standard.bind(this);
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
    step() {
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
    next() {
        this.log("adding the step function to the requestAnimationFrame queue.");
        requestAnimationFrame(() => {
            this.step();
        });
    }
    /**
     * Purpose: super abstract way to just be like "hey I want to start the
     * algorithm".
     */
    play() {
        this.log("trying to start the GA.");
        if (!this.isRunning) {
            this.isRunning = true;
            this.next();
        }
    }
    pause() {
        this.log("stopping the GA.");
        this.isRunning = false;
    }
    /**
     * can be used to log content to the console, only actually logs stuff if the
     * `debug` variable is `true`.
     *
     * @param message content that should be logged to the console
     */
    log(message) {
        if (this.debug) {
            console.log(message);
        }
    }
}
