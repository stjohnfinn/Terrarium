console.log("Starting Terrarium!");

class WordGeneticAlgorithmModel {
  // instance variables
  population: string[] = [];
  populationSize: number = 50;
  targetStringLength: number;
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

  static produceOffspring(parentA: string, parentB: string, mutationChance: number = 0.02): string {
    // for debugging
    console.log(parentA)

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


let model = new WordGeneticAlgorithmModel(20, "wumble ligament foresight worthy", 1);

async function gameLoop(): Promise<void> {
  model.step();

  if (!model.population.includes(model.targetString)) {
    requestAnimationFrame(gameLoop);
  } else {
    console.info("we're done!");
    console.info(model.generation);
  }
}

requestAnimationFrame(gameLoop);
