console.log("Starting Terrarium!");

declare var Chart: any;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class WordGeneticAlgorithmModel {
  // instance variables
  population: string[] = [];
  populationSize: number = 50;
  targetStringLength: number = 40;
  targetString: string = "";
  generation: number = 1;
  averageFitness: number = 0;
  generationComplete: boolean = false;
  fitnessRecord: number[] = [];

  // static variables
  static possibleStringChars: string = "abcdefghijklmnopqrstuvwxyz ";

  constructor(populationSize: number = 50, targetString: string = "hello", generation: number = 1) {
    // initialize standard values
    this.population = [];
    this.populationSize = populationSize;
    this.targetStringLength = targetString.length;
    this.targetString = targetString;
    this.generation = generation;
    this.generationComplete = false;  

    // initialize more complex values
    for (let i = 0; i < this.populationSize; i++) {
      this.population.push(WordGeneticAlgorithmModel.randomString(this.targetStringLength));
    }
  }

  step(): void {
    this.generationComplete = true;

    if (this.generationComplete) {
      // create a new generation
      this.progressToNextGeneration();
    }
  }

  progressToNextGeneration():void {
    this.generation++;

    // metrics
    this.averageFitness = this.population.map(str => WordGeneticAlgorithmModel.calculateFitness(str, this.targetString)).reduce((a, b) => a + b, 0) / this.populationSize;
    this.fitnessRecord.push(this.averageFitness);

    // find parents
    const parentA = this.population.sort((a, b) => WordGeneticAlgorithmModel.calculateFitness(a, this.targetString) > WordGeneticAlgorithmModel.calculateFitness(b, this.targetString) ? -1 : 1)[0];
    const parentB = this.population.sort((a, b) => WordGeneticAlgorithmModel.calculateFitness(a, this.targetString) > WordGeneticAlgorithmModel.calculateFitness(b, this.targetString) ? -1 : 1)[1];

    // generate offspring
    this.population = [];
    for (let i = 0; i < this.populationSize; i++) {
      this.population.push(WordGeneticAlgorithmModel.produceOffspring(parentA, parentB));
    }
  }

  static produceOffspring(parentA: string, parentB: string, mutationChance: number = 0.1): string {
    let offspring: string[] = parentA.split("");

    for (let i = 0; i < offspring.length; i++) {
      if (Math.random() > 0.5) {
        offspring.splice(i, 1, parentB[i]);
      }

      if (Math.random() < mutationChance) {
        let mutatedGene: string = WordGeneticAlgorithmModel.possibleStringChars.charAt(Math.floor(Math.random() * WordGeneticAlgorithmModel.possibleStringChars.length));
        offspring.splice(i, 1, mutatedGene);
      }
    }

    return offspring.join("");
  }

  static calculateFitness(sampleString: string, targetString: string): number {
    let correctLetters: number = 0;

    for (let i = 0; i < sampleString.length; i++) {
      if (sampleString[i] == targetString[i]) {
        correctLetters++;
      }
    }

    let fitness: number = correctLetters / targetString.length;
    
    return fitness;
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
    averageFitnessParagraph.innerText = `Average fitness of this generation is ${model.averageFitness.toFixed(2)}.`;
    metadataContainer.appendChild(averageFitnessParagraph);
  }
}

class WordGeneticAlgorithmController {
  constructor() {
    console.log("Created a new controller!");
  }
}

let model = new WordGeneticAlgorithmModel(20, "geronimo geoff", 1);
let view = new WordGeneticAlgorithmView(document.querySelector("#view"));

// chart for metrics
const ctx = document.getElementById("myChart");
let fitnessGramPacerTest = new Chart(ctx, {
  type: "line",
  data: {
    labels: Array.from({ length: model.population.length }, (_, i) => i + 1),
    datasets: [{
      label: "Average Fitness",
      data: [0, 1, 2, 3],
      borderWidth: 1
    }]
  },
  options: {
    animation: false,
    maintainAspectRatio: true,
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 1
      },
      x: {
        type: "linear",
        position: "bottom",
        ticks: {
          autoSkip: true,
          maxTicksLimit: 500
        }
      }
    },
    responsive: true
  }
})

async function gameLoop(): Promise<void> {
  model.step();

  // visuals
  view.update(model);
  fitnessGramPacerTest.data.labels = Array.from({ length: model.population.length }, (_, i) => i + 1);
  fitnessGramPacerTest.data.datasets[0].data = model.fitnessRecord;
  fitnessGramPacerTest.update();

  await sleep(10);

  if (!model.population.includes(model.targetString)) {
    requestAnimationFrame(gameLoop);
  } else {
    console.info("we're done!");
  }
}

requestAnimationFrame(gameLoop);
