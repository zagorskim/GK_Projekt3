import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import ImagePreview from './components/ImagePreview'
import {Box, Stack} from '@mui/material'
import ControlPanel from './components/ControlPanel'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Box style={{margin:'2%', alignItems: 'center'}} className="App">
      <Stack spacing={3} style={{alignItems: 'stretch'}}>
        <Box position='fixed' style={{width:'96%', alignItems: 'center'}}>
          <ControlPanel/>
        </Box>
        <ImagePreview/>
      </Stack>
    </Box>
  )
}

export default App
