import { SingleFieldInputHandler } from "./Components/SingleFieldInputHandler";
import { ExecutionControl } from "./Renderer/ExecutionControls";
import Renderer from "./Renderer/Renderer";
import { getArray } from "./utils/getArray";
import { getRandomInt } from "./utils/getRandomInt";
import Algorithm from "./Visualizer/LinearArray/Algorithm/index";
import LinearArray from "./Visualizer/LinearArray/index";

// Input controlling the content of the array
const arrayInput = new SingleFieldInputHandler(
  "array-input",
  "1 2 3 4 5 6 7 8 9"
);

// Input controlling the length of the array
const arrayLength = new SingleFieldInputHandler("length-input", "9");

// const algorithmType = new CheckboxInputHandler("search-algorithm", {
//   binarySearch: true,
//   funkySearch: true,
// });
const target = new SingleFieldInputHandler("target-input", "3");

// const visualizationCanvas = document.getElementById(
//   "visualization-canvas"
// ) as HTMLElement;
// let renderer = new Renderer(visualizationCanvas);

// export const implementedAlgorithm = {
//   funkySearch,
//   linearSearch,
//   binarySearch,
//   justGoingForIt,
// };

// const getAlgorithms = (algorithmHashMap: { [key: string]: any }) => {
//   return Object.keys(algorithmHashMap).filter(
//     (algorithmName) => algorithmHashMap[algorithmName]
//   );
// };

// algorithmType.addEventListener("change", update);

// update();

// document
//   .getElementById("randomize-algorithm")
//   ?.addEventListener("click", () => {
//     const len = parseInt(arrayLength.value);

//     let newArray: number[] = [getRandomInt(3, 5)];

//     if (len < newArray.length) {
//       newArray = newArray.slice(0, len);
//     } else if (len > newArray.length) {
//       while (len > newArray.length) {
//         newArray.push(newArray[newArray.length - 1] + getRandomInt(3, 5));
//       }
//     }

//     arrayInput.value = newArray.join(" ");

//     target.value = newArray[getRandomInt(0, len)] + "";
//     update();
//   });

const visualizationCanvas = document.getElementById(
  "visualization-canvas"
) as HTMLElement;

let renderer = new Renderer(visualizationCanvas);

// creation of a controller to serve as an interface between the ui and the renderer;
const controls = new ExecutionControl(renderer).bindTo(
  document.getElementById("run-pause") as HTMLElement
);

renderer.createFrame("Linear Search").init();
renderer.createFrame("Binary Search").init();

document.getElementById("run-algorithm")?.addEventListener("click", () => {
  controls.execute();
});

document.getElementById("rewind-algorithm")?.addEventListener("click", () => {
  renderer.moveBackward();
});

document.getElementById("pause-algorithm")?.addEventListener("click", () => {
  controls.stopExecution();
});

document.getElementById("advance-algorithm")?.addEventListener("click", () => {
  renderer.moveForward();
});

document.getElementById("reset-algorithm")?.addEventListener("click", () => {
  renderer.moveToIndex(1);
});

const update = () => {

  renderer
    .getFrame("Linear Search")
    .setVisualizer(
      (container) =>
        new LinearArray.Visualizer(
          container,
          Algorithm.linearSearch(
            getArray(arrayInput.value),
            parseInt(target.value)
          )
        )
    );

  renderer
    .getFrame("Binary Search")
    .setVisualizer(
      (container) =>
        new LinearArray.Visualizer(
          container,
          Algorithm.binarySearch(
            getArray(arrayInput.value),
            parseInt(target.value)
          )
        )
    );

  renderer.moveToIndex(1);
};

target.onChange = update;

{
  arrayInput.onChange = function (e?: Event) {
    arrayLength.value = getArray(arrayInput.value).length + "";
    update();
  };

  arrayLength.onChange = function (e?: Event) {
    let newArray = getArray(arrayInput.value);
    let desiredLength = parseInt(arrayLength.value);

    if (desiredLength < newArray.length) {
      newArray = newArray.slice(0, desiredLength);
    } else if (desiredLength > newArray.length) {
      while (desiredLength > newArray.length) {
        newArray.push(newArray[newArray.length - 1] + getRandomInt(3, 5));
      }
    }

    arrayInput.value = newArray.join(" ");
    update();
  };
}

window.addEventListener("resize", () => {
  setTimeout(() => renderer.rerender(), 200);
});

update();
