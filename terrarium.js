// this class represents a single member of the population
class Organism {
  constructor(genes) {
    this.genes = genes
  }
}

// this is the main class that must be invoked each time a new program is
// created
class Ecosystem {
  // generateOrganism must return an organism
  // maybe they have to comply to some interface
  constructor(stepFunction, populationSize = 50, generateOrganism, fitnessFunction, mutationChance) {
    // should be called by the caller in a `requestAnimationFrame`
    // infinite loop
    this.step = stepFunction

    // assumes this is implemented as higher fitness = better
    this.calculateFitness = fitnessFunction
    this.mutationChance = mutationChance
    this.state = {
      isRunning: false,
      populationSize: populationSize,
      population: [],
    };
    
    for (let i = 0; i < this.populationSize; i++) {
      this.state.population.push(generateOrganism())
    }
  
    // save this for the reset() function
    this.originState = this.state

    this.previousPopulation = null
  }

  // This function starts the animation loop?
  play() {
    this.state.isRunning = true
  }

  // This function stops the animation loop?
  pause() {
    this.state.isRunning = false
  }

  // This function resets the entire population back to its original state
  // and stops the animation loop
  reset() {
    this.state = this.originState;
  }
}

// crossover function(s), all should work regardless of the data type
// of each gene
const crossover = {

  // takes a single ecosystem object
  // mutation: none
  // assumes the genes are a dictionary/hashmap, NOT an array
  basic: function(ecosystem) {
    ecosystem.previousPopulation = ecosystem.population
    ecosystem.population = []

    // calculate the two most fit parents
    // uses the .sort function with a custom criteria (the fitness function)
    // sorts descending
    ecosystem.previousPopulation = ecosystem.population.sort((a, b) => {
      const keyA = ecosystem.calculateFitness(a)
      const keyB = ecosystem.calculateFitness(b)

      if (keyA < keyB) return -1
      if (keyA > keyB) return 1
      return 0
    })

    // select the top two parents
    const [parentA, parentB] = ecosystem.previousPopulation

    // create new childern using either parentA's or parentB's gene
    // for that slot.
    for (let i = 0; i < ecosystem.populationSize; i++) {
      // assign it the value of one of the parents
      let offspring = new Organism(ecosystem.population[i].genes)

      // for each gene of the organism
      Object.keys(offspring.genes).forEach(key => {
        // generate random number
        let randomNumber = Math.random()

        // assign new gene randomly
        // basically 50% chance for each parent
        // at this point, child is a direct copy of parentA,
        // so we only need to account for parentB probability
        if (randomNumber > 0.5) {
          offspring.genes[key] = parentB[key]
        }
      })
    }
  }
}