import { Box, Button } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  canvas1Data,
  imageData1,
  imageData2,
  imageData3,
  imageData4,
  canvas1context,
  canvas2context,
  canvas3context,
  canvas4context,
  popularityTable,
} from "../state/CanvasState";
import Kmeans from "./Kmeans";
import Popularity from "./Popularity";
import Propagation from "./Propagation";

export default function ImagePreview() {
  let canvas1,
    canvas2,
    canvas3,
    canvas4,
    context1,
    context2,
    context3,
    context4; //to be moved to the recoil state
  const [c1d, setC1d] = useRecoilState(canvas1Data);
  const [c1c, setc1c] = useRecoilState(canvas1context);
  const [c2c, setc2c] = useRecoilState(canvas2context);
  const [c3c, setc3c] = useRecoilState(canvas3context);
  const [c4c, setc4c] = useRecoilState(canvas4context);

  const id1 = useRecoilValue(imageData1);
  const id2 = useRecoilValue(imageData2);
  const id3 = useRecoilValue(imageData3);
  const id4 = useRecoilValue(imageData4);

  const [table, setTable] = useRecoilState(popularityTable);

  useEffect(() => {
    canvas1 = document.getElementById("canvas1");
    setc1c(canvas1.getContext("2d"));
    canvas2 = document.getElementById("canvas2");
    setc2c(canvas2.getContext("2d"));
    canvas3 = document.getElementById("canvas3");
    setc3c(canvas3.getContext("2d"));
    canvas4 = document.getElementById("canvas4");
    setc4c(canvas4.getContext("2d"));
  }, []);

  useEffect(() => {
    if (c1d && id1) {
      c1c.putImageData(id1, 0, 0);
      createPopularityTable(c1d, setTable);

      if (id2) c2c.putImageData(id2, 0, 0);
      if (id3) c3c.putImageData(id3, 0, 0);
      if (id4) c4c.putImageData(id4, 0, 0);
    }
  }, [c1d]);

  return (
    <Box style={{marginTop: 170, width: '100%'}}>
      <Stack spacing={3}>
        <Box
          style={{
            padding: "2%",
            backgroundColor: "#47515d",
            borderRadius: 20,
          }}
        >
          <Stack
            style={{
              padding: "2%",
              alignItems: "center",
              marginTop: "1%",
              marginBottom: "2%",
              marginRight: "1%",
              width: "96%",
              backgroundColor: "#c62828",
              borderRadius: 20, 
            }}
            
          >
            <b style={{ textAlign: "center" }}>
              <label>Original image</label>
            </b>
          </Stack>
          <canvas
            id="canvas1"
            style={{ width: "100%", backgroundColor: "white" }} // tbd: width to be changed back to 100%
          ></canvas>
        </Box>
        <Box
          style={{
            padding: "2%",
            backgroundColor: "#47515d",
            borderRadius: 20,
          }}
        >
          <Stack direction="row">
            <Propagation />
            <Popularity />
            <Kmeans />
          </Stack>
          <Stack direction="row">
            <canvas
              id="canvas2"
              style={{
                marginTop: "1%",
                marginRight: "1%",
                width: "32%",
                backgroundColor: "white",
              }}
            ></canvas>
            <canvas
              id="canvas3"
              style={{
                marginTop: "1%",
                marginLeft: "1%",
                marginRight: "1%",
                width: "32%",
                backgroundColor: "white",
              }}
            ></canvas>
            <canvas
              id="canvas4"
              style={{
                marginTop: "1%",
                marginLeft: "1%",
                width: "32%",
                backgroundColor: "white",
              }}
            ></canvas>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}

const createPopularityTable = (data, set) => {
  const pixels = [...data];
  let noDuplicates = [
    { index: 1, count: 1, r: pixels[0], g: pixels[1], b: pixels[2] },
  ];
  let flag = false;
  let currIndex = 2;
  for (let i = 4; i < pixels.length; i += 4) {
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
  set(
    noDuplicates.sort((element1, element2) => element2.count - element1.count)
  );
};
