import { Organism, GeneticAlgorithmModel, GeneticAlgorithm } from "./terrarium.js";

const Config = {
  CHARS: "abcdefghijklmnopqrstuvwxyz ",
  TARGET_STRING: "rice and weird",
  MUTATION_CHANCE: 0.02,
  POPULATION_SIZE: 45,
};

class WordOrganism implements Organism {
  genes: string;
  mutationChance: number;

  constructor() {
    this.genes = "";
  }
}

function createOrganism(): WordOrganism {
  let newOrganism: WordOrganism = new WordOrganism();

  for (let i: number = 0; i < Config.TARGET_STRING.length; i++) {
    newOrganism.genes += Config.CHARS[Math.floor(Math.random() * Config.CHARS.length)];
  }

  newOrganism.mutationChance = Config.MUTATION_CHANCE;

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
    if (organism.genes[i] === Config.TARGET_STRING[i]) {
      totalLettersCorrect++;
    }
  }

  return totalLettersCorrect / Config.TARGET_STRING.length;
}

function mutate(organism: WordOrganism): WordOrganism {
  let mutatedOrganism = structuredClone(organism);

  for (let i: number = 0; i < mutatedOrganism.genes.length; i++) {
    let shouldMutate: boolean = Math.random() < mutatedOrganism.mutationChance;

    if (shouldMutate) {
      let mutatedGene: string = Config.CHARS[Math.floor(Math.random() * Config.CHARS.length)];

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
    if (model.population[i].genes == Config.TARGET_STRING) {
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

let geneticAlgorithm: GeneticAlgorithm = new GeneticAlgorithm(
  createOrganism,
  stepFunction,
  calculateFitness,
  crossover,
  mutate,
  shouldTerminate,
  shouldProgressGeneration, 
  Config.POPULATION_SIZE
);

console.log(geneticAlgorithm);

let environment: HTMLDivElement = document.createElement("div");
environment.style.display = "grid";
environment.style.gridTemplateColumns = "1fr 1fr 1fr";
environment.style.gap = "0.5rem";
environment.style.overflowY = "scroll";
environment.style.justifyItems = "center";
environment.style.fontSize = "0.5rem";
environment.style.width = "100%";

let playButton: HTMLButtonElement = document.createElement("button");
document.querySelector("body").appendChild(playButton);
playButton.innerText = "▶ play ";
playButton.addEventListener("click", () => {
  geneticAlgorithm.play();
})

let pauseButton: HTMLButtonElement = document.createElement("button");
document.querySelector("body").appendChild(pauseButton);
pauseButton.innerText = "⏸ pause";
pauseButton.addEventListener("click", () => {
  geneticAlgorithm.pause();
});

let resetButton: HTMLButtonElement = document.createElement("button");
document.querySelector("body").appendChild(resetButton);
resetButton.innerText = "⟲ reset";
resetButton.addEventListener("click", () => {
  geneticAlgorithm.reset();
});

let controls: HTMLDivElement = document.createElement("div");
controls.appendChild(playButton);
controls.appendChild(pauseButton);
controls.appendChild(resetButton);
controls.style.display = "flex";
controls.style.flexDirection = "row";
controls.style.alignItems = "flex-start";
controls.style.justifyContent = "space-evenly";
controls.style.width = "100%";

let targetWordElement: HTMLParagraphElement = document.createElement("p");
targetWordElement.innerText = `Target: "${Config.TARGET_STRING}"`;

let view: HTMLDivElement = document.createElement("div");
view.appendChild(targetWordElement);
view.appendChild(environment);
view.appendChild(controls);
view.style.display = "flex";
view.style.flexDirection = "column";
view.style.alignItems = "center";
view.style.gap = "1rem";
view.style.justifyContent = "space-between";

document.querySelector("#view").appendChild(view);

function displayWordGeneticAlgorithm(model: GeneticAlgorithmModel): void {
  environment.innerHTML = "";

  for (const word of model.population) {
    let wordElement: HTMLParagraphElement = document.createElement("p");
    wordElement.innerText = String(word.genes);
    wordElement.style.fontFamily = "monospace";
    environment.appendChild(wordElement);

    if (word.genes == Config.TARGET_STRING) {
      wordElement.style.color = "rgb(0, 255, 40)";
    }
  }

  requestAnimationFrame(() => {
    displayWordGeneticAlgorithm(geneticAlgorithm.model);
  });
}

displayWordGeneticAlgorithm(geneticAlgorithm.model);
