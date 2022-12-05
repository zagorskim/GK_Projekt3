import { Box, Button, FormControlLabel, InputLabel, Radio, RadioGroup, Stack } from "@mui/material";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { canvas3context, paletteCount, popularityMode, popularityTable } from "../data/AppState";
import { imageData3 } from "../data/PopularityData";

export default function Popularity() {
  const [colorCount, setColorCount] = useRecoilState(paletteCount);
  const [c3c, setC3c] = useRecoilState(canvas3context);
  const [popTable, setPopTable] = useRecoilState(popularityTable);
  const [mode, setMode] = useRecoilState(popularityMode);

  const id3 = useRecoilValue(imageData3);

  useEffect(() => {
    if (c3c && id3) c3c.putImageData(id3, 0, 0);
  }, [colorCount, popTable, mode]);

  // control to change calculating mode to be added (counting channels mutually or separately)
  return (
    <Stack
      style={{
        padding: "2%",
        margin: "1%",
        width: "32%",
        backgroundColor: "#c62828",
        borderRadius: 20,
        alignItems: "center",
      }}
    >
      <b style={{ textAlign: "center" }}>
        <label>Palette reduced using popularity algorithm</label>
      </b>
      <p />
      <label style={{ textAlign: "center" }}>Channels </label>
      <RadioGroup
        onChange={(e) => setMode(e.target.value)}
        defaultValue={0}
        style={{ marginTop: 0 }}
        row
      >
        <FormControlLabel color="error" value={0} control={<Radio />} label="Mutually" />
        <FormControlLabel value={1} control={<Radio />} label="Separately" />
      </RadioGroup>
    </Stack>
  );
}
