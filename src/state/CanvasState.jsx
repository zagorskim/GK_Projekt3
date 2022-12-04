import { cloneElement } from "react";
import { useRecoilValue, selector, atom, useRecoilState } from "recoil";

export const canvas1Data = atom({
  key: "canvas1Data",
  default: [,],
});

export const canvas1context = atom({
  key: "canvas1context",
  default: null,
});

export const canvas2context = atom({
  key: "canvas2context",
  default: null,
});

export const canvas3context = atom({
  key: "canvas3context",
  default: null,
});

export const canvas4context = atom({
  key: "canvas4context",
  default: null,
});

export const epsilonValue = atom({
  key: "epsilonValue",
  default: 12,
});

export const paletteCount = atom({
  key: "paletteCount",
  default: 2,
});

export const propagationAlgorithm = atom({
  key: "propagationAlgorithm",
  default: 0,
});

export const popularityTable = atom({
  key: "popularityTable",
  default: {},
});

export const popularityMode = atom({
  key: "popularityMode",
  default: {},
});

export const imageData1 = selector({
  key: "imageData1",
  get: ({ get }) => {
    let context = get(canvas1context);
    let id = null;
    if (context) {
      id = context.createImageData(context.canvas.width, context.canvas.height);
      let arr = get(canvas1Data);
      for (let i = 0; i < context.canvas.height * 4; i++)
        for (let j = 0; j < context.canvas.width; j++) {
          id.data[i * context.canvas.width + j] = arr[i * context.canvas.width * 4 + j];
        }
    }
    return id;
  },
});

// tbd: probably bugged, effect is different than presented on slides
export const imageData2 = selector({
  key: "imageData2",
  get: ({ get }) => {
    let id = null;
    const filter =
      get(propagationAlgorithm) == 0
        ? FloydSteinbergFilter
        : get(propagationAlgorithm) == 1
        ? BurkesFilter
        : StuckyFilter;
    const colorCount = get(paletteCount);
    const context = get(canvas2context);
    let res = [];
    if (context) {
      id = context.createImageData(context.canvas.width, context.canvas.height);
      let res = [...get(canvas1Data)];

      for (let i = 0; i < context.canvas.height * 4; i++)
        for (let j = 0; j < context.canvas.width; j++) {
          {
            let K = 0;
            K = Approx(res[i * context.canvas.width * 4 + j], colorCount);
            id.data[i * context.canvas.width + j] = K;
            let err = 0;
            err = res[i * context.canvas.width * 4 + j] - K;

            if ((i * context.canvas.width + j) % 4 != 3) {
              for (let k = 0; k < filter.length; k++)
                for (let l = 0; l < filter[0].length; l++) {
                  const offset = [
                    (k - Math.floor(filter.length / 2)) * 4,
                    (l - Math.floor(filter[0].length / 2)) * 4,
                  ];
                  if (res[(i + offset[0]) * context.canvas.width * 4 + (j + offset[1])])
                    res[(i + offset[0]) * context.canvas.width * 4 + (j + offset[1])] +=
                      filter[k][l] * err; //pixel offset calculated in line
                }
            }
          }
        }
    }
    return id;
  },
});

const Approx = (color, colorCount) => {
  return Math.floor(color / (256 / colorCount)) * (255 / (colorCount - 1));
};

const FloydSteinbergFilter = [
  [0, 0, 0],
  [0, 0, 7 / 16],
  [3 / 16, 5 / 16, 1 / 16],
];
const BurkesFilter = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 8 / 32, 4 / 32],
  [2 / 34, 4 / 34, 8 / 34, 4 / 34, 2 / 34],
];
const StuckyFilter = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 8 / 42, 4 / 42],
  [2 / 42, 4 / 42, 8 / 42, 4 / 42, 2 / 42],
  [1 / 42, 2 / 42, 4 / 42, 2 / 42, 1 / 42],
];

