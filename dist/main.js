var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
console.log("Starting Terrarium!");
class WordGeneticAlgorithmModel {
    constructor(populationSize = 50, targetString = "hello", generation = 1) {
        // instance variables
        this.population = [];
        this.populationSize = 50;
        this.targetString = "";
        this.generation = 1;
        this.averageFitness = 0;
        this.generationComplete = false;
        this.fitnessRecord = [];
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
    step() {
        this.generationComplete = true;
        if (this.generationComplete) {
            // create a new generation
            this.progressToNextGeneration();
        }
    }
    progressToNextGeneration() {
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
    static produceOffspring(parentA, parentB, mutationChance = 0.02) {
        // for debugging
        console.log(parentA);
        let offspring = parentA.split("");
        for (let i = 0; i < offspring.length; i++) {
            if (Math.random() > 0.5) {
                offspring.splice(i, 1, parentB[i]);
            }
            if (Math.random() < mutationChance) {
                let mutatedGene = WordGeneticAlgorithmModel.possibleStringChars.charAt(Math.floor(Math.random() * WordGeneticAlgorithmModel.possibleStringChars.length));
                offspring.splice(i, 1, mutatedGene);
            }
        }
        return offspring.join("");
    }
    static calculateFitness(sampleString, targetString) {
        let correctLetters = 0;
        for (let i = 0; i < sampleString.length; i++) {
            if (sampleString[i] == targetString[i]) {
                correctLetters++;
            }
        }
        let fitness = correctLetters / targetString.length;
        return fitness;
    }
    static randomString(targetLength) {
        let result = "";
        for (let i = 0; i < targetLength; i++) {
            result += this.randomChar();
        }
        return result;
    }
    static randomChar() {
        return this.possibleStringChars.charAt(Math.floor(Math.random() * this.possibleStringChars.length));
    }
}
// static variables
WordGeneticAlgorithmModel.possibleStringChars = "abcdefghijklmnopqrstuvwxyz ";
let model = new WordGeneticAlgorithmModel(20, "wumble ligament foresight worthy", 1);
function gameLoop() {
    return __awaiter(this, void 0, void 0, function* () {
        model.step();
        if (!model.population.includes(model.targetString)) {
            requestAnimationFrame(gameLoop);
        }
        else {
            console.info("we're done!");
            console.info(model.generation);
        }
    });
}
requestAnimationFrame(gameLoop);
