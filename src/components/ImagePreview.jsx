import { Box, Button, generateUtilityClass } from "@mui/material";
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
import { paletteCount, SValue } from './../data/AppState';

export default function ImagePreview() {
  let canvas1, canvas2, canvas3, canvas4; //to be moved to the recoil state
  const [c1d, setC1d] = useRecoilState(canvas1Data);
  const [c1c, setc1c] = useRecoilState(canvas1context);
  const [c2c, setc2c] = useRecoilState(canvas2context);
  const [c3c, setc3c] = useRecoilState(canvas3context);
  const [c4c, setc4c] = useRecoilState(canvas4context);
  const [S, setS] = useRecoilState(SValue);

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
    if (c1d && id1.state == "hasValue")
      if (id1.getValue()) {
        c1c.putImageData(id1.getValue(), 0, 0);
        createPopularityTable(c1d, setTable);
      }
  }, [id1]);

  useEffect(() => {
    generateImage();
  }, [S]);

function generateImage() {

  const r = 30;
  const middles = [
    {x: 250, y: 125}, 
    {x: 292, y: 166}, 
    {x: 343, y: 207}, 
    {x: 375, y: 250}, 
    {x: 343, y: 291}, 
    {x: 292, y: 332}, 
    {x: 250, y: 375}, 
    {x: 209, y: 332}, 
    {x: 168, y: 291}, 
    {x: 125, y: 250}, 
    {x: 166, y: 207}, 
    {x: 207, y: 166}
  ]
  const arcs = [
    0, 30 / 360, 60 / 360, 90 / 360, 120 / 360, 150 / 360, 180 / 360, 210 / 360, 240 / 360, 270 / 360, 300 / 360, 330 / 360
  ]
  const count = middles.length;


    for(let i = 0; i < count; i++) {
      const canvas1 = document.getElementById("canvas1");
      const ctx = canvas1.getContext("2d");
      const rgb = HSVtoRGB(arcs[i], S / 100, 1);
      console.log(rgb);
      const color = rgbToHex(rgb.r, rgb.g, rgb.b);
      drawCircle(ctx, middles[i].x, middles[i].y, r, true, color, rgb, 1);
    };
    }

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

// Function from: https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
function HSVtoRGB(h, s, v) {
  var r, g, b, i, f, p, q, t;
  if (arguments.length === 1) {
      s = h.s, v = h.v, h = h.h;
  }
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
      case 0: r = v, g = t, b = p; break;
      case 1: r = q, g = v, b = p; break;
      case 2: r = p, g = v, b = t; break;
      case 3: r = p, g = q, b = v; break;
      case 4: r = t, g = p, b = v; break;
      case 5: r = v, g = p, b = q; break;
  }
  return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
  };
}

// Function from: https://stackoverflow.com/questions/25095548/how-to-draw-a-circle-in-html5-canvas-using-javascript
function drawCircle(ctx, x, y, radius, fill, stroke, strokeWidth) {
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
  if (fill) {
    ctx.fillStyle = hexToRgb('#295734')
    ctx.fill()
  }
  if (stroke) {
    ctx.lineWidth = strokeWidth
    ctx.strokeStyle = stroke
    ctx.stroke()
  }
}

// Functions from https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
