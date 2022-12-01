import { useRecoilValue, selector, atom, useRecoilState } from "recoil";

export const canvas1Data = atom({
  key: "canvas1Data",
  default: [,],
});
// tbd: count data on the beginning and after config changes, change data passed to selectors to calculated data
export const canvas2Data = atom({
  key: "canvas2Data",
  default: [,],
});

export const canvas3Data = atom({
  key: "canvas3Data",
  default: [,],
});

export const canvas4Data = atom({
  key: "canvas4Data",
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

export const imageData1 = selector({
  key: "imageData1",
  get: ({ get }) => {
    let context = get(canvas1context);
    let id = null;
    if (context) {
      id = context.createImageData(context.canvas.width, context.canvas.height);
      let arr = get(canvas1Data);
      for (let i = 0; i < context.canvas.height * 4; i++)
        for (let j = 0; j < context.canvas.width * 4; j++) {
          id.data[i * context.canvas.width + j] =
            arr[i * context.canvas.width + j];
        }
    }
    return id;
    },
});

// tbd: probably bugged, effect is different than presented on slides
export const imageData2 = selector({
  key: "imageData2",
  get: ({ get }) => {
    let context = get(canvas2context);
    let id = null;
    const filter = get(propagationAlgorithm) == 0 ? FloydSteinbergFilter : get(propagationAlgorithm) == 1 ? BurkesFilter : StuckyFilter;
    const colorCount = get(paletteCount);
    let err = [];
    let appr = [];
    let res = [];
    if (context) {
      id = context.createImageData(context.canvas.width, context.canvas.height);
      let arr = get(canvas1Data);
      for (let i = 0; i < context.canvas.height * 4; i++)
        for (let j = 0; j < context.canvas.width * 4; j++) {
          if((i * context.canvas.width + j) % 4 != 3) {
            appr[i * context.canvas.width + j] = Math.floor(arr[i * context.canvas.width + j] * colorCount / 256) * (256 / (colorCount - 1));
            err[i * context.canvas.width + j] = appr[i * context.canvas.width + j] - arr[i * context.canvas.width + j];
            res[i * context.canvas.width + j] = arr[i * context.canvas.width + j];
          }
          else {
            res[i * context.canvas.width + j] = arr[i * context.canvas.width + j];
          }
        }
      for (let i = 0; i < context.canvas.height * 4; i++)
        for (let j = 0; j < context.canvas.width * 4; j++) {
          if((i * context.canvas.width + j) % 4 != 3) {
            for(let k = 0; k < filter.length; k++)
              for(let l = 0; l < filter[0].length; l++)
              {
                const offset = [(k - Math.floor(filter.length / 2)) * 4, (l - Math.floor(filter[0].length / 2)) * 4];
                if(res[(i + offset[0]) * context.canvas.width + (j + offset[1])])
                  res[(i + offset[0]) * context.canvas.width + (j + offset[1])] += filter[k][l] * err[i * context.canvas.width + j] //pixel offset calculated in line
              }
          }
        }
        for (let i = 0; i < context.canvas.height * 4; i++)
        for (let j = 0; j < context.canvas.width * 4; j++)
          id.data[i * context.canvas.width + j] = res[i * context.canvas.width + j];
        // Should it be done?
          //id.data[i * context.canvas.width + j] = Math.floor(res[i * context.canvas.width + j] * colorCount / 256) * (256 / (colorCount - 1));
      }
      return id;
    },
});
 
const FloydSteinbergFilter = [
  [0, 0, 0],
  [0, 0, 7 / 16],
  [3 / 16, 5 / 16, 1 / 16],
];
const BurkesFilter = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 8/32, 4/32],
  [2/34, 4/34, 8/34, 4/34, 2/34],
];
const StuckyFilter = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 8/42, 4/42],
  [2/42, 4/42, 8/42, 4/42, 2/42],
  [1/42, 2/42, 4/42, 2/42, 1/42],
];

export const imageData3 = selector({
  key: "imageData3",
  get: ({ get }) => {
    let context = get(canvas3context);
    let id = null;
    if (context) {
      id = context.createImageData(context.canvas.width, context.canvas.height);
      let arr = get(canvas1Data);
      for (let i = 0; i < context.canvas.height * 4; i++)
        for (let j = 0; j < context.canvas.width * 4; j++) {
          id.data[i * context.canvas.width + j] =
            arr[i * context.canvas.width + j];
        }
    }
    return id;
  },
});

export const imageData4 = selector({
  key: "imageData4",
  get: ({ get }) => {
    let baseContext = get(canvas1context)
    let context = get(canvas4context);
    let id = null;
    if (context && baseContext) {
        id = context.createImageData(context.canvas.width, context.canvas.height);
        let arr = get(canvas1Data);
        for (let i = 0; i < context.canvas.height * 4; i++)
            for (let j = 0; j < context.canvas.width * 4; j++) {
            id.data[i * context.canvas.width + j] =
                arr[i * context.canvas.width + j];
            }
    }
    return id;
  },
});
