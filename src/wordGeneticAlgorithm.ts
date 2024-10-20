const CHARS = "abcdefghijklmnopqrstuvwxyz";
const TARGET_STRING = "wally"
const TARGET_STRING_LENGTH = TARGET_STRING.length;
const mutationChance = 0.02;

class WordOrganism implements Organism {
  genes: string;
  mutationChance: number;

  constructor() {
    this.genes = "";
  }
}

function createOrganism(): WordOrganism {
  let newOrganism: WordOrganism = new WordOrganism();

  for (let i: number = 0; i < TARGET_STRING_LENGTH; i++) {
    newOrganism.genes += CHARS[Math.floor(Math.random() * CHARS.length)];
  }

  newOrganism.mutationChance = mutationChance

  return newOrganism;
}

function crossover(parentA: WordOrganism, parentB: WordOrganism): WordOrganism {
  let offspring: WordOrganism = structuredClone(parentA);

  for (let i: number = 0; i < offspring.genes.length; i++) {

    if (Math.random() > 0.5) {
      offspring.genes = offspring.genes.substring(0, i) + parentB.genes[i] + offspring.genes.substring(i + 1);
    }

    if (offspring.genes.length != parentA.genes.length) {
      console.log(offspring);
      console.log(parentA);
      throw new Error("Crossover has created an organism that is a different species.");
    }
  }

  return offspring;
}

function calculateFitness(organism: WordOrganism): number {
  let totalLettersCorrect = 0;

  for (let i: number = 0; i < organism.genes.length; i++) {
    if (organism.genes[i] === TARGET_STRING[i]) {
      totalLettersCorrect++;
    }
  }

  return totalLettersCorrect / TARGET_STRING_LENGTH;
}

function mutate(organism: WordOrganism): WordOrganism {
  let mutatedOrganism = structuredClone(organism);

  for (let i: number = 0; i < mutatedOrganism.genes.length; i++) {
    let shouldMutate: boolean = Math.random() < mutatedOrganism.mutationChance;

    if (shouldMutate) {
      let mutatedGene: string = CHARS[Math.floor(Math.random() * CHARS.length)];

      mutatedOrganism.genes = mutatedOrganism.genes.substring(0, i) + mutatedGene + mutatedOrganism.genes.substring(i + 1);
    }
  }

  if (mutatedOrganism.genes.length != organism.genes.length) {
    throw new Error("Mutation has created an organism that is a different species.");
  }

  return mutatedOrganism;
}

function shouldTerminate(model: GeneticAlgorithmModel): boolean {
  let targetStringFound: boolean = false;

  for (let i: number = 0; i < model.populationSize; i++) {
    if (model.population[i].genes == TARGET_STRING) {
      targetStringFound = true;

      console.log("Match found!");
      console.log(model.population[i]);
    }
  }

  return targetStringFound;
}

function shouldProgressGeneration(model: GeneticAlgorithmModel): boolean {
  console.log("New generation!");

  return true;
}

function stepFunction(model: GeneticAlgorithmModel) {
  return;
}

let geneticAlgorithm = new GeneticAlgorithm(
  createOrganism,
  stepFunction,
  calculateFitness,
  crossover,
  mutate,
  shouldTerminate,
  shouldProgressGeneration
);

console.log(geneticAlgorithm);

let playButton = document.createElement("button");
document.querySelector("body").appendChild(playButton);
playButton.innerText = "play";
playButton.addEventListener("click", () => {
  geneticAlgorithm.play();
})

let pauseButton = document.createElement("button");
document.querySelector("body").appendChild(pauseButton );
pauseButton.innerText = "pause";
pauseButton.addEventListener("click", () => {
  geneticAlgorithm.pause();
});
