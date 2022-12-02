import { Box, Button, InputLabel, Stack } from "@mui/material";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { canvas3context, imageData3, paletteCount, popularityTable } from "../state/CanvasState";

export default function Popularity() {

    const [colorCount, setColorCount] = useRecoilState(paletteCount);
    const [c3c, setC3c] = useRecoilState(canvas3context);
    const [popTable, setPopTable] = useRecoilState(popularityTable);

    const id3 = useRecoilValue(imageData3);

    useEffect(() => {
        if(c3c && id3)
            c3c.putImageData(id3, 0, 0);
    }, [colorCount, popTable])
    
    return (
        <Stack style={{padding:'2%', margin:'1%', width: '32%', backgroundColor:'#c62828', borderRadius:20}}>
            <b style={{textAlign:'center'}}><label>Palette reduced using popularity algorithm</label></b>
        </Stack>
    );
}