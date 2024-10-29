import { Organism, GeneticAlgorithm, GeneticAlgorithmModel } from "./terrarium.js";

const MUTATION_CHANCE: number = 0.2;
const POPULATION_SIZE: number = 30;
const FRAME_DELAY: number = 0;

const CANVAS_HEIGHT: number = 250;
const CANVAS_WIDTH: number = 250;

// Gene bounds
const MIN_RADIUS: number = 4;
const MAX_RADIUS: number = 20;
const RADIUS_MUTATION_MARGIN: number = 2;
const MIN_DAMAGE: number = 4;
const MAX_DAMAGE: number = 10;
const DAMAGE_MUTATION_MARGIN: number = 2;
const MIN_ARMOR: number = 2;
const MAX_ARMOR: number = 10;
const ARMOR_MUTATION_MARGIN: number = 3;
const MIN_COLOR: number = 0;
const MAX_COLOR: number = 255;
const COLOR_MUTATION_MARGIN: number = 20;
const BASE_HEALTH: number = 15;
const MIN_POS: Vector2d = {
  x: 20,
  y: 20
}
const MAX_POS: Vector2d = {
  x: CANVAS_WIDTH - 20,
  y: CANVAS_HEIGHT - 20
}
const MIN_VEL: Vector2d = {
  x: 0.5,
  y: 0.5
}
const MAX_VEL: Vector2d = {
  x: 2.5,
  y: 2.5
}


type Color = {
  red: number;
  green: number;
  blue: number;
}

type Vector2d = {
  x: number;
  y: number;
}

type ShapeGenes = {
  radius: number;
  damage: number;
  armor: number;
  color: Color;
}

class ShapeOrganism implements Organism {
  mutationChance: number;
  genes: ShapeGenes;
  isAlive: boolean;
  kills: number;
  health: number;
  velocity: Vector2d;
  position: Vector2d;

  constructor() {
    const randomRadius: number = getRandomInt(MIN_RADIUS, MAX_RADIUS);

    this.genes = {
      radius: randomRadius,
      damage: getRandomInt(MIN_DAMAGE, MAX_DAMAGE),
      armor: getRandomInt(MIN_ARMOR, MAX_ARMOR),
      color: {
        red: getRandomInt(MIN_COLOR, MAX_COLOR),
        green: getRandomInt(MIN_COLOR, MAX_COLOR),
        blue: getRandomInt(MIN_COLOR, MAX_COLOR)
      }
    };
    
    this.position = {
      x: getRandomInt(MIN_POS.x, MAX_POS.x),
      y: getRandomInt(MIN_POS.y, MAX_POS.y)
    }
    this.velocity = {
      x: getRandomFloat(MIN_VEL.x, MAX_VEL.x),
      y: getRandomFloat(MIN_VEL.y, MAX_VEL.y)
    }
    this.mutationChance = MUTATION_CHANCE;
    this.health = BASE_HEALTH,
    this.isAlive = true;
    this.kills = 0;
  }

  getArea(): number {
    return Math.PI * 2 * this.genes.radius;
  }
}

function createOrganism(): ShapeOrganism {
  return new ShapeOrganism();
}

function calculateFitness(organism: ShapeOrganism): number {
  let fitness: number = 0;

  fitness += organism.kills;

  if (organism.isAlive) {
    fitness = fitness * 2;
  }

  return fitness;
}

function crossover(parentA: ShapeOrganism, parentB: ShapeOrganism): ShapeOrganism {
  let offspring: ShapeOrganism = new ShapeOrganism();

  offspring.genes.radius = randomizeWithMargin(
    getAverage(parentA.genes.radius, parentB.genes.radius),
    RADIUS_MUTATION_MARGIN
  );

  offspring.genes.damage = getRandomInt(parentA.genes.damage, parentB.genes.damage);

  offspring.genes.armor = getRandomInt(parentA.genes.armor, parentB.genes.armor);

  offspring.genes.color = {
    red: randomizeWithMargin(getRandomInt(parentA.genes.color.red, parentA.genes.color.red), COLOR_MUTATION_MARGIN),
    green: randomizeWithMargin(getRandomInt(parentA.genes.color.green, parentA.genes.color.green), COLOR_MUTATION_MARGIN),
    blue: randomizeWithMargin(getRandomInt(parentA.genes.color.blue, parentA.genes.color.blue), COLOR_MUTATION_MARGIN),
  }

  return offspring;
}

