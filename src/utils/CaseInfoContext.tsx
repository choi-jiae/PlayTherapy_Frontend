import React from 'react';

interface CaseData {
    id: number;
    given_name: string;
    family_name: string;
    description: {age: number, gender: string}
    user_id: number;
    session_count: number;
    start_date: string;
    updated_date: string;
    case_state_id: number;
  }

type CaseInfoState = {
  caseInfo: CaseData;
}

type CaseInfoAction = 
  | { type: 'GET_CASE_INFO', caseInfo: CaseData }
  | { type: 'UPDATE_CASE_INFO', caseInfo: CaseData };

interface CaseInfoContextType {
  CaseInfoState: CaseInfoState;
  CaseInfoDispatch: React.Dispatch<CaseInfoAction>;
}

interface CaseInfoProviderProps {
  children: React.ReactNode;
}

export const CaseInfoContext = React.createContext<CaseInfoContextType | undefined >(undefined);

const caseInfoReducer = (state: CaseInfoState, action: CaseInfoAction): CaseInfoState => {
  switch(action.type) {
    case 'GET_CASE_INFO':
      return { caseInfo: action.caseInfo };
    case 'UPDATE_CASE_INFO':
      return { caseInfo: action.caseInfo };
    default:
      return state;
  }
};

export const CaseInfoProvider: React.FC<CaseInfoProviderProps> = ({ children }) => {

  const initialCaseInfoState: CaseInfoState = {
  caseInfo: {
    id: 0,
    given_name: '',
    family_name: '',
    description: {
      age: 0,
      gender: ''
    },
    user_id: 0,
    session_count: 0,
    start_date: '',
    updated_date: '',
    case_state_id: 0
  }
  };

  const [ CaseInfoState, CaseInfoDispatch ] = React.useReducer(caseInfoReducer, initialCaseInfoState);



  return (
    <CaseInfoContext.Provider value={{ CaseInfoState, CaseInfoDispatch}}>
      {children}
    </CaseInfoContext.Provider>
  );
};

export const useCaseInfo = (): CaseInfoContextType => {
  const context = React.useContext(CaseInfoContext);
  if (!context) {
    throw new Error('useCaseInfo must be used within a CaseInfoProvider');
  }
  return context;
}