import react from 'react';
import { Fab, Box } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const SurveyButton = () => {
    return (
        <Fab 
            size='large' 
            color="primary"
            variant="extended"
            aria-label="add" 
            style={{position: 'fixed', right:'40px', bottom: '40px'}}
            onClick = {() => {
                window.open("https://www.naver.com/")
            }}
        >
            <SendIcon />
            <Box ml={2}>
                Take Survey
            </Box>
        </Fab>
   
    )
}

export default SurveyButton;