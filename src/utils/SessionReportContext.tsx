import React from 'react';

interface SessionReportData {
   reports: Object;
}

type SessionReportState = {
    sessionReport: SessionReportData;
}

type SessionReportAction =
    | { type: 'GET_SESSION_REPORT', sessionReport: SessionReportData };

interface SessionReportContextType {
    SessionReportState: SessionReportState;
    SessionReportDispatch: React.Dispatch<SessionReportAction>;
}

interface SessionReportProviderProps {
    children: React.ReactNode;
}

export const SessionReportContext = React.createContext<SessionReportContextType | undefined >(undefined);

const sessionReportReducer = (state: SessionReportState, action: SessionReportAction): SessionReportState => {
    switch(action.type) {
        case 'GET_SESSION_REPORT':
            return { sessionReport: action.sessionReport };
        default:
            return state;
    }
};

export const SessionReportProvider: React.FC<SessionReportProviderProps> = ({ children }) => {
    const initialSessionReportState: SessionReportState = {
        sessionReport: {
            reports: []
        }
    };

    const [state, dispatch] = React.useReducer(sessionReportReducer, initialSessionReportState);

    return (
        <SessionReportContext.Provider value={{ SessionReportState: state, SessionReportDispatch: dispatch }}>
            {children}
        </SessionReportContext.Provider>
    );
};

export const useSessionReport = () => {
    const context = React.useContext(SessionReportContext);
    if (context === undefined) {
        throw new Error('useSessionReport must be used within a SessionReportProvider');
    }
    return context;
};