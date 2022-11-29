import {Box, Button} from '@mui/material'
import { Stack } from '@mui/system'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil';
import { canvas1Data } from '../state/CanvasState';

export default function ImagePreview () {
    let canvas1, canvas2, canvas3, canvas4, context1, context2, context3, context4; //to be moved to the recoil state
    const [c1d, setC1d] = useRecoilState(canvas1Data);
    useEffect(() => {
        canvas1 = document.getElementById('canvas1');
        context1 = canvas1.getContext('2d');
        context1.fillStyle = "rgb(200, 0, 0)"
        context1.fillRect(0,0, 200, 100);
        setC1d(context1.getImageData(0, 0, canvas1.width, canvas1.height));
    }, [])

    const test = () => {
        canvas1 = document.getElementById('canvas1');
        context1 = canvas1.getContext('2d');
        //let a = [...c1d.data];
        let a = context1.createImageData(c1d);
        //a.data = c1d.data;
        for(let i = 0; i < a.data.length; i+=1)
        {
            switch(i%4){
                case 0:
                    a.data[i] = 0;
                break;
                case 1:
                    a.data[i] = 255;
                break;
                case 2:
                    a.data[i] = 0;
                break;
                case 3:
                    a.data[i] = 255;
                break;
                default:
            }
        }
        let x = [{a: 0}, {b: 2}]
        console.log(x[0].a);
        context1.putImageData(a, 200, 0);
        setC1d(a);
    }

    return (
        <Box>
            <Stack>
                <canvas data={c1d} id='canvas1' style={{marginBottom: '1%', width: '100%', backgroundColor: 'white'}}>

                </canvas>
                <Stack direction='horizontal'>
                    <canvas id='canvas2' style={{marginTop:'1%', marginRight: '1%', width: '32%', backgroundColor: 'white'}}>

                    </canvas>
                    <canvas id='canvas3' style={{marginTop:'1%', marginLeft: '1%', marginRight: '1%', width: '32%', backgroundColor: 'white'}}>
                        
                    </canvas>
                    <canvas id='canvas4' style={{marginTop: '1%', marginLeft: '1%', width: '32%', backgroundColor: 'white'}}>
                        
                    </canvas>
                </Stack>
                <Button onClick={test}>
                    Test Button
                </Button>
            </Stack>
        </Box>
    )
}

