import { selector } from "recoil";
import {
  canvas3context,
  popularityTable,
  popularityMode,
  canvas1Data,
  paletteCount,
  generatingMode,
} from "./AppState";

export const imageData3 = selector({
  key: "imageData3",
  get: async ({ get }) => {
    const gen = get(generatingMode);
    function calculatePopularity() {
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
    }
    const ret = await calculatePopularity();
    return ret;
  },
});

export const createPopularityTable = async (data, set, gen) => {
  function calculations() {
    const pixels = [...data];
    let noDuplicates = [{ index: 1, count: 1, r: pixels[0], g: pixels[1], b: pixels[2] }];
    let flag = false;
    let currIndex = 2;
    for (let i = 4; i < pixels.length; i += 4) {
      if(gen && pixels[i] == 255 && pixels[i + 1] == 255 && pixels[i + 2] == 255) continue;
      flag = false;
      const temp = {
        index: currIndex,
        count: 1,
        r: pixels[i],
        g: pixels[i + 1],
        b: pixels[i + 2],
      };
      noDuplicates.forEach((element) => {
        if (element.r == temp.r && element.g == temp.g && element.b == temp.b) {
          flag = true;
          element.count++;
        }
      });
      if (flag == false && pixels[i] && pixels[i + 1] && pixels[i + 2]) {
        noDuplicates[currIndex] = temp;
        currIndex++;
      }
    }
    set(noDuplicates.sort((element1, element2) => element2.count - element1.count));
  }
  await calculations();
};
