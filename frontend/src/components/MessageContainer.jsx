import { Message } from "./Message.jsx";
import { Stack } from "@mui/material";
import { messageContainerStyles } from "../styles.js";


export function MessageContainer({ messages }) {
    return (
        <Stack
            spacing={1}
            sx={messageContainerStyles}
        >
            {messages.map((message) => {
                return <Message key={message.id} {...message}/>
            })}
        </Stack>
    )
}
