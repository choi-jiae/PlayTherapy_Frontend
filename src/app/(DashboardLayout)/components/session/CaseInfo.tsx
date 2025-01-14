import React from 'react';
import {
    Button,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

interface CaseData {
    id: number;
    name: string;
    description: {age: number| null, gender: string}
    user_id: number;
    session_count: number;
    start_date: string;
    updated_date: string;
    case_state_id: number;
  }

interface CaseInfoProps {
    caseInfo: CaseData;
    editMode: boolean;
    handleEditClick: () => void;
    handleSaveClick: () => void;
    handleCaseState: (event: React.MouseEvent<HTMLElement>, newCaseState: number | null) => void;
}

const CaseInfoComponent:React.FC<CaseInfoProps> = ({
    caseInfo,
    editMode,
    handleEditClick,
    handleSaveClick,
    handleCaseState,
}) => {

    return (
        <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px'}}>
        <ToggleButtonGroup
          value={caseInfo?.case_state_id}
          exclusive
          onChange={handleCaseState}
          aria-label="Case State"
          sx={{ borderRadius: '20px'}}
          disabled={!editMode}
        >
          <ToggleButton 
            value= {1}
            sx={{ 
              borderRadius: '20px',
              '&.Mui-selected': { backgroundColor: 'rgba(73, 190, 255, 1)' },
              '&.Mui-selected:hover': { backgroundColor: 'rgba(73, 190, 255, 1)' },
            }}>
            <Typography variant="h6" fontWeight={600}>
              진행 전
            </Typography>
          </ToggleButton>
          <ToggleButton 
            value={2} 
            sx={{ borderRadius: '20px',
            '&.Mui-selected': { backgroundColor: 'rgba(93, 135, 255, 1)' },
            '&.Mui-selected:hover': { backgroundColor: 'rgba(93, 135, 255, 1)' }
            }}>
              <Typography variant="h6" fontWeight={600}>
                진행 중
              </Typography>
            </ToggleButton>
          <ToggleButton 
            value={3}
            sx={{ borderRadius: '20px',
            '&.Mui-selected': { backgroundColor: 'rgba(0, 86, 197, 1' },
            '&.Mui-selected:hover': { backgroundColor: 'rgba(0, 86, 197, 1' }
            }}>
              <Typography variant="h6" fontWeight={600}>
              완료
              </Typography>
            </ToggleButton>
        </ToggleButtonGroup>
          <div>
            <Button
              startIcon={editMode? <SaveIcon/>: <EditIcon/>}
              variant="contained"
              color= 'info'
              onClick={editMode? handleSaveClick :handleEditClick}
            >
              {editMode ? 'Save' : 'Edit'}
            </Button>
          </div>
        </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '2px solid #E2E2E2'}}>
            <div style={{display: 'flex', justifyContent: 'space-betwwen', gap: '10px', marginTop: '5px' ,marginRight: '20px'}}>
                <Typography variant="h2" fontWeight={600}>
                    {caseInfo?.name}
                </Typography>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: '14px'}}>
                <Typography variant="h5" fontWeight={600}>
                    {caseInfo?.description.age}세
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                    {caseInfo?.description.gender}
                </Typography>
                </div>
              </div>
            <DashboardCard style={{ flex: 2, margin: '5px', height: '200px'}}>
              <Typography variant="h4">
                내담 경위 및 주호소 문제
              </Typography>
            </DashboardCard>
            <DashboardCard style={{ flex: 2, margin: '5px', height: '200px'}}>
              <Typography variant="h4">
                가족력
              </Typography>
            </DashboardCard>
            <DashboardCard style={{ flex: 2, margin: '5px', height: '200px'}}>
              <Typography variant="h4">
                발달
              </Typography>
            </DashboardCard>
          </div>
          </div>
    )
}

export default CaseInfoComponent;