import { Box, Button } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from "recoil";
import {
  canvas1Data,
  canvas1context,
  canvas2context,
  canvas3context,
  canvas4context,
  popularityTable,
  imageData1,
} from "../data/AppState";
import { imageData4 } from "../data/KmeansData";
import { imageData3, createPopularityTable } from "../data/PopularityData";
import { imageData2 } from "../data/PropagationData";
import Kmeans from "./Kmeans";
import Popularity from "./Popularity";
import Propagation from "./Propagation";
import { paletteCount } from './../data/AppState';

export default function ImagePreview() {
  let canvas1, canvas2, canvas3, canvas4, context1, context2, context3, context4; //to be moved to the recoil state
  const [c1d, setC1d] = useRecoilState(canvas1Data);
  const [c1c, setc1c] = useRecoilState(canvas1context);
  const [c2c, setc2c] = useRecoilState(canvas2context);
  const [c3c, setc3c] = useRecoilState(canvas3context);
  const [c4c, setc4c] = useRecoilState(canvas4context);
  const [colorCount, setColorCount] = useRecoilState(paletteCount);
  const id1 = useRecoilValueLoadable(imageData1);

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
    console.log(c1d);
    if (c1d && id1.state == "hasValue")
      if (id1.getValue()) {
        c1c.putImageData(id1.getValue(), 0, 0);
        createPopularityTable(c1d, setTable);
      }
  }, [id1]);

  return (
    <Box style={{ minWidth: "1000px", marginTop: "150px", width: "100%" }}>
      <Stack style={{width: '100%'}} spacing={3}>
        <Box
          style={{
            padding: "2%",
            backgroundColor: "#47515d",
            borderRadius: 20,
            alignItems: 'center'
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