function mutate(organism: ShapeOrganism): ShapeOrganism {
  // we need to individually perform mutation for each of the genes

  // height first
  if (Math.random() < MUTATION_CHANCE) {
    organism.genes.radius = clamp(randomizeWithMargin(organism.genes.radius, RADIUS_MUTATION_MARGIN), MIN_RADIUS, MAX_RADIUS);
  }

  // damage
  if (Math.random() < MUTATION_CHANCE) {
    organism.genes.damage = clamp(randomizeWithMargin(organism.genes.damage, DAMAGE_MUTATION_MARGIN), MIN_DAMAGE, MAX_DAMAGE);
  }

  // armor
  if (Math.random() < MUTATION_CHANCE) {
    organism.genes.armor = clamp(randomizeWithMargin(organism.genes.armor, ARMOR_MUTATION_MARGIN), MIN_ARMOR, MAX_ARMOR);
  }

  // color
  organism.genes.color = {
    red: Math.random() < MUTATION_CHANCE ? getRandomInt(MIN_COLOR, MAX_COLOR) : organism.genes.color.red,
    green: Math.random() < MUTATION_CHANCE ? getRandomInt(MIN_COLOR, MAX_COLOR) : organism.genes.color.green,
    blue: Math.random() < MUTATION_CHANCE ? getRandomInt(MIN_COLOR, MAX_COLOR) : organism.genes.color.blue
  };

  return organism;
}

function shouldTerminate(model: GeneticAlgorithmModel<ShapeOrganism>): boolean {
  return false;
}

function shouldProgressGeneration(model: GeneticAlgorithmModel<ShapeOrganism>): boolean {
  let aliveCountgtOne: boolean = model.population.reduce((accumulator: number, currentValue: ShapeOrganism): number => accumulator + Number(currentValue.isAlive), 0) <= 1;

  return aliveCountgtOne;
}

let view: HTMLDivElement = document.createElement("div");
view.style.display = "flex";
view.style.alignItems = "center";
view.style.flexDirection = "column";
view.style.gap = "1rem";
view.style.justifyContent = "space-evenly";

let canvas: HTMLCanvasElement = document.createElement("canvas");
canvas.height = CANVAS_HEIGHT;
canvas.width = CANVAS_WIDTH;
canvas.style.border = "1px dashed lightblue";

function clearCanvas(cv: HTMLCanvasElement, color: string = "rgb(255, 255, 255)") {
  cv.getContext("2d").fillStyle = color;
  cv.getContext("2d").fillRect(0, 0, cv.width, cv.height);
}

/**
 * REAL MEAT OF THIS ALL
 * 
 * this is all of the really important stuff
 */

function keepShapeInbounds(shape: ShapeOrganism, xMax: number, yMax: number, xMin: number = 0, yMin: number = 0): void {

  // check top side
  if (shape.position.y < yMin + shape.genes.radius) {
    shape.position.y = yMin + shape.genes.radius;
    shape.velocity.y = -shape.velocity.y;
  }
  
  // check left side
  if (shape.position.x < xMin + shape.genes.radius) {
    shape.position.x = xMin + shape.genes.radius;
    shape.velocity.x = -shape.velocity.x;
  }
  
  // check bottom side
  if (shape.position.y > yMax - shape.genes.radius) {
    shape.position.y = yMax - shape.genes.radius;
    shape.velocity.y = -shape.velocity.y;
  }

  // check right side
  if (shape.position.x > xMax - shape.genes.radius) {
    shape.position.x = xMax - shape.genes.radius;
    shape.velocity.x = -shape.velocity.x;
  }

  return;
}

function distance(positionA: Vector2d, positionB: Vector2d): number {
  return Math.sqrt(Math.pow(positionA.x - positionB.x, 2) + Math.pow(positionA.y - positionB.y, 2));
}

function checkCollision(shapeA: ShapeOrganism, shapeB: ShapeOrganism): boolean {
  return distance(shapeA.position, shapeB.position) < shapeA.genes.radius + shapeB.genes.radius;
}

function fixCollision(shapeA: ShapeOrganism, shapeB: ShapeOrganism): void {
  if (checkCollision(shapeA, shapeB)) {
    const m1 = shapeA.getArea();
    const m2 = shapeB.getArea();

    const normal = {
      x: shapeA.position.x - shapeB.position.x,
      y: shapeA.position.y - shapeB.position.y
    };

    const magnitude = distance(shapeA.position, shapeB.position);

    if (magnitude === 0) {
      throw new Error("Divide by 0 in physics calculation.");
    }

    const unitNormal = {
      x: normal.x / magnitude,
      y: normal.y / magnitude
    };

    const unitTangent = {
      x: -unitNormal.y,
      y: unitNormal.x
    };

    const v1n = unitNormal.x * shapeA.velocity.x + unitNormal.y * shapeA.velocity.y;
    const v1t = unitTangent.x * shapeA.velocity.x + unitTangent.y * shapeA.velocity.y;
    const v2n = unitNormal.x * shapeB.velocity.x + unitNormal.y * shapeB.velocity.y;
    const v2t = unitTangent.x * shapeB.velocity.x + unitTangent.y * shapeB.velocity.y;

    if (m1 + m2 === 0) {
      throw new Error("Divide by 0 in physics calculation.");
    }

    const v1nAfter = (v1n * (m1 - m2) + 2 * m2 * v2n) / (m1 + m2);
    const v2nAfter = (v2n * (m2 - m1) + 2 * m1 * v1n) / (m1 + m2);

    shapeA.velocity = {
      x: v1nAfter * unitNormal.x + v1t * unitTangent.x,
      y: v1nAfter * unitNormal.y + v1t * unitTangent.y,
    };
    shapeB.velocity = {
      x: v2nAfter * unitNormal.x + v2t * unitTangent.x,
      y: v2nAfter * unitNormal.y + v2t * unitTangent.y,
    }
  }

  return;
}

