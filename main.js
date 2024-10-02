console.log("Starting Terrarium!")

function generateNewOrganism() {
  let genes = {
    size: Math.floor(Math.random() * (5 - 1) + 1),
    color: {
      red: Math.floor(Math.random() * (220 - 20) + 20),
      green: Math.floor(Math.random() * (220 - 20) + 20),
      blue: Math.floor(Math.random() * (220 - 20) + 20)
    },
    maxHealth: Math.floor(Math.random() * (20 - 5) + 5)
  }

  console.log(genes)

  let organism = new Organism(genes)

  organism.currentHealth = organism.genes.maxHealth
  organism.isAlive = true

  return organism
}

function calculateFitness(organism) {
  if (!organism.isAlive) return 0
  
  let fitness = organism.currentHealth + ( 0.25 * organism.maxHealth)

  return fitness
}

function stepFunction() {
  // display each organism
  let canvas = document.querySelector("canvas")

  console.log(canvas)
  
}

stepFunction()

let ecosystem = new Ecosystem()
