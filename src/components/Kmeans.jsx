import {
  Box,
  Button,
  FormControlLabel,
  InputLabel,
  Slider,
  Stack,
} from "@mui/material";

export default function Kmeans() {
  const [k, setk] = [0, 0];

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
      <p/>
      <label style={{ textAlign: "center" }}>Epsilon value</label>
      <Slider
        defaultValue={10}
        getAriaValueText={k}
        valueLabelDisplay="auto"
        step={5}
        marks
        min={1}
        max={100}
      />
    </Stack>
  );
}
