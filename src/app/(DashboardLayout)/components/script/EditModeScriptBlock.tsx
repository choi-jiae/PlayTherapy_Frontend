import React, {useState} from 'react';
import {
    Paper,
    Button,
    Typography,
    Chip,
    Box,
    IconButton,
    Menu,
    MenuItem,
    InputBase

} from '@mui/material';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { useScript } from '@/utils/ScriptContext';
import { useCaseInfo } from '@/utils/CaseInfoContext';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeField } from '@mui/x-date-pickers/TimeField';

import dayjs from 'dayjs';
import { set } from 'lodash';


interface EditModeScriptBlockProps {
    index: number;
}


const EditModeScriptBlock:React.FC<EditModeScriptBlockProps> = ({
    index,
}) => {

    
    const { ScriptState, ScriptDispatch } = useScript();
    const { CaseInfoState, CaseInfoDispatch } = useCaseInfo();
    const [isHovered, setIsHovered] = useState(false);
    const [cursorPosition, setCursorPosition] = useState<number | null>(null);
    const [ text, setText ] = useState<string>(ScriptState.PresentScriptData.scriptData.scripts[index].text);



    const getSpeakerColor = (speaker: string) => {
        if (speaker.startsWith('T')) {
            return 'primary';
        } else if (speaker.startsWith('S')) {
            return 'default';
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

    const handleBlockDeleteClick = (index: number) => {
        ScriptDispatch({
            type: 'DELETE_CLICK',
            index: index
        });
        console.log(ScriptState.UndoStack)
    }

    const handleChangeSpeaker = (index: number, speaker: string) => {
        ScriptDispatch({
            type: 'CHANGE_SPEAKER',
            index: index,
            speaker: speaker
        });
    }

    const divideSpeaker = async (index: number, cursorPosition: number) => {
        ScriptDispatch({
            type: 'DIVIDE_SPEAKER',
            index: index,
            cursorPosition: cursorPosition
        })
    }

    const handleKeyDown = async (e: React.KeyboardEvent, index: number) => {
        
        if (e.key === 'Enter' && cursorPosition){
            e.stopPropagation();
            await divideSpeaker(index, cursorPosition);
            setText(ScriptState.PresentScriptData.scriptData.scripts[index].text);
        }
        
    }

    const handleSelect = (e: React.SyntheticEvent<HTMLInputElement>) => {
        e.stopPropagation();
        setCursorPosition((e.target as HTMLInputElement).selectionStart);
    }



    return (
        <Box
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}
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
                onClick={() => handleEditMode(index)}>
                
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <div style={{display: 'flex', alignItems:'center'}}>
                    <PopupState variant="popover" popupId="demo-popup-menu">
                        {(popupState) => (
                            <React.Fragment>
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
                                clickable={ScriptState.PresentScriptData.isEditMode[index]}
                                color= {getSpeakerColor(ScriptState.PresentScriptData.scriptData.scripts[index].speaker)}
                                {...(ScriptState.PresentScriptData.isEditMode[index]? bindTrigger(popupState): {})}/>
                                <Menu {...bindMenu(popupState)}>
                                    {[
                                        {key: 'T', value: '상담사'},
                                        {key: 'C', value: CaseInfoState.caseInfo.family_name+CaseInfoState.caseInfo.given_name},
                                    ].map((optionSpeaker) => (
                                        <MenuItem key={optionSpeaker.key} 
                                        onClick={() => {
                                            handleChangeSpeaker(index, optionSpeaker.key);
                                            popupState.close();
                                        }}>
                                            {optionSpeaker.value}
                                        </MenuItem>
                                    ))}
        
                                </Menu>
                            </React.Fragment>
                        )}
                    </PopupState>

                    
                
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimeField 
                            style={{width: '100px', height: '25.35px', padding: '0', margin: '5px'}}
                            format="HH:mm:ss"
                            value={dayjs(`1970-01-01T${ScriptState.PresentScriptData.scriptData.scripts[index].start_time}`)} //dayjs 객체로 바꿔주기 위함
                            size='small'
                            sx={{fontSize: '3px', padding: '0', margin: '0'}}
                            onChange={(value) => {
                                ScriptDispatch({type: 'CHANGE_START_TIME', 
                                                index: index, 
                                                start_time: value? value.format('HH:mm:ss') :"00:00:00"});
                            }}
                            />
                    </LocalizationProvider>
                    
                    <Typography color= 'primary'>  ~  </Typography>
                   
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimeField 
                            style={{width: '100px', height: '25.35px', padding: '0', margin: '5px'}}
                            format="HH:mm:ss"
                            value={dayjs(`1970-01-01T${ScriptState.PresentScriptData.scriptData.scripts[index].end_time}`)} //dayjs 객체로 바꿔주기 위함
                            size='small'
                            sx={{fontSize: '3px', padding: '0', margin: '0'}}
                            onChange={(value) => {
                                ScriptDispatch({type: 'CHANGE_END_TIME', 
                                index: index, 
                                end_time: value? value.format('HH:mm:ss') :"00:00:00"});
                            }
                            }
                            />
                    </LocalizationProvider>

                    

                    </div>
        
                    <div style={{display: 'flex', width: '100%', justifyContent: 'flex-end'}}>
                        <IconButton
                            onClick={(event)=>{
                                event.stopPropagation();
                                handleBlockDeleteClick(index)
                            }}>
                            <DeleteIcon/>
                        </IconButton>
                    </div>
                   
                </div>
                <div  style={{ margin: '10px 0' }}>

                        <InputBase
                            fullWidth
                            multiline
                            placeholder={text?
                                '' : '내용을 입력하세요'
                            }
                            value={text?
                                text : ''
                            }
                            size='small'
                            style={{fontSize: '15px'}}
                            onChange = {(e) => setText(e.target.value)}
                            onBlur = {(e) => ScriptDispatch({type: 'CHANGE_TEXT', index: index, text: text})}
                            onSelect = {handleSelect}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                        />

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

export default EditModeScriptBlock;