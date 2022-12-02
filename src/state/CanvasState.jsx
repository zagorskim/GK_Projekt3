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

export const kValue = atom({
  key: "kValue",
  default: 11,
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
    let baseContext = get(canvas1context);
    let context = get(canvas4context);
    let id = null;
    if (context && baseContext) {
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
