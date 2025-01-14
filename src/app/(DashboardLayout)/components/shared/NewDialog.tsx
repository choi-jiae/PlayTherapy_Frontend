import React, { useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import DialogTitle from '@mui/material/DialogTitle';

interface NewDialogProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    children: {
        title: string;
        content: React.ReactNode;
        actions: React.ReactNode;
    }
}

const NewDialog: React.FC<NewDialogProps> = ({open, setOpen, children, }) => {

    const handleClose = () => {
        setOpen(false);
    };


    return (
        <Dialog 
            open={open}
            onClose={handleClose}
            aria-labelledby='form-dialog-title'>
                <DialogTitle id="form-dialog-title">{children.title}</DialogTitle>
                <DialogContent>
                    {children.content}

                </DialogContent>
                <DialogActions>
                    {children.actions}

                </DialogActions>
            </Dialog>
    );
};

export default NewDialog;
