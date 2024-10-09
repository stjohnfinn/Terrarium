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
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
class WordGeneticAlgorithmModel {
    constructor(populationSize = 50, targetString = "hello", generation = 1) {
        // instance variables
        this.population = [];
        this.populationSize = 50;
        this.targetStringLength = 40;
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
    static produceOffspring(parentA, parentB, mutationChance = 0.1) {
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
class WordGeneticAlgorithmView {
    constructor(displayElement) {
        this.displayElement = displayElement;
    }
    update(model) {
        // clear the display
        this.displayElement.innerHTML = "";
        // add current words
        let wordsContainer = document.createElement("div");
        wordsContainer.style.display = "flex";
        wordsContainer.style.alignItems = "center";
        wordsContainer.style.justifyContent = "center";
        wordsContainer.style.flexDirection = "column";
        this.displayElement.appendChild(wordsContainer);
        for (const word of model.population) {
            let currentWordParagraph = document.createElement("p");
            if (word == model.targetString) {
                currentWordParagraph.innerHTML = `<span style="border: 1px solid green">${word}</span>`;
            }
            else {
                currentWordParagraph.innerText = word;
            }
            wordsContainer.appendChild(currentWordParagraph);
        }
        // add metadata container
        let metadataContainer = document.createElement("div");
        metadataContainer.style.display = "flex";
        metadataContainer.style.alignItems = "center";
        metadataContainer.style.justifyContent = "center";
        metadataContainer.style.flexDirection = "column";
        this.displayElement.appendChild(metadataContainer);
        // add target word
        let targetStringParagraph = document.createElement("p");
        targetStringParagraph.innerText = `Target string is "${model.targetString}".`;
        metadataContainer.appendChild(targetStringParagraph);
        // display generation
        let generationParagraph = document.createElement("p");
        generationParagraph.innerText = `Current generation is ${model.generation}.`;
        metadataContainer.appendChild(generationParagraph);
        // display generation's average fitness
        let averageFitnessParagraph = document.createElement("p");
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
});
function gameLoop() {
    return __awaiter(this, void 0, void 0, function* () {
        model.step();
        // visuals
        view.update(model);
        fitnessGramPacerTest.data.labels = Array.from({ length: model.generation }, (_, i) => i + 1);
        fitnessGramPacerTest.data.datasets[0].data = model.fitnessRecord;
        fitnessGramPacerTest.update();
        yield sleep(10);
        if (!model.population.includes(model.targetString)) {
            requestAnimationFrame(gameLoop);
        }
        else {
            console.info("we're done!");
        }
    });
}
requestAnimationFrame(gameLoop);
