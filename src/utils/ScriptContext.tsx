import React, { useReducer, useContext, createContext } from 'react';

interface ScriptData {
    scripts: Array<{ 
        start_time: string, 
        end_time: string, 
        speaker: string, 
        text: string }>
}

const StackLength = 20;

type ScriptState = {
    UndoStack: Array<{ 
        scriptData: ScriptData,
        isEditMode: boolean[]}>,
    
    PresentScriptData: {
        scriptData: ScriptData,
        isEditMode: boolean[]},
    
    RedoStack: Array<{
        scriptData: ScriptData,
        isEditMode: boolean[]}>,
    
    isEdited: boolean,
    undoClicked: boolean
};

type ScriptAction =
    | { type: 'ADD_UPPER_BLOCK', index: number }
    | { type: 'ADD_LOWER_BLOCK', index: number }
    | { type: 'DIVIDE_SPEAKER', index: number, cursorPosition: number }
    | { type: 'EDIT_MODE', index: number }
    | { type: 'DELETE_CLICK', index: number }
    | { type: 'CHANGE_SPEAKER', index: number, speaker: string }
    | { type: 'CHANGE_TEXT', index: number, text: string }
    | { type: 'CHANGE_START_TIME', index: number, start_time: string }
    | { type: 'CHANGE_END_TIME', index: number, end_time: string }
    | { type: 'GET_SCRIPT', scriptData: ScriptData}
    | { type: 'SAVE_SCRIPT' }
    | { type: 'UNDO' }
    | { type: 'REDO' };

interface ScriptContextType {
    ScriptState: ScriptState;
    ScriptDispatch: React.Dispatch<ScriptAction>;
}

interface ScriptProviderProps {
    children: React.ReactNode;
}

const ScriptContext = React.createContext<ScriptContextType | undefined>(undefined);
    
