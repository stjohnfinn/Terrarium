/*******************************************************************************
 * terrarium.js
 *
 * Purpose: defines the main classes that make up the framework.
 */
class GeneticAlgorithm {
    constructor(
    // class methods
    createOrganism, stepFunction, calculateFitness, crossover, mutate, shouldTerminate, shouldProgressGeneration, 
    // this is super ugly, but I decided it was the best method for having a 
    // default value.
    produceNextGeneration = (model) => {
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
    }, 
    // properties
    populationSize = 50) {
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
    step() {
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
    play() {
        this.isRunning = true;
        this.next();
    }
    pause() {
        this.isRunning = false;
    }
}
