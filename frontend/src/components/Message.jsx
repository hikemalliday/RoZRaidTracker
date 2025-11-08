import React, {useEffect, useState} from "react";
import {useMessage} from "../context/MessageContext.jsx";
import {Alert, Snackbar} from "@mui/material";


export function Message({id, message, type, duration}) {
    const {removeMessage} = useMessage();

    useEffect(() => {
        const timer = setTimeout(() => {
            removeMessage(id);
        }, duration);

        return () => clearTimeout(timer);
    }, [id, duration, removeMessage]);

    return (
        <Snackbar open={true} anchorOrigin={{vertical: "bottom", horizontal: "center"}}>
            <Alert severity={type} sx={{width: '100%'}} onClose={() => removeMessage(id)}>{message}</Alert>
        </Snackbar>
    );
}
