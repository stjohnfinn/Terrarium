console.log("Starting Terrarium!");
function reproduce(parentA, parentB, mutationChance = 0.1) {
    let offspring = parentA.split("");
    let chars = "abcdefghijklmnopqrstuvxyz ";
    for (let i = 0; i < offspring.length; i++) {
        if (Math.random() > 0.5) {
            offspring.splice(i, 1, parentB[i]);
        }
        if (Math.random() < mutationChance) {
            let mutatedGene = chars.charAt(Math.floor(Math.random() * chars.length));
            offspring.splice(i, 1, mutatedGene);
        }
    }
    return offspring.join("");
}
function calculateFitness(str, targetString) {
    let fitness = 0;
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
    constructor(populationSize = 50, targetString = "hello", generation = 1) {
        // instance variables
        this.population = [];
        this.populationSize = 50;
        this.targetStringLength = 40;
        this.targetString = "";
        this.generation = 1;
        this.averageFitness = 0;
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
WordGeneticAlgorithmModel.possibleStringChars = "abcdefghijklmnopqrstuvxyz ";
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
