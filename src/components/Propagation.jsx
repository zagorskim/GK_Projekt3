import { Box, Stack, Button, Checkbox, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from "recoil";
import { canvas2context, paletteCount, propagationAlgorithm } from "../data/AppState";
import { imageData2 } from "../data/PropagationData";
import { imageData1, canvas1Data } from "./../data/AppState";

export default function Propagation() {
  const [alg, setAlg] = useRecoilState(propagationAlgorithm);
  const [colorCount, setColorCount] = useRecoilState(paletteCount);
  const [c2c] = useRecoilState(canvas2context);
  const [c1d, setC1d] = useRecoilState(canvas1Data);
  const id2 = useRecoilValueLoadable(imageData2);

  useEffect(() => {
    if (c1d && id2.state == "hasValue" && c2c)
      if (id2.getValue()) c2c.putImageData(id2.getValue(), 0, 0);
  }, [c1d, id2, colorCount, alg]);

  return (
    <Stack
      style={{
        padding: "2%",
        alignItems: "center",
        marginTop: "1%",
        marginBottom: "1%",
        marginRight: "1%",
        width: "32%",
        backgroundColor: "#c62828",
        borderRadius: 20,
      }}
    >
      <b style={{ textAlign: "center" }}>
        <label>Palette reduced using propagation of uncertainity algorithm</label>
      </b>
      <Stack>
        <p />
        <label style={{ textAlign: "center" }}>Algorithm used </label>
        <RadioGroup
          onChange={(e) => setAlg(e.target.value)}
          defaultValue={0}
          style={{ marginTop: 0 }}
          row
        >
          <FormControlLabel color="error" value={0} control={<Radio />} label="Floyd-Steinberg" />
          <FormControlLabel value={1} control={<Radio />} label="Burkes" />
          <FormControlLabel value={2} control={<Radio />} label="Stucky" />
        </RadioGroup>
      </Stack>
    </Stack>
  );
}
