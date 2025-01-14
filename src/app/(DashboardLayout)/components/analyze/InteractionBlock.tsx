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



interface InteractionBlockProps {
    index: number;
    child_speak: string;
    teacher_speak: string;
    description: string;

}


const ScriptBlock:React.FC<InteractionBlockProps> = ({
    index,
    child_speak,
    teacher_speak,
    description
}) => {

    const { CaseInfoState, CaseInfoDispatch } = useCaseInfo();
    const [isClicked, setIsClicked] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);
    const boxRef = useRef<HTMLDivElement>(null);


    const handleMouseEnter = () => {
        setIsHovered(true);
        if (boxRef.current) {
          boxRef.current.focus();
        }
      };



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
            <Paper
                square={false} 
                style={{
                    width: '100%', 
                    margin: '10px', 
                    padding: '10px', 
                    borderRadius: '15px',
                    borderColor: isClicked ? '#5D87FF' : 'default',
                    borderStyle: isClicked ? 'solid' : 'none',}}
                onClick={() => setIsClicked(!isClicked)}
                >
                <div  style={{ margin: '10px 0' }}>
                    <span>{child_speak}</span>
                    <br />
                    <span>{teacher_speak}</span>
                </div>
                {
                    isClicked &&
                    <div style={{ margin: '10px 0' }}>
                        <Typography variant="body1" style={{ margin: '5px 0' }}>{description}</Typography>
                    </div>
                }
            </Paper>
        </Box>
    )
}

export default ScriptBlock;