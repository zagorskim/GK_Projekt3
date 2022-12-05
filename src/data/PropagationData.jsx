import { selector } from "recoil";
import { canvas2context, paletteCount, propagationAlgorithm, canvas1Data } from "./AppState";

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
