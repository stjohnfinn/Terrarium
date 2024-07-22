class Ecosystem {
  // generateOrganism must return an organism
  // maybe they have to comply to some interface
  constructor(stepFunction, populationSize = 50, generateOrganism) {
    // should be called by the caller in a `requestAnimationFrame`
    // infinite loop
    this.stepFunction = stepFunction;
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
  }

  // This function starts the animation loop?
  play() {
    this.state.isRunning = true;
  }

  // This function stops the animation loop?
  pause() {
    this.state.isRunning = false;
  }

  // This function resets the entire population back to its original state
  // and stops the animation loop
  reset() {
    this.state = this.originState;
  }
}