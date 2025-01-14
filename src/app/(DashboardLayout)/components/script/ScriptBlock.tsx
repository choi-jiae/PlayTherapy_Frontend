import React, { useRef } from 'react';
import {
    Paper,
    Button,
    Typography,
    Chip,
    Box,

} from '@mui/material';
import { useScript } from '@/utils/ScriptContext';
import { useCaseInfo } from '@/utils/CaseInfoContext';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';



interface ScriptBlockProps {
    index: number;
    videoRef: React.RefObject<HTMLVideoElement>;
    setVideoRef: (ref: HTMLVideoElement) => void;
}


const ScriptBlock:React.FC<ScriptBlockProps> = ({
    index,
    videoRef,
    setVideoRef
}) => {

    
    const { ScriptState, ScriptDispatch } = useScript();
    const { CaseInfoState, CaseInfoDispatch } = useCaseInfo();
    const [isHovered, setIsHovered] = React.useState(false);
    const boxRef = useRef<HTMLDivElement>(null);



    const getSpeakerColor = (speaker: string) => {
        if (speaker.startsWith('T')) {
            return 'primary';
        } else if (speaker.startsWith('C')) {
            return 'success';
        }
        
    }

    const getSpeakerName = (speaker: string) => {
        if (speaker.startsWith('T')) {
            return '상담사';
        } else if (speaker.startsWith('C')) {
            return CaseInfoState.caseInfo.family_name+CaseInfoState.caseInfo.given_name;
        }
    }

    

    const handleTimeClick = (time: string) => {
        if (videoRef.current){
            const [ hours, minutes, seconds ] = time.split(':').map(Number);
            videoRef.current.currentTime = hours *3600 + minutes * 60 + seconds;
            videoRef.current.play();
            setVideoRef(videoRef.current);
        } else{
            console.log('videoRef is null');
        
        }

    }

    const handleMouseEnter = () => {
        setIsHovered(true);
        if (boxRef.current) {
          boxRef.current.focus();
        }
      };
    
    const addUpperBlock = (index: number) => {
        ScriptDispatch({
            type: 'ADD_UPPER_BLOCK',
            index: index
        });
    }

    const addLowerBlock = (index: number) => {
        ScriptDispatch({
            type: 'ADD_LOWER_BLOCK',
            index: index
        });
    }

    const handleEditMode = (index: number) => {
        ScriptDispatch({
            type: 'EDIT_MODE',
            index: index
        });
    }



    return (
        <Box
            onMouseEnter={() => handleMouseEnter()}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'flex-start',
                outline: 'none'}}
            >
            <div style={{display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
            <Button
                variant="outlined"
                aria-label="add"
                style={{display: isHovered ? 'flex' : 'none', width: '30px', height: '30px', borderRadius: '50%', padding: '2px', margin: '0px', boxSizing: 'border-box', minWidth: '30px', minHeight: '30px'}}
                onClick={() => addUpperBlock(index)}
            >
                <AddIcon style={{width: '20px', height: '20px'}}/>
            </Button>
            </div>
            <Paper
                square={false} 
                style={{
                    width: '100%', 
                    margin: '10px', 
                    padding: '10px', 
                    borderRadius: '15px',
                    borderColor: ScriptState.PresentScriptData.isEditMode[index] ? '#5D87FF' : 'default',
                    borderStyle: ScriptState.PresentScriptData.isEditMode[index] ? 'solid' : 'none',}}
                onClick={() => handleEditMode(index)}
                >
                
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <div style={{display: 'flex', alignItems:'center'}}>
                                <Chip 
                                    label={
                                    <Typography
                                    sx={{
                                        fontSize: '15px',
                                        fontWeight: '500',
                                    }}
                                    >
                                    {getSpeakerName(ScriptState.PresentScriptData.scriptData.scripts[index].speaker)}
                                    </Typography>
                                    
                                    }
                                    color= {getSpeakerColor(ScriptState.PresentScriptData.scriptData.scripts[index].speaker)}
                               />

  
                    <Button variant={ScriptState.PresentScriptData.isEditMode[index]? "outlined" :"text"} color="primary" size='small' 
                    style={{ borderRadius: '50px', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                        onClick={(event) => {
                            event.stopPropagation();
                            handleTimeClick(ScriptState.PresentScriptData.scriptData.scripts[index].start_time);
                        }}>
                        {ScriptState.PresentScriptData.scriptData.scripts[index].start_time}
                    </Button>
                    

                    
                    <Typography color= 'primary'>  ~  </Typography>
                        <Button variant={ScriptState.PresentScriptData.isEditMode[index]? "outlined" :"text"} color="primary" size='small'style={{ borderRadius: '50px' , padding: '5px'}}
                        onClick={(event) => {
                            event.stopPropagation();
                            handleTimeClick(ScriptState.PresentScriptData.scriptData.scripts[index].end_time);
                        }
                        }>
                        {ScriptState.PresentScriptData.scriptData.scripts[index].end_time}
                        </Button>

                    </div>
                </div>
                <div  style={{ margin: '10px 0' }}>
                    <span>{ScriptState.PresentScriptData.scriptData.scripts[index].text}</span>
                    
                </div>
            </Paper>
            <div style={{display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
            <Button
                variant="outlined"
                aria-label="add"
                style={{display: isHovered ? 'flex' : 'none', width: '30px', height: '30px', borderRadius: '50%', padding: '2px', margin: '0px', boxSizing: 'border-box', minWidth: '30px', minHeight: '30px'}}
                onClick={() => addLowerBlock(index)}
            >
                <AddIcon style={{width: '20px', height: '20px'}}/>
            </Button>
            </div>
        </Box>
    )
}

export default ScriptBlock;