const scriptReducer = (state: ScriptState, action: ScriptAction): ScriptState => {
    switch(action.type) {
        case 'ADD_UPPER_BLOCK':
            {   
                let newUndoStack = [...state.UndoStack, JSON.parse(JSON.stringify(state.PresentScriptData))];
                if(newUndoStack.length > StackLength) {
                    newUndoStack.shift();
                }

                console.log(newUndoStack);
                
                const newScriptData = {...state.PresentScriptData.scriptData};
                const presentScriptData = state.PresentScriptData.scriptData;
                const start_time = action.index == 0 ? '00:00:00' : presentScriptData.scripts[action.index-1].end_time;
                const end_time = presentScriptData.scripts[action.index].start_time;
                const speaker = (presentScriptData.scripts[action.index].speaker == 'T') ? 'C' : 'T';
                newScriptData.scripts.splice(action.index, 0, {
                  start_time: start_time,
                  end_time: end_time,
                  speaker: speaker,
                  text: ''
                });
          
                const newIsEditMode = [...state.PresentScriptData.isEditMode];
                newIsEditMode.splice(action.index, 0, true);

          
                return {
                    UndoStack: newUndoStack,
                    PresentScriptData: {scriptData: newScriptData, isEditMode: newIsEditMode},
                    RedoStack: [...state.RedoStack],
                    isEdited: true,
                    undoClicked: false
                };
              }

        case 'ADD_LOWER_BLOCK':
            {
                let newUndoStack = [...state.UndoStack, JSON.parse(JSON.stringify(state.PresentScriptData))];
                if(newUndoStack.length > StackLength) {
                    newUndoStack.shift();
                }
                console.log(newUndoStack);
                const newScriptData = {...state.PresentScriptData.scriptData};
                const presentScriptData = state.PresentScriptData.scriptData;
                const start_time = presentScriptData.scripts[action.index].end_time;
                const end_time = action.index == presentScriptData.scripts.length-1 ? presentScriptData.scripts[action.index].end_time : presentScriptData.scripts[action.index+1].start_time;
                const speaker = (presentScriptData.scripts[action.index].speaker == 'T') ? 'C' : 'T';
                newScriptData.scripts.splice(action.index+1, 0, {
                  start_time: start_time,
                  end_time: end_time,
                  speaker: speaker,
                  text: ''
                });
          
                const newIsEditMode = [...state.PresentScriptData.isEditMode];
                newIsEditMode.splice(action.index+1, 0, true);
          
                return { 
                    UndoStack: newUndoStack,
                    PresentScriptData: {scriptData: newScriptData, isEditMode: newIsEditMode},
                    RedoStack: [...state.RedoStack],
                    isEdited: true,
                    undoClicked: false
                 };
              }

        case 'DIVIDE_SPEAKER':
            {
                let newUndoStack = [...state.UndoStack, JSON.parse(JSON.stringify(state.PresentScriptData))];
                if(newUndoStack.length > StackLength) {
                    newUndoStack.shift();
                }
                
                const newScriptData = {...state.PresentScriptData.scriptData};
                const presentScriptData = state.PresentScriptData.scriptData;
                const start_time = presentScriptData.scripts[action.index].end_time;
                const end_time = action.index == presentScriptData.scripts.length-1 ? presentScriptData.scripts[action.index].end_time : presentScriptData.scripts[action.index+1].start_time;
                const speaker = (presentScriptData.scripts[action.index].speaker == 'T') ? 'C' : 'T';
                const text = presentScriptData.scripts[action.index].text.substring(action.cursorPosition).trim();
                
                newScriptData.scripts[action.index].text = presentScriptData.scripts[action.index].text.substring(0, action.cursorPosition).trim();
                newScriptData.scripts.splice(action.index+1, 0, {
                  start_time: start_time,
                  end_time: end_time,
                  speaker: speaker,
                  text: text
                });
          
                const newIsEditMode = [...state.PresentScriptData.isEditMode];
                newIsEditMode.splice(action.index+1, 0, false);
          
                return { 
                    UndoStack: newUndoStack,
                    PresentScriptData: {scriptData: newScriptData, isEditMode: newIsEditMode},
                    RedoStack: [...state.RedoStack],
                    isEdited: true,
                    undoClicked: false
                 };
            }

        case 'EDIT_MODE':
            {
                const newScriptData = {...state.PresentScriptData.scriptData};
                const newIsEditMode = [...state.PresentScriptData.isEditMode];
                newIsEditMode[action.index] = true;
                return { 
                    UndoStack: [...state.UndoStack],
                    PresentScriptData: {scriptData: newScriptData, isEditMode: newIsEditMode},
                    RedoStack: [...state.RedoStack],
                    isEdited: true,
                    undoClicked: state.undoClicked
                 };
            }

        case 'DELETE_CLICK':
            {
                let newUndoStack = [...state.UndoStack, JSON.parse(JSON.stringify(state.PresentScriptData))];
                if(newUndoStack.length > StackLength) {
                    newUndoStack.shift();
                }
                console.log(newUndoStack);
                const newScriptData = {...state.PresentScriptData.scriptData};
                newScriptData.scripts.splice(action.index, 1);

                const newIsEditMode = [...state.PresentScriptData.isEditMode];
                newIsEditMode.splice(action.index, 1);

                return { 
                    UndoStack: newUndoStack,
                    PresentScriptData: {scriptData: newScriptData, isEditMode: newIsEditMode},
                    RedoStack: [...state.RedoStack],
                    isEdited: true,
                    undoClicked: false
                };
            
            }
        case 'CHANGE_SPEAKER':
            {
                let newUndoStack = [...state.UndoStack, JSON.parse(JSON.stringify(state.PresentScriptData))];
                if(newUndoStack.length > StackLength) {
                    newUndoStack.shift();
                }

                const newScriptData = {...state.PresentScriptData.scriptData};
                newScriptData.scripts[action.index].speaker = action.speaker;
                return { 
                    UndoStack: newUndoStack,
                    PresentScriptData: {scriptData: newScriptData, isEditMode: [...state.PresentScriptData.isEditMode]},
                    RedoStack: [...state.RedoStack],
                    isEdited: true,
                    undoClicked: false
                 };
            }

        case 'CHANGE_TEXT':
            {
                let newUndoStack = [...state.UndoStack, JSON.parse(JSON.stringify(state.PresentScriptData))];
                if(newUndoStack.length > StackLength) {
                    newUndoStack.shift();
                }

                const newScriptData = {...state.PresentScriptData.scriptData};
                newScriptData.scripts[action.index].text = action.text;
                return { 
                    UndoStack: newUndoStack,
                    PresentScriptData: {scriptData: newScriptData, isEditMode: [...state.PresentScriptData.isEditMode]},
                    RedoStack: [...state.RedoStack],
                    isEdited: true,
                    undoClicked: false
                 };
            }
        
        case 'CHANGE_START_TIME':
            {
                let newUndoStack = [...state.UndoStack, JSON.parse(JSON.stringify(state.PresentScriptData))];
                if(newUndoStack.length > StackLength) {
                    newUndoStack.shift();
                }

                const newScriptData = {...state.PresentScriptData.scriptData};
                newScriptData.scripts[action.index].start_time = action.start_time;
                return { 
                    UndoStack: newUndoStack,
                    PresentScriptData: {scriptData: newScriptData, isEditMode: [...state.PresentScriptData.isEditMode]},
                    RedoStack: [...state.RedoStack],
                    isEdited: true,
                    undoClicked: false
                 };
            }
        case 'CHANGE_END_TIME':
            {
                let newUndoStack = [...state.UndoStack, JSON.parse(JSON.stringify(state.PresentScriptData))];
                if(newUndoStack.length > StackLength) {
                    newUndoStack.shift();
                }

                const newScriptData = {...state.PresentScriptData.scriptData};
                newScriptData.scripts[action.index].end_time = action.end_time;
                return { 
                    UndoStack: newUndoStack,
                    PresentScriptData: {scriptData: newScriptData, isEditMode: [...state.PresentScriptData.isEditMode]},
                    RedoStack: [...state.RedoStack],
                    isEdited: true,
                    undoClicked: false
                 };
            }
        case 'GET_SCRIPT':
            {
                console.log(action.scriptData);
                return { 
                    UndoStack: [...state.UndoStack],
                    PresentScriptData: {scriptData: action.scriptData, isEditMode: new Array(action.scriptData.scripts.length).fill(false)},
                    RedoStack: [...state.RedoStack],
                    isEdited: false,
                    undoClicked: state.undoClicked
                 };
            }
        
        case'SAVE_SCRIPT':
            {
                let newUndoStack = [...state.UndoStack, JSON.parse(JSON.stringify(state.PresentScriptData))];
                if(newUndoStack.length > StackLength) {
                    newUndoStack.shift();
                }
                console.log(newUndoStack);
                return {
                    UndoStack: newUndoStack,
                    PresentScriptData: {scriptData: state.PresentScriptData.scriptData, isEditMode: new Array(state.PresentScriptData.scriptData.scripts.length).fill(false)},
                    RedoStack: [],
                    isEdited: false,
                    undoClicked: state.undoClicked
                
                };
            }
        
        case 'UNDO':
            {
                let newRedoStack = [...state.RedoStack, JSON.parse(JSON.stringify(state.PresentScriptData))];
                if(newRedoStack.length > StackLength) {
                    newRedoStack.shift();
                }
                console.log('undo', state.UndoStack);
                return {
                    UndoStack: state.UndoStack.slice(0, state.UndoStack.length-1),
                    PresentScriptData: state.UndoStack[state.UndoStack.length-1],
                    RedoStack: newRedoStack,
                    isEdited: true,
                    undoClicked: true
                };
            }
        
        case 'REDO':
            {
                let newUndoStack = [...state.UndoStack, JSON.parse(JSON.stringify(state.PresentScriptData))];
                if(newUndoStack.length > StackLength) {
                    newUndoStack.shift();
                }
                console.log('redo', state.RedoStack);
                return {
                    UndoStack: newUndoStack,
                    PresentScriptData: state.RedoStack[state.RedoStack.length-1],
                    RedoStack: state.RedoStack.slice(0, state.RedoStack.length-1),
                    isEdited: true,
                    undoClicked: state.undoClicked
                };
            }

        default:
            return state;
    }
}


export const ScriptProvider: React.FC<ScriptProviderProps> = ({ children }) => {
    const initialScriptState: ScriptState = {
        UndoStack: [],
        PresentScriptData: { 
            scriptData: { scripts: [
                { start_time: '00:00:00', end_time: '00:00:00', speaker: 'T', text: ''},
            ]}, 
            isEditMode: new Array(1).fill(false) 
        },
        RedoStack: [],
        isEdited: false,
        undoClicked: false
    };

    const [ScriptState, ScriptDispatch] = useReducer(scriptReducer, initialScriptState);

    return (
        <ScriptContext.Provider value={{ ScriptState, ScriptDispatch }}>
            {children}
        </ScriptContext.Provider>
    );
}

export const useScript = (): ScriptContextType => {
    const context = useContext(ScriptContext);
    if (context === undefined) {
        throw new Error("useScript must be used within a ScriptProvider");
    }
    return context;
};