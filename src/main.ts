console.log("Starting Terrarium!");

function reproduce(parentA: string, parentB: string, mutationChance: number = 0.1): string {
  let offspring: string[] = parentA.split("");
  let chars = "abcdefghijklmnopqrstuvxyz ";

  for (let i = 0; i < offspring.length; i++) {
    if (Math.random() > 0.5) {
      offspring.splice(i, 1, parentB[i]);
    }
    if (Math.random() < mutationChance) {
      let mutatedGene: string = chars.charAt(Math.floor(Math.random() * chars.length));
      offspring.splice(i, 1, mutatedGene);
    }
  }

  return offspring.join("");
}

function calculateFitness(str: string, targetString: string): number {
  let fitness: number = 0;

  for (let i = 0; i < str.length; i++) {
    if (str[i] == targetString[i]) {
      fitness++;
    }
  }
  
  return fitness;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// (async () => {
//   while (!population.includes(targetString)) {
//     await sleep(25);
//     generation++;
//     // update interface
//     updateInterface();
  
//     // find parents
//     const parentA = population.sort((a, b) => calculateFitness(a, targetString) > calculateFitness(b, targetString) ? -1 : 1)[0];
//     const parentB = population.sort((a, b) => calculateFitness(a, targetString) > calculateFitness(b, targetString) ? -1 : 1)[1]
    
//     // produce offspring based on fitness
//     population = [];
//     for (let i = 0; i < populationSize; i++) {
//       population.push(reproduce(parentA, parentB));
//     }
//   }
//   updateInterface();
//   console.log("target matched!");
// })();

class WordGeneticAlgorithmModel {
  // instance variables
  population: string[] = []
  populationSize: number = 50
  targetStringLength: number = 40
  targetString: string = ""
  generation: number = 1
  averageFitness: number = 0

  // static variables
  static possibleStringChars: string = "abcdefghijklmnopqrstuvxyz "

  constructor(populationSize: number = 50, targetString: string = "hello", generation: number = 1) {
    // initialize standard values
    this.population = [];
    this.populationSize = populationSize;
    this.targetStringLength = targetString.length;
    this.targetString = targetString;
    this.generation = generation;

    // initialize more complex values
    for (let i = 0; i < this.populationSize; i++) {
      this.population.push(WordGeneticAlgorithmModel.randomString(this.targetStringLength));
    }
  }

  static randomString(targetLength: number): string {
    let result = "";
    for (let i = 0; i < targetLength; i++) {
      result += this.randomChar();
    }
    return result;
  }

  static randomChar(): string {
    return this.possibleStringChars.charAt(Math.floor(Math.random() * this.possibleStringChars.length));
  }
}

class WordGeneticAlgorithmView {
  displayElement: HTMLDivElement;

  constructor(displayElement: HTMLDivElement) {
    this.displayElement = displayElement;
  }

  update(model: WordGeneticAlgorithmModel): void {
    // clear the display
    this.displayElement.innerHTML = "";

    // add current words
    let wordsContainer: HTMLDivElement = document.createElement("div");
    wordsContainer.style.display = "flex";
    wordsContainer.style.alignItems = "center";
    wordsContainer.style.justifyContent = "center";
    wordsContainer.style.flexDirection = "column";
    this.displayElement.appendChild(wordsContainer);
    for (const word of model.population) {
      let currentWordParagraph: HTMLParagraphElement = document.createElement("p");
      if (word == model.targetString) {
        currentWordParagraph.innerHTML = `<span style="border: 1px solid green">${word}</span>`;
      } else {
        currentWordParagraph.innerText = word;
      }
      wordsContainer.appendChild(currentWordParagraph);
    }

    // add metadata container
    let metadataContainer: HTMLDivElement = document.createElement("div");
    metadataContainer.style.display = "flex";
    metadataContainer.style.alignItems = "center";
    metadataContainer.style.justifyContent = "center";
    metadataContainer.style.flexDirection = "column";
    this.displayElement.appendChild(metadataContainer);

    // add target word
    let targetStringParagraph: HTMLParagraphElement = document.createElement("p");
    targetStringParagraph.innerText = `Target string is "${model.targetString}".`;
    metadataContainer.appendChild(targetStringParagraph);

    // display generation
    let generationParagraph: HTMLParagraphElement = document.createElement("p");
    generationParagraph.innerText = `Current generation is ${model.generation}.`;
    metadataContainer.appendChild(generationParagraph);

    // display generation's average fitness
    let averageFitnessParagraph: HTMLParagraphElement = document.createElement("p");
    averageFitnessParagraph.innerText = `Average fitness of this generation is ${model.averageFitness}.`;
    metadataContainer.appendChild(averageFitnessParagraph);
  }
}

class WordGeneticAlgorithmController {
  constructor() {
    console.log("Created a new controller!");
  }
}

let model = new WordGeneticAlgorithmModel(20, "wobble", 1);
let view = new WordGeneticAlgorithmView(document.querySelector("#view"));

console.log(model);
console.log(view);

view.update(model);
