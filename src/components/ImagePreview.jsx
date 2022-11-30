import {Box, Button} from '@mui/material'
import { Stack } from '@mui/system'
import { useEffect, useRef } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import { canvas1Data, canvas2Data, canvas3Data, canvas4Data, imageData1, imageData2, imageData3, imageData4, canvas1context, canvas2context, canvas3context, canvas4context } from '../state/CanvasState';
import Kmeans from './Kmeans';
import Popularity from './Popularity';
import Propagation from './Propagation';

export default function ImagePreview () {
    let canvas1, canvas2, canvas3, canvas4, context1, context2, context3, context4; //to be moved to the recoil state
    const [c1d, setC1d] = useRecoilState(canvas1Data);
    const [c2d, setC2d] = useRecoilState(canvas2Data);
    const [c3d, setC3d] = useRecoilState(canvas3Data);
    const [c4d, setC4d] = useRecoilState(canvas4Data);
    const [c1c, setc1c] = useRecoilState(canvas1context);
    const [c2c, setc2c] = useRecoilState(canvas2context);
    const [c3c, setc3c] = useRecoilState(canvas3context);
    const [c4c, setc4c] = useRecoilState(canvas4context);

    const id1 = useRecoilValue(imageData1);
    const id2 = useRecoilValue(imageData2);
    const id3 = useRecoilValue(imageData3);
    const id4 = useRecoilValue(imageData4);

    useEffect(() => {
        canvas1 = document.getElementById('canvas1');
        setc1c(canvas1.getContext('2d'))
        canvas2 = document.getElementById('canvas2');
        setc2c(canvas2.getContext('2d'))
        canvas3 = document.getElementById('canvas3');
        setc3c(canvas3.getContext('2d'))
        canvas4 = document.getElementById('canvas4');
        setc4c(canvas4.getContext('2d'))
    }, [])
    useEffect(() => {
        if(c1d && c2d && c3d && c4d && id1)
        {
            c1c.putImageData(id1, 0, 0);
            c2c.putImageData(id2, 0, 0);
            c3c.putImageData(id3, 0, 0);
            c4c.putImageData(id4, 0, 0);
        }      
    }, [c1d])


    const test = () => {
        console.log(c2d);
    }

    return (
        <Box>
            <Stack spacing={3}>
                <Box style={{padding:'2%', backgroundColor: '#47515d', borderRadius:20}}>
                    <canvas id='canvas1' style={{width: '100%', backgroundColor: 'white'}}>

                    </canvas>
                </Box>
                <Box style={{padding:'2%', backgroundColor: '#47515d', borderRadius:20}}>
                    <Stack direction='horizontal'>
                            <Propagation/>
                            <Popularity/>
                            <Kmeans/>
                    </Stack>
                    <Stack direction='horizontal'>
                            <canvas id='canvas2' style={{marginTop:'1%', marginRight: '1%', width: '32%', backgroundColor: 'white'}}>

                            </canvas>
                            <canvas id='canvas3' style={{marginTop:'1%', marginLeft: '1%', marginRight: '1%', width: '32%', backgroundColor: 'white'}}>
                                
                            </canvas>
                            <canvas id='canvas4' style={{marginTop: '1%', marginLeft: '1%', width: '32%', backgroundColor: 'white'}}>
                                
                            </canvas>
                    </Stack>
                </Box>
                <Button onClick={test}>
                    Test Button
                </Button>
            </Stack>
        </Box>
    )
}

