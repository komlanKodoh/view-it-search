import { CheckboxInputHandler } from "./Components/CheckBoxInputHandler";
import { SingleFieldInputHandler } from "./Components/SingleFieldInputHandler";
import { ExecutionControl } from "./Renderer/ExecutionControls";
import Renderer from "./Renderer/Renderer";
import { binarySearch } from "./SearchAlgorithm/binarySearch";
import { funkySearch } from "./SearchAlgorithm/doubleLinear";
import { linearSearch } from "./SearchAlgorithm/linearSearch";
import justGoingForIt from "./SearchAlgorithm/randomSearch";
import { SearchGeneratorCreator } from "./SearchAlgorithm/SearchGenerator";
import { getArray } from "./utils/getArray";
import { getRandomInt } from "./utils/getRandomInt";

const arrayInput = new SingleFieldInputHandler(
  "array-input",
  "1 2 3 4 5 6 7 8 9"
);
const algorithmType = new CheckboxInputHandler("search-algorithm", {
  binarySearch: true,
  funkySearch: true,
});
const target = new SingleFieldInputHandler("target-input", "3");
const arrayLength = new SingleFieldInputHandler("length-input", "8");

function SyncLengthToArray() {
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

const visualizationCanvas = document.getElementById(
  "visualization-canvas"
) as HTMLDivElement;
let renderer = new Renderer(visualizationCanvas);

export const implementedAlgorithm: { [key: string]: SearchGeneratorCreator } = {
  funkySearch,
  linearSearch,
  binarySearch,
  justGoingForIt,
};

const getAlgorithms = (algorithmHashMap: { [key: string]: any }) => {
  return Object.keys(algorithmHashMap).filter(
    (algorithmName) =>
      algorithmHashMap[algorithmName] && implementedAlgorithm[algorithmName]
  );
};

const update = () => {
  renderer.render(
    getArray(arrayInput.value),
    parseInt(target.value),
    getAlgorithms(algorithmType.choices) as any
  );
};

algorithmType.addEventListener("change", update);

target.onChange = update;

const controls = new ExecutionControl(renderer).bindTo(
  document.getElementById("run-pause") as HTMLDivElement
);

document.getElementById( "reset-algorithm" )?.addEventListener("click", () => {
  renderer.clean({});
  update();
});
SyncLengthToArray();

update();

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

document
  .getElementById("randomize-algorithm")
  ?.addEventListener("click", () => {
    const len = parseInt(arrayLength.value);

    let newArray: number[] = [getRandomInt(3, 5)];

    if (len < newArray.length) {
      newArray = newArray.slice(0, len);
    } else if (len > newArray.length) {
      while (len > newArray.length) {
        newArray.push(newArray[newArray.length - 1] + getRandomInt(3, 5));
      }
    }

    arrayInput.value = newArray.join(" ");

    target.value = newArray[getRandomInt(0, len)] + "";
    update();
  });