function applyDamage(attacker: ShapeOrganism, victim: ShapeOrganism): void {
  // deal more dmg if high red content
  const maxDamageCoeffOffset: number = 1.5;
  const damageCoeff: number = 1 + (attacker.genes.color.red / MAX_COLOR) * maxDamageCoeffOffset;
  // more armor if high blue content
  const maxArmorCoeffOffset: number = 1.5;
  const armorCoeff: number = 1 + (victim.genes.color.blue / MAX_COLOR) * maxArmorCoeffOffset;

  victim.health -= (damageCoeff * attacker.genes.damage) / ( armorCoeff * victim.genes.armor);
  if (victim.health === 0) {
    victim.isAlive = false;
    attacker.kills += 1;
  }
}

async function stepFunction(model: GeneticAlgorithmModel<ShapeOrganism>): Promise<GeneticAlgorithmModel<ShapeOrganism>> {

  for (let i = 0; i < model.population.length; i++) {
    if (model.population[i].health <= 0) {
      model.population[i].isAlive = false;
    }
    if (model.population[i].isAlive === false) {
      continue;
    }

    model.population[i].position.x += model.population[i].velocity.x;
    model.population[i].position.y += model.population[i].velocity.y;
    
    for (let j = i + 1; j < model.population.length; j++) {
      if (model.population[j].isAlive === false) {
        continue;
      }
      if (checkCollision(model.population[i], model.population[j])) {
        applyDamage(model.population[i], model.population[j]);
        applyDamage(model.population[j], model.population[i]);
      }
      fixCollision(model.population[i], model.population[j]);
    }
    keepShapeInbounds(model.population[i], CANVAS_WIDTH, CANVAS_HEIGHT);

    // regen some health based on blue content
    const maxRegenCoeff: number = 0.00005;
    const regenCoeff: number = 1 + (model.population[i].genes.color.blue / MAX_COLOR) * maxRegenCoeff;
    model.population[i].health = Math.min(15, model.population[i].health * regenCoeff);
  }

  return;
}

let geneticAlgorithm: GeneticAlgorithm<ShapeOrganism> = new GeneticAlgorithm(
  createOrganism,
  stepFunction,
  calculateFitness,
  crossover,
  mutate,
  shouldTerminate,
  shouldProgressGeneration,
  POPULATION_SIZE,
  false,
  FRAME_DELAY
);

/**
 * View logic is here baby!!!
 */

function display(canvas: HTMLCanvasElement, model: GeneticAlgorithmModel<ShapeOrganism>) {
  const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
  const OPACITY = 0.5;

  clearCanvas(canvas);

  for (const organism of model.population) {
    if (organism.isAlive) {
      ctx.beginPath();
      ctx.fillStyle = `rgba(${organism.genes.color.red}, ${organism.genes.color.green}, ${organism.genes.color.blue}, ${OPACITY})`
      ctx.arc(organism.position.x, organism.position.y, organism.genes.radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      
      // draw the health
      ctx.font = "8px serif";
      ctx.fillStyle = `rgb(0, 0, 0)`;
      ctx.fillText(`♥️${Math.ceil(organism.health)}`, organism.position.x - 4, organism.position.y - (organism.genes.radius + 4) );
      ctx.fillStyle = `rgb(255, 0, 0)`;
      ctx.fillText(`✸${Math.ceil(organism.genes.damage)}`, organism.position.x - 12, organism.position.y + organism.genes.radius + 10);
      ctx.fillStyle = `rgb(0, 0, 255)`;
      ctx.fillText(`🛡${Math.ceil(organism.genes.armor)}`, organism.position.x + 8, organism.position.y + organism.genes.radius + 10);
    }
  }
};

function gameLoop(model: GeneticAlgorithmModel<ShapeOrganism>): void {
  display(canvas, model);
  requestAnimationFrame(() => {
    gameLoop(geneticAlgorithm.model);
  });
}

gameLoop(geneticAlgorithm.model);

/**
 * CONTROLS here!
 */
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

view.appendChild(controls);
view.appendChild(canvas);
document.querySelector("#view").appendChild(view);
