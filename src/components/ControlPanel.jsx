import { Button } from "@mui/material";
import { Box, Stack } from "@mui/system";

export default function ControlPanel() {
    return (
        <Box style={{backgroundColor:'#47515d', borderRadius:20, marginBottom:20}}>
            <Stack spacing={3} margin={2} direction='row'>
                <Button variant="contained" color='error'>
                    Load Image
                </Button>
                <Button variant="contained" color='error'>
                    Save Results
                </Button>
                <Button variant="contained" color='error'>
                    Transform Image
                </Button>
            </Stack>
        </Box>
    );
}