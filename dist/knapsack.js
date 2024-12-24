const MUTATION_CHANCE = 0.01;
const POPULATION_SIZE = 10;
const FRAME_DELAY = 40;
const CANVAS_HEIGHT = 250;
const CANVAS_WIDTH = 250;
const canvas = document.createElement("canvas");
canvas.height = CANVAS_HEIGHT;
canvas.width = CANVAS_WIDTH;
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
let playButton = document.createElement("button");
playButton.innerText = "▶ play ";
playButton.addEventListener("click", () => {
    // geneticAlgorithm.play();
});
let pauseButton = document.createElement("button");
pauseButton.innerText = "⏸ pause";
pauseButton.addEventListener("click", () => {
    // geneticAlgorithm.pause();
});
let resetButton = document.createElement("button");
resetButton.innerText = "⟲ reset";
resetButton.addEventListener("click", () => {
    // geneticAlgorithm.reset();
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
title.innerText = "Knapsack problem";
title.style.position = "absolute";
title.style.left = "0px";
title.style.top = "0px";
title.style.padding = "0.25rem";
title.style.transform = "translateY(-100%)";
title.style.fontSize = "0.75rem";
// append the whole view
view.appendChild(canvas);
view.appendChild(title);
view.appendChild(controls);
document.querySelector("#view").appendChild(view);
export {};
