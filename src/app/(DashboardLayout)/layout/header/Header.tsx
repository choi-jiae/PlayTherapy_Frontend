import React from 'react';
import { Box, AppBar, Toolbar, styled, Stack, IconButton, Badge, Button } from '@mui/material';
import PropTypes from 'prop-types';
import InfoIcon from '@mui/icons-material/Info';
// components
import Profile from './Profile';
import { IconBellRinging, IconMenu } from '@tabler/icons-react';
import ServiceInfo from '../../components/info/ServiceInfo';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';


interface ItemType {
  toggleMobileSidebar:  (event: React.MouseEvent<HTMLElement>) => void;
}

const Header = ({toggleMobileSidebar}: ItemType) => {


  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    background: theme.palette.background.paper,
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    [theme.breakpoints.up('lg')]: {
      minHeight: '70px',
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    color: theme.palette.text.secondary,
  }));

  const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: 'rgba(255, 255, 255, 1)',
      color: 'rgba(0, 0, 0, 1)',
      boxShadow: theme.shadows[1],
      fontSize: 11,
      borderRadius: '8px'
    },
  }));

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={toggleMobileSidebar}
          sx={{
            display: {
              lg: "none",
              xs: "inline",
            },
          }}
        >
          <IconMenu width="20" height="20" />
        </IconButton>
        <Box flexGrow={1} />
        <Profile />
        <LightTooltip 
          title= {
          <div style={{ margin: '10px'}}>
            <ServiceInfo />
          </div>
          }
          placement="left"
        >
          <InfoIcon 
            color="inherit"
          />
        </LightTooltip>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
