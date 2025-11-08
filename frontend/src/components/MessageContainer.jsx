import {Message} from "./Message.jsx";


export function MessageContainer({ messages }) {
    return (
        <div className="message-container">
            {messages.map((message) => {
                return <Message key={message.id} {...message}/>
            })}
        </div>
    )
}
