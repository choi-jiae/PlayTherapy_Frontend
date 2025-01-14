import React from 'react';

interface SessionData {
    id: number;
    name: string;
    session_state_id: number;
    case_id: number;
    source_video_url: string;
    source_script_url: string;
    script_state_id: number;
    analyze_state_id: number;
    created_date: string;
    video_length: string;
    origin_video_url: string;
    encoding_video_url: string;
}

type SessionInfoState = {
    sessionInfo?: SessionData;
    sessionList?: Array<SessionData>;
}

type SessionInfoAction =
    | { type: 'GET_SESSION_INFO', sessionInfo: SessionData }
    | { type: 'GET_SESSION_LIST', sessionList: Array<SessionData> };


interface SessionInfoContextType {
    SessionInfoState: SessionInfoState;
    SessionInfoDispatch: React.Dispatch<SessionInfoAction>;
}

interface SessionInfoProviderProps {
    children: React.ReactNode;
}

export const SessionInfoContext = React.createContext<SessionInfoContextType | undefined >(undefined);

const sessionInfoReducer = (state: SessionInfoState, action: SessionInfoAction): SessionInfoState => {
    switch(action.type) {
        case 'GET_SESSION_INFO':
            return { sessionInfo: action.sessionInfo };
        case 'GET_SESSION_LIST':
            return { sessionList: action.sessionList };
        default:
            return state;
    }
};

export const SessionInfoProvider: React.FC<SessionInfoProviderProps> = ({ children }) => {
    
        const initialSessionInfoState: SessionInfoState = {
            sessionInfo: {
                id: 0,
                name: '',
                session_state_id: 0,
                case_id: 0,
                source_video_url: '',
                source_script_url: '',
                script_state_id: 0,
                analyze_state_id: 0,
                created_date: '',
                video_length: '',
                origin_video_url: '',
                encoding_video_url: ''
            },
            sessionList: []
        };
    
        const [SessionInfoState, SessionInfoDispatch] = React.useReducer(sessionInfoReducer, initialSessionInfoState);
    
        return (
            <SessionInfoContext.Provider value={{ SessionInfoState, SessionInfoDispatch }}>
                {children}
            </SessionInfoContext.Provider>
        );
};

export const useSessionInfo = (): SessionInfoContextType => {
    const context = React.useContext(SessionInfoContext);
    if (!context){
        throw new Error('useSessionInfo must be used within a SessionInfoProvider');
    }
    return context;
}
