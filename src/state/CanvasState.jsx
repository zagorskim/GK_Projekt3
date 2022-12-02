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
                  //if(i == 0 && j == 0) console.log(offset);
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
    let popTable = get(popularityTable);
    let id = null;
    if (context && popTable.length) {
      id = context.createImageData(context.canvas.width, context.canvas.height);
      let arr = get(canvas1Data);
      let colorCount = get(paletteCount);
      for (let i = 0; i < context.canvas.height * 4; i++)
        for (let j = 0; j < context.canvas.width; j++) {
          // choice of displayable pixel based on each channel separately or mutually
          // (e.g. using min square error)??? assuming hardware usage (ability to display
          // colors using 3 different diodes decided to treat channels separately)
          if (!arr[i * context.canvas.width * 4 + j]) continue;
          let color = popTable[0];
          let min = 100000;
          switch ((i * context.canvas.width + j) % 4) {
            case 0:
              for (let k = 0; k < Math.min(popTable.length, colorCount + 1); k++) {
                if (Math.abs(popTable[k].r - arr[i * context.canvas.width * 4 + j]) < min) {
                  min = Math.abs(popTable[k].r - arr[i * context.canvas.width * 4 + j]);
                  color = popTable[k];
                }
              }
              id.data[i * context.canvas.width + j] = color.r;
              break;
            case 1:
              for (let k = 0; k < Math.min(popTable.length, colorCount + 1); k++) {
                if (Math.abs(popTable[k].g - arr[i * context.canvas.width * 4 + j]) < min) {
                  min = Math.abs(popTable[k].g - arr[i * context.canvas.width * 4 + j]);
                  color = popTable[k];
                }
              }
              id.data[i * context.canvas.width + j] = color.g;
              break;
            case 2:
              for (let k = 0; k < Math.min(popTable.length, colorCount + 1); k++) {
                if (Math.abs(popTable[k].b - arr[i * context.canvas.width * 4 + j]) < min) {
                  min = Math.abs(popTable[k].b - arr[i * context.canvas.width * 4 + j]);
                  color = popTable[k];
                }
              }
              id.data[i * context.canvas.width + j] = color.b;
              break;
            case 3:
              id.data[i * context.canvas.width + j] = arr[i * context.canvas.width * 4 + j];
              break;
            default:
          }
          //console.log(color, min, colorCount);
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
      let arr = get(canvas1Data);
      const colorCount = get(paletteCount);
      const eps = get(epsilonValue);
      const popTable = get(popularityTable);

      let centroids = [];
      for (let i = 0; i < colorCount; i++) {
        console.log(Math.floor(popTable.length / 2 - (popTable.length / 2) / (i + 1)))
        centroids[i] = popTable[Math.floor(popTable.length / 2 - (popTable.length / 2) / (i + 1))]; // first choice heuristic (most popular towards 'half popular' with more density close to helf of an array)
      }
      let groups = [[]];
      // do {
      //   groups = [[]];
      //   let distances = [[]];
      //   let maxDist = 0;
      //   for (let i = 0; i < centroids.length; i++) {
      //     for (let j = 0; j < arr.length; j += 4) {
      //       distances[i][j] = Math.sqrt(
      //         Math.pow(centroids[i].r - arr[j], 2) +
      //           Math.pow(centroids[i].g - arr[j + 1], 2) +
      //           Math.pow(centroids[i].b - arr[j + 2], 2)
      //       ); // weighs for middle calculation expressed in square root error
      //       if (distances[i][j] > maxDist) maxDist = distances[i][j];
      //     }
      //   }

      //   for (let i = 0; i < distances[0].length; i += 4) {
      //     let minIndex = 0;
      //     for (let j = 0; j < distances.length; j++) {
      //       if (distances[j][i / 4] < distances[minIndex][i / 4]) minIndex = j;
      //     }
      //     groups[minIndex][groups[minIndex].length] = i;
      //   }
        
      //   let coords = [];
      //   for(let i = 0; i < groups.length; i++) {
      //     let sumR = 0;
      //     let sumG = 0;
      //     let sumB = 0;
      //     for(let j = 0; j < groups[0].length; j++) {
      //       sumR += arr[groups[i][j]];
      //       sumG += arr[groups[i][j] + 1];
      //       sumB += arr[groups[i][j] + 2];
      //     }
      //     coords[i] = [sumR / groups[i].length, sumG / groups[i].length, sumB / groups[i].length];
      //   }

      //   for(let i = 0; i < coords[i]; i++) {
      //     let minIndex = 0;
      //     let minDist = 1000;
      //     for(let j = 0; j < groups[i].length; j++)
      //       if(Math.sqrt(Math.pow(arr[groups[i][j]] - coords[i][0], 2) + Math.pow(arr[groups[i][j]] - coords[i][0], 2) + Math.pow(arr[groups[i][j]] - coords[i][0], 2)) < minDist) {
      //         minDist = Math.sqrt(Math.pow(arr[groups[i][j]] - coords[i][0], 2) + Math.pow(arr[groups[i][j]] - coords[i][0], 2) + Math.pow(arr[groups[i][j]] - coords[i][0], 2));
      //         minIndex[i] = j; 
      //       }
      //     centroids[i] = {r: arr[groups[i][minIndex[0]]], g: arr[groups[i][minIndex[0]] + 1],b: arr[groups[i][minIndex[0]] + 2]}
      //   }
      // } while (maxDist > eps);

      // for(let i = 0; i < arr.length; i += 4) {
      //   for(let k = 0; k < groups; k++)
      //     for(let l = 0; l < groups[k]; l++) {
      //       if(i == groups[k][l]) {
      //         arr[i] = centroids[k].r;
      //         arr[i + 1] = centroids[k].g;
      //         arr[i + 2] = centroids[k].b;
      //       }
      //     }
      // }

      for (let i = 0; i < context.canvas.height * 4; i++)
        for (let j = 0; j < context.canvas.width; j++) {
          id.data[i * context.canvas.width + j] = arr[i * context.canvas.width * 4 + j];
        }
    }
    return id;
  },
});
