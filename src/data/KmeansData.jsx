import { selector } from "recoil";
import {
  canvas4context,
  popularityTable,
  canvas1Data,
  paletteCount,
  epsilonValue,
  generatingMode,
} from "./AppState";

export const imageData4 = selector({
  key: "imageData4",
  get: async ({ get }) => {
    const gen = get(generatingMode);
    function calculateKmeans() {
      let context = get(canvas4context);
      let popTable = get(popularityTable);
      let id = null;
      if (context && popTable.length) {
        id = context.createImageData(context.canvas.width, context.canvas.height);
        let arr = [...get(canvas1Data)];
        let res = [...arr];
        const colorCount = get(paletteCount);
        const eps = get(epsilonValue);
        let popTable = [...get(popularityTable)];
        let maxDist = 1000;
        let maxChange = 0;
        let centroids = [];
        for (let i = 0; i < colorCount; i++) {
          //centroids[i] = Math.floor(Math.random() * popTable.length - 1); // random first color pick
          centroids[i] = Math.floor(popTable.length / 2 - popTable.length / 2 / (i + 1)); // first choice heuristic (most popular towards 'half popular' with more density close to helf of an array)
        }
        let groups = createArray(colorCount, 1);
        let distances = createArray(colorCount, 1);
        let debugCounter = 0;
        do {
          for (let i = 0; i < centroids.length; i++) {
            for (let j = 0; j < res.length; j += 4) {
              distances[i][j / 4] =
                (Math.abs(popTable[centroids[i]].r - res[j]) +
                  Math.abs(popTable[centroids[i]].g - res[j + 1]) +
                  Math.abs(popTable[centroids[i]].b - res[j + 2])) /
                3; // weighs for middle calculation expressed in simple aritmethic mean
              // Math.sqrt(
              //   Math.pow(popTable[centroids[i]].r - res[j], 2) +
              //     Math.pow(popTable[centroids[i]].g - res[j + 1], 2) +
              //     Math.pow(popTable[centroids[i]].b - res[j + 2], 2)
              //); // weighs for middle calculation expressed in square root error
              if (distances[i][j / 4] > maxDist) maxDist = distances[i][j];
            }
          }

          for (let i = 0; i < res.length; i += 4) {
            let minIndex = 0;
            for (let j = 0; j < distances.length; j++) {
              if (distances[j][i / 4] <= distances[minIndex][i / 4]) minIndex = j;
            }
            groups[minIndex][groups[minIndex].length] = i;
            res[i] = popTable[centroids[minIndex]].r;
            res[i + 1] = popTable[centroids[minIndex]].g;
            res[i + 2] = popTable[centroids[minIndex]].b;
            res[i + 3] = 255;
          }

          let coords = [[0], [0]];
          for (let i = 0; i < groups.length; i++) {
            let sumR = 0;
            let sumG = 0;
            let sumB = 0;
            let counter1 = 0;
            let counter2 = 0;
            let counter3 = 0;
            for (let j = 0; j < groups[i].length; j++) {
              if (res[groups[i][j]]) {
                sumR += res[groups[i][j]];
                counter1++;
              }

              if (res[groups[i][j] + 1]) {
                sumG += res[groups[i][j] + 1];
                counter2++;
              }
              if (res[groups[i][j]] + 2) {
                sumB += res[groups[i][j] + 2];
                counter3++;
              }
            }
            if (
              (Math.abs(Math.floor(sumR / counter1) - popTable[centroids[i]].r) +
                Math.abs(Math.floor(sumG / counter2) - popTable[centroids[i]].g) +
                Math.abs(Math.floor(sumB / counter3) - popTable[centroids[i]].b)) /
                3 >
              maxChange
            ) {
              maxChange =
                (Math.abs(Math.floor(sumR / counter1) - popTable[centroids[i]].r) +
                  Math.abs(Math.floor(sumG / counter2) - popTable[centroids[i]].g) +
                  Math.abs(Math.floor(sumB / counter3) - popTable[centroids[i]].b)) /
                3;
            }
            //console.log(Math.floor(sumR / counter1) - popTable[centroids[i]].r)
            coords[i] = [sumR / counter1, sumG / counter2, sumB / counter3];
            centroids[i] = i;
            popTable[i] = { r: 0, g: 0, b: 0 };
            popTable[centroids[i]].r = Math.floor(sumR / counter1);
            popTable[centroids[i]].g = Math.floor(sumG / counter2);
            popTable[centroids[i]].b = Math.floor(sumB / counter3);
          }
          {
            // for (let i = 0; i < coords.length; i++) {
            //   let minIndex = 0;
            //   for (let j = 0; j < groups[i].length; j++) {
            //     if (
            //       Math.abs(
            //         res[groups[i][j]] -
            //           coords[i][0] +
            //           Math.abs(res[groups[i][j]] - coords[i][0]) +
            //           Math.abs(res[groups[i][j]] - coords[i][0])
            //       ) /
            //         3 <
            //       minDist
            //     ) {
            //       minDist =
            //         Math.abs(
            //           res[groups[i][j]] -
            //             coords[i][0] +
            //             Math.abs(res[groups[i][j]] - coords[i][0]) +
            //             Math.abs(res[groups[i][j]] - coords[i][0])
            //         ) / 3;
            //       minIndex = j;
            //     }
            //   }
            //   // TBD: last element of popTable undefined???
            //   for (let j = 0; j < popTable.length - 1; j++) {
            //     if (
            //       popTable[j].r == res[groups[i][minIndex]] &&
            //       popTable[j].g == res[groups[i][minIndex] + 1] &&
            //       popTable[j].b == res[groups[i][minIndex] + 2]
            //     ) {
            //       if (
            //         (Math.abs(popTable[j].r - coords[i][0]) +
            //           Math.abs(popTable[j].g - coords[i][1]) +
            //           Math.abs(popTable[j].b - coords[i][2])) /
            //           3 >
            //         maxChange
            //       ) {
            //         maxChange =
            //           (Math.abs(popTable[j].r - coords[i][0]) +
            //             Math.abs(popTable[j].g - coords[i][1]) +
            //             Math.abs(popTable[j].b - coords[i][2])) /
            //           3;
            //       }
            //       centroids[i] = j;
            //       console.log("found!", maxChange);
            //       break;
            //     }
            //   }
            // }
          }
          debugCounter++;
        } while (maxChange > eps);
        if (!gen) {
          for (let i = 0; i < context.canvas.height * 4; i++)
            for (let j = 0; j < context.canvas.width; j++) {
              id.data[i * context.canvas.width + j] = res[i * context.canvas.width * 4 + j];
            }
        } else {
          for (let i = 0; i < context.canvas.height * 4; i++)
            for (let j = 0; j < context.canvas.width; j++) {

              id.data[i * context.canvas.width + j] = res[i * context.canvas.width + j];
            }
        }
      }
      return id;
    }
    return await calculateKmeans();
  },
});
function createArray(length) {
  var arr = new Array(length || 0),
    i = length;

  if (arguments.length > 1) {
    var args = Array.prototype.slice.call(arguments, 1);
    while (i--) arr[length - 1 - i] = createArray.apply(this, args);
  }

  return arr;
}
