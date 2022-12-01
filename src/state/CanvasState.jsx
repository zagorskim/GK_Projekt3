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

// tbd: implement algorithms inside selectors using state made from config set in controls, order of pixels in arr to be solved 
export const imageData2 = selector({
  key: "imageData2",
  get: ({ get }) => {
    let context = get(canvas2context);
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
