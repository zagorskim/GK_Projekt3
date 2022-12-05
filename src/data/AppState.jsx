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
  get: async ({ get }) => {
    function fillImageData() {
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
    }
    const ret = await fillImageData();
    return ret;
  },
});
