import { Button, Slider } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import {
  canvas1context,
  canvas1Data,
  canvas2context,
  canvas3context,
  canvas4context,
  paletteCount,
  SValue,
} from "../data/AppState";

export default function ControlPanel() {
  const [c1c, setContext1] = useRecoilState(canvas1context);
  const [c2c, setContext2] = useRecoilState(canvas2context);
  const [c3c, setContext3] = useRecoilState(canvas3context);
  const [c4c, setContext4] = useRecoilState(canvas4context);
  const [c1d, setC1d] = useRecoilState(canvas1Data);
  const [S, setS] = useRecoilState(SValue);
  const [colorCount, setColorCount] = useRecoilState(paletteCount);
  const inputRef = useRef(null);

const [Sval, setSval] = useState(100);
  const loadButtonHandler = () => {
    inputRef.current.click();
  };

  const loadPreprocessing = (e) => {
    const reader = new FileReader();

    reader.readAsDataURL(e.target.files[0]);
    reader.onload = function (e) {
      const image = new Image();
      image.src = e.target.result;
      image.onload = function () {
        const height = this.height;
        const width = this.width;
        loadFile(e.target.result, height, width);
      };
    };
  };

  function loadFile(fileURL, height, width) {
    c1c.canvas.width = width;
    c1c.canvas.height = height;
    c2c.canvas.width = width;
    c2c.canvas.height = height;
    c3c.canvas.width = width;
    c3c.canvas.height = height;
    c4c.canvas.width = width;
    c4c.canvas.height = height;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.onload = () => {
      ctx.drawImage(image, 0, 0);
      const imageData = Array.from(
        ctx.getImageData(0, 0, c1c.canvas.width, c1c.canvas.height).data
      ).map((x) => x);
      let res = [];
      for (let i = 0; i < height * 4; i++)
        for (let j = 0; j < width; j++) res[i * 4 * width + j] = imageData[i * width + j];
      setC1d(res);
    };
    image.src = fileURL;
  }

function generating() {
  let data = [];
  const height = 500;
  const width = 500;
  for(let i = 0; i < height * 4; i++)
    for(let j = 0; j < width; j += 4) {
      data[i * width * 4 + j] = 255;
      data[i * width * 4 + j + 1] = 255;
      data[i * width * 4 + j + 2] = 255;
      data[i * width * 4 + j + 3] = 255;
    }
    const canvas1 = document.getElementById("canvas1");
    canvas1.width = 500;
    canvas1.height = 500;
    const canvas2 = document.getElementById("canvas2");
    canvas2.width = 500;
    canvas2.height = 500;
    const canvas3 = document.getElementById("canvas3");
    canvas3.width = 500;
    canvas3.height = 500;
    const canvas4 = document.getElementById("canvas4");
    canvas4.width = 500;
    canvas4.height = 500;
    setC1d(data);
}

  return (
    <Box
      style={{
        alignItems: "center",
        minWidth: "970px",
        padding: "15px",
        height: "100px",
        backgroundColor: "#47515d",
        borderRadius: 20,
      }}
    >
      <Stack spacing={3} margin="1.5%" direction="row">
        <Button
          style={{ minWidth: "140px" }}
          onClick={loadButtonHandler}
          size="large"
          variant="contained"
          color="error"
        >
          Load Image
        </Button>
        <Button
          style={{ minWidth: "150px" }}
          size="large"
          variant="contained"
          color="error"
          disabled
        >
          Save Results
        </Button>
        <Stack>
        <Button
          style={{ minWidth: "200px" }}
          size="large"
          variant="contained"
          color="error"
          onClick={() => {setS(Sval); generating()}}
        >
          Generate
        </Button>
        <Slider
            defaultValue={100}
            valueLabelDisplay="auto"
            step={5}
            marks
            min={1}
            max={100}
            style={{ marginLeft: "3%" }}
            onChange={(e) => setS(e.target.value)}
            color="error"
          />
        </Stack>
        <Stack width="60%">
          <b style={{ textAlign: "center" }}>
            <label>Output palette count (each channel separately)</label>
          </b>
          <Slider
            defaultValue={2}
            valueLabelDisplay="auto"
            step={1}
            marks
            min={2}
            max={60}
            style={{ marginLeft: "3%" }}
            onChange={(e) => setColorCount(e.target.value)}
            color="error"
          />
        </Stack>
      </Stack>
      <input style={{ display: "none" }} ref={inputRef} type="file" onChange={loadPreprocessing} />
    </Box>
  );
}
