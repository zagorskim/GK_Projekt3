import { Box, Button, FormControlLabel, InputLabel, Slider, Stack } from "@mui/material";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { canvas4context, epsilonValue, paletteCount, popularityTable } from "../data/AppState";
import { imageData4 } from "../data/KmeansData";
export default function Kmeans() {
  const [eps, setEps] = useRecoilState(epsilonValue);
  const [colorCount, setColorCount] = useRecoilState(paletteCount);
  const [c4c, setC4c] = useRecoilState(canvas4context);
  const [popTable, setPopTable] = useRecoilState(popularityTable);

  const id4 = useRecoilValue(imageData4);

  useEffect(() => {
    if (c4c && id4) c4c.putImageData(id4, 0, 0);
  }, [colorCount, popTable, eps]);

  return (
    <Stack
      style={{
        padding: "2%",
        alignItems: "centre",
        marginTop: "1%",
        marginBottom: "1%",
        marginLeft: "1%",
        width: "32%",
        backgroundColor: "#c62828",
        borderRadius: 20,
      }}
    >
      <b style={{ textAlign: "center" }}>
        <label>Palette reduced using k-means algorithm</label>
      </b>
      <p />
      <label style={{ textAlign: "center" }}>Epsilon value</label>
      <Slider
        defaultValue={10}
        valueLabelDisplay="auto"
        step={5}
        marks
        min={1}
        max={100}
        onChange={(e) => {
          setEps(e.target.value);
        }}
      />
    </Stack>
  );
}