export const imageData3 = selector({
  key: "imageData3",
  get: ({ get }) => {
    let context = get(canvas3context);
    const popTable = get(popularityTable);
    const popMode = get(popularityMode);
    let id = null;
    if (context && popTable.length) {
      id = context.createImageData(context.canvas.width, context.canvas.height);
      const arr = get(canvas1Data);
      let res = [];
      let colorCount = get(paletteCount);
      for (let i = 0; i < context.canvas.height * 4; i++)
        for (let j = 0; j < context.canvas.width; j++) {
          // choice of displayable pixel based on each channel separately or mutually
          // (e.g. using min square error)??? assuming hardware usage (ability to display
          // colors using 3 different diodes decided to treat channels separately (effectively more colors))
          if (!arr[i * context.canvas.width * 4 + j]) {
            res[i * context.canvas.width * 4 + j] = 255; 
             continue;
          }
          let color = popTable[0];
          let min = 100000;
          if (popMode == 1) {
            switch ((i * context.canvas.width + j) % 4) {
              case 0:
                for (let k = 0; k < Math.min(popTable.length, colorCount + 1); k++) {
                  if (Math.abs(popTable[k].r - arr[i * context.canvas.width * 4 + j]) < min) {
                    min = Math.abs(popTable[k].r - arr[i * context.canvas.width * 4 + j]);
                    color = popTable[k];
                  }
                }
                res[i * context.canvas.width + j] = color.r;
                break;
              case 1:
                for (let k = 0; k < Math.min(popTable.length, colorCount + 1); k++) {
                  if (Math.abs(popTable[k].g - arr[i * context.canvas.width * 4 + j]) < min) {
                    min = Math.abs(popTable[k].g - arr[i * context.canvas.width * 4 + j]);
                    color = popTable[k];
                  }
                }
                res[i * context.canvas.width + j] = color.g;
                break;
              case 2:
                for (let k = 0; k < Math.min(popTable.length, colorCount + 1); k++) {
                  if (Math.abs(popTable[k].b - arr[i * context.canvas.width * 4 + j]) < min) {
                    min = Math.abs(popTable[k].b - arr[i * context.canvas.width * 4 + j]);
                    color = popTable[k];
                  }
                }
                res[i * context.canvas.width + j] = color.b;
                break;
              case 3:
                res[i * context.canvas.width + j] = arr[i * context.canvas.width * 4 + j];
                break;
              default:
            }
          } else {
            if ((i * context.canvas.width + j) % 4 == 3) {
              res[i * context.canvas.width + j] = arr[i * context.canvas.width * 4 + j];
            } else if ((i * context.canvas.width + j) % 4 == 0) {
              for (let k = 0; k < Math.min(popTable.length, colorCount + 1); k++) {
                if (
                  Math.abs(popTable[k].r - arr[i * context.canvas.width * 4 + j]) +
                    Math.abs(popTable[k].g - arr[i * context.canvas.width * 4 + j + 1]) +
                    Math.abs(popTable[k].b - arr[i * context.canvas.width * 4 + j + 2]) <
                  min
                ) {
                  min =
                    Math.abs(popTable[k].r - arr[i * context.canvas.width * 4 + j]) +
                    Math.abs(popTable[k].g - arr[i * context.canvas.width * 4 + j + 1]) +
                    Math.abs(popTable[k].b - arr[i * context.canvas.width * 4 + j + 2]);
                  color = popTable[k];
                }
              }
              res[i * context.canvas.width + j] = color.r;
              res[i * context.canvas.width + j + 1] = color.g;
              res[i * context.canvas.width + j + 2] = color.b;
            }
          }
        }
        for (let i = 0; i < context.canvas.height * 4; i++)
          for (let j = 0; j < context.canvas.width; j++) {
            id.data[i * context.canvas.width + j] = res[i * context.canvas.width + j];
    }
    }

    return id;
  },
});

export const imageData4 = selector({
  key: "imageData4",
  get: ({ get }) => {
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
        console.log(maxChange);
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
        debugCounter++;
      } while (maxChange > eps);

      for (let i = 0; i < context.canvas.height * 4; i++)
        for (let j = 0; j < context.canvas.width; j++) {
          id.data[i * context.canvas.width + j] = res[i * context.canvas.width * 4 + j];
        }
    }
    return id;
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
