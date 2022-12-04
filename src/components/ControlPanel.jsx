import { Button, Slider } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useRef } from "react";
import { useRecoilState } from "recoil";
import {
  canvas1context,
  canvas1Data,
  canvas2context,
  canvas3context,
  canvas4context,
  paletteCount,
  popularityTable,
} from "../state/CanvasState";

export default function ControlPanel() {
  const [c1c, setContext1] = useRecoilState(canvas1context);
  const [c2c, setContext2] = useRecoilState(canvas2context);
  const [c3c, setContext3] = useRecoilState(canvas3context);
  const [c4c, setContext4] = useRecoilState(canvas4context);
  const [c1d, setC1d] = useRecoilState(canvas1Data);
  const [colorCount, setColorCount] = useRecoilState(paletteCount);
  const inputRef = useRef(null);

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
        for (let j = 0; j < width; j++)
          res[i * 4 * width + j] =
            imageData[i * width + j];
      setC1d(res);
    };
    image.src = fileURL;
  }

  return (
    <Box style={{ backgroundColor: "#47515d", borderRadius: 20 }}>
      <Stack spacing={3} margin="1.5%" direction="row">
        <Button
          onClick={loadButtonHandler}
          size="large"
          variant="contained"
          color="error"
        >
          Load Image
        </Button>
        <Button size="large" variant="contained" color="error" disabled>
          Save Results
        </Button>
        <Button size="large" variant="contained" color="error" disabled>
          Transform Images
        </Button>
        <Stack width='60%'>
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
            style={{marginLeft: '3%'}}
            onChange={(e) => setColorCount(e.target.value)}
          />
        </Stack>
      </Stack>
      <input
        style={{ display: "none" }}
        ref={inputRef}
        type="file"
        onChange={loadPreprocessing}
      />
    </Box>
  );
}