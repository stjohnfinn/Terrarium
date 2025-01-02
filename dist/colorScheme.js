import { GeneticAlgorithm } from "./terrarium.js";
const MUTATION_CHANCE = 0.08;
const POPULATION_SIZE = 10;
const FRAME_DELAY = 50;
const CANVAS_HEIGHT = 250;
const CANVAS_WIDTH = 250;
const COLOR_COUNT_EACH = 4;
class ColorSchemeOrganism {
    constructor() {
        this.mutationChance = MUTATION_CHANCE;
        this.genes = [];
        for (let i = 0; i < COLOR_COUNT_EACH; i++) {
            this.genes.push({
                red: getRandomInt(0, 255),
                green: getRandomInt(0, 255),
                blue: getRandomInt(0, 255)
            });
        }
    }
}
function createOrganism() {
    return new ColorSchemeOrganism();
}
//##############################################################################
// crossover
//##############################################################################
function crossover(parentA, parentB) {
    let offspring = new ColorSchemeOrganism();
    for (let i = 0; i < offspring.genes.length; i++) {
        offspring.genes[i].red = Math.random() > 0.5 ? parentA.genes[i].red : parentB.genes[i].red;
        offspring.genes[i].green = Math.random() > 0.5 ? parentA.genes[i].green : parentB.genes[i].green;
        offspring.genes[i].blue = Math.random() > 0.5 ? parentA.genes[i].blue : parentB.genes[i].blue;
    }
    return offspring;
}
//##############################################################################
// fitness
//##############################################################################
function rgbToHsv(color) {
    let red = color.red / 255;
    let green = color.green / 255;
    let blue = color.blue / 255;
    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const difference = max - min;
    let hue = 0;
    const saturation = max === 0 ? 0 : difference / max;
    const value = max;
    if (difference !== 0) {
        if (max === red) {
            hue = (green - blue) / difference + (green < blue ? 6 : 0);
        }
        else if (max === green) {
            hue = (blue - red) / difference + 2;
        }
        else {
            hue = (red - green) / difference + 4;
        }
        hue = hue / 6;
    }
    return {
        hue: hue,
        saturation: saturation,
        value: value
    };
}
function standardDeviation(numbers) {
    const avg = getAverage(...numbers);
    const squareDiffs = numbers.map(n => Math.pow(n - avg, 2));
    return Math.sqrt(getAverage(...squareDiffs));
}
function calculateFitness(organism) {
    let hsvColors = [];
    for (let i = 0; i < organism.genes.length; i++) {
        hsvColors.push(rgbToHsv(organism.genes[i]));
    }
    let fitness = 0;
    // Color distribution score
    let hues = [];
    for (let i = 0; i < hsvColors.length; i++) {
        hues.push(hsvColors[i].hue);
    }
    let hueDiffs = [];
    for (let i = 0; i < hues.length; i++) {
        for (let j = i + 1; j < hues.length; j++) {
            // calculate smallest distance between hues on color wheel
            const diff = Math.min(Math.abs(hues[i] - hues[j]), 1 - Math.abs(hues[i] - hues[j]));
            hueDiffs.push(diff);
        }
    }
    // reward even distribution of hues
    const hueScore = hueDiffs.reduce((sum, diff) => sum + (1 - Math.abs(diff - 0.25)), 0);
    fitness += hueScore * 2;
    // brightness variance score
    let values = [];
    for (let i = 0; i < hsvColors.length; i++) {
        values.push(hsvColors[i].value);
    }
    const brightnessVariance = standardDeviation(values);
    const brightnessScore = 1 - Math.abs(brightnessVariance - 0.3);
    fitness += brightnessScore;
    // saturation balance score
    let saturations = [];
    for (let i = 0; i < hsvColors.length; i++) {
        saturations.push(hsvColors[i].saturation);
    }
    const saturationVariance = standardDeviation(saturations);
    const saturationScore = 1 - Math.abs(saturationVariance - 0.3);
    fitness += saturationScore;
    // contrast score
    let contrastPairs = 0;
    for (let i = 0; i < values.length; i++) {
        for (let j = i + 1; j < values.length; j++) {
            if (Math.abs(values[i] - values[j]) > 0.5) {
                contrastPairs++;
            }
        }
    }
    const contrastScore = Math.min(contrastPairs, 2);
    fitness += contrastScore;
    // penalize extreme saturation/value combinations
    let penalties = 0;
    for (let i = 0; i < hsvColors.length; i++) {
        if ((hsvColors[i].saturation > 0.8 && hsvColors[i].value < 0.2) || (hsvColors[i].saturation > 0.8 && hsvColors[i].value > 0.8)) {
            penalties += 0.5;
        }
    }
    fitness -= penalties;
    return Math.max(0, fitness);
}
//##############################################################################
// mutation
//##############################################################################
function mutate(organism) {
    for (let i = 0; i < organism.genes.length; i++) {
        const shouldMutateRed = Math.random() < MUTATION_CHANCE;
        if (shouldMutateRed) {
            const mutationCoeff = Math.random() / 2;
            // true is positive, false is negative
            const mutationSign = Math.random() > 0.5;
            if (mutationSign) {
                organism.genes[i].red += organism.genes[i].red * mutationCoeff;
            }
            else {
                organism.genes[i].red -= organism.genes[i].red * mutationCoeff;
            }
        }
        const shouldMutateGreen = Math.random() < MUTATION_CHANCE;
        if (shouldMutateGreen) {
            const mutationCoeff = Math.random() / 2;
            // true is positive, false is negative
            const mutationSign = Math.random() > 0.5;
            if (mutationSign) {
                organism.genes[i].green += organism.genes[i].green * mutationCoeff;
            }
            else {
                organism.genes[i].green -= organism.genes[i].green * mutationCoeff;
            }
        }
        const shouldMutateBlue = Math.random() < MUTATION_CHANCE;
        if (shouldMutateBlue) {
            const mutationCoeff = Math.random() / 2;
            // true is positive, false is negative
            const mutationSign = Math.random() > 0.5;
            if (mutationSign) {
                organism.genes[i].blue += organism.genes[i].blue * mutationCoeff;
            }
            else {
                organism.genes[i].blue -= organism.genes[i].blue * mutationCoeff;
            }
        }
    }
    return organism;
}
//##############################################################################
// stepFunction
//##############################################################################
function stepFunction(model) {
    return;
}
//##############################################################################
// shouldProgressGeneration
//##############################################################################
function shouldProgressGeneration(model) {
    return true;
}
//##############################################################################
// shouldTerminate
//##############################################################################
function shouldTerminate(model) {
    return false;
}
//##############################################################################
// setup
//##############################################################################
let geneticAlgorithm = new GeneticAlgorithm(createOrganism, stepFunction, calculateFitness, crossover, mutate, shouldTerminate, shouldProgressGeneration, POPULATION_SIZE, false, FRAME_DELAY);
//##############################################################################
// display
//##############################################################################
let view = document.createElement("div");
view.style.display = "flex";
view.style.alignItems = "center";
view.style.flexDirection = "column";
view.style.gap = "1rem";
view.style.justifyContent = "space-evenly";
view.style.position = "relative";
let canvas = document.createElement("canvas");
canvas.height = CANVAS_HEIGHT;
canvas.width = CANVAS_WIDTH;
canvas.style.border = "1px solid black";
function display(canvas, model) {
    const ctx = canvas.getContext("2d");
    clearCanvas(canvas);
    // draw each at equal intervals
    const MARGIN = 5;
    const SAMPLE_WIDTH = 20;
    const TOTAL_WIDTH = SAMPLE_WIDTH * COLOR_COUNT_EACH;
    const PADDING = 20;
    const SAMPLE_HEIGHT = (CANVAS_HEIGHT - ((POPULATION_SIZE - 1) * MARGIN) - (2 * PADDING)) / POPULATION_SIZE;
    const START_X = (CANVAS_WIDTH - TOTAL_WIDTH) / 2;
    for (let i = 0; i < model.population.length; i++) {
        const organism = model.population[i];
        const Y = PADDING + (i * MARGIN) + (i * SAMPLE_HEIGHT);
        for (let i = 0; i < organism.genes.length; i++) {
            const X = START_X + (i * SAMPLE_WIDTH);
            ctx.fillStyle = `rgb(${organism.genes[i].red}, ${organism.genes[i].green}, ${organism.genes[i].blue})`;
            ctx.fillRect(X, Y, SAMPLE_WIDTH, SAMPLE_HEIGHT);
        }
    }
}
function gameLoop(model) {
    display(canvas, model);
    requestAnimationFrame(() => {
        gameLoop(geneticAlgorithm.model);
    });
}
gameLoop(geneticAlgorithm.model);
let playButton = document.createElement("button");
playButton.innerText = "▶ play ";
playButton.addEventListener("click", () => {
    geneticAlgorithm.play();
});
let pauseButton = document.createElement("button");
pauseButton.innerText = "⏸ pause";
pauseButton.addEventListener("click", () => {
    geneticAlgorithm.pause();
});
let resetButton = document.createElement("button");
resetButton.innerText = "⟲ reset";
resetButton.addEventListener("click", () => {
    geneticAlgorithm.reset();
});
let controls = document.createElement("div");
controls.appendChild(playButton);
controls.appendChild(pauseButton);
controls.appendChild(resetButton);
controls.style.display = "flex";
controls.style.flexDirection = "row";
controls.style.alignItems = "flex-start";
controls.style.justifyContent = "space-evenly";
controls.style.width = "100%";
let title = document.createElement("p");
title.innerText = "Color schemes";
title.style.position = "absolute";
title.style.left = "0px";
title.style.top = "0px";
title.style.padding = "0.25rem";
title.style.transform = "translateY(-100%)";
title.style.fontSize = "0.75rem";
view.appendChild(title);
view.appendChild(canvas);
view.appendChild(controls);
document.querySelector("#view").appendChild(view);
