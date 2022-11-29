import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import ImagePreview from './components/ImagePreview'
import {Box, Stack} from '@mui/material'
import ControlPanel from './components/ControlPanel'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Box style={{margin: 20, alignItems: 'center'}} className="App">
      <Stack spacing={1}>
        <ControlPanel/>
        <ImagePreview/>
      </Stack>
    </Box>
  )
}

export default App
