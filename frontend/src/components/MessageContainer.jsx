import { Message } from "./Message.jsx";
import { Stack } from "@mui/material";


export function MessageContainer({ messages }) {
    return (
        <Stack
            spacing={1}
            sx={{
                position: 'fixed',
                bottom: 24,
                left: '50%',
                transform: 'translateX(-50%)',
                width: { xs: 'calc(100% - 32px)', sm: 420 },
                zIndex: theme => theme.zIndex.snackbar,
            }}
        >
            {messages.map((message) => {
                return <Message key={message.id} {...message}/>
            })}
        </Stack>
    )
}
