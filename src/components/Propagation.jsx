import { Box, Stack, Button, Checkbox, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { useRecoilState } from "recoil";
import { canvas2Data } from "../state/CanvasState";

export default function Propagation() {

    const [c2d, setC2d] = useRecoilState(canvas2Data);

    return (
        <Stack style={{padding:'2%', alignItems:'center', marginTop:'1%', marginBottom:'1%', marginRight: '1%', width: '32%', backgroundColor:'#c62828', borderRadius:20}}>
            <b style={{textAlign:'center'}}><label >Palette reduced using propagation of uncertainity algorithm</label></b>
            <Stack>
                <RadioGroup defaultValue={0} style={{marginTop:20}} row>
                    <FormControlLabel color='error' value={0} control={<Radio/>} label="Floyd-Steinberg" />
                    <FormControlLabel value={1} control={<Radio />} label="Burkes" />
                    <FormControlLabel value={2} control={<Radio />} label="Stucky" />
                </RadioGroup>
            </Stack>
        </Stack>
    );
}