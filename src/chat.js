import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";

export function Chat() {
    const chatMessages = useSelector(state => state && state.chatMessages);
    console.log("chatMessages", chatMessages);
    const elemRef = useRef();

    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    });
    const keyCheck = e => {
        if (e.key === "Enter") {
            socket.emit("myMsg", e.target.value);
            e.target.value = "";
        }
    };

    return (
        <div className="background">
            <div className="chat">
                <div className="container" ref={elemRef}>
                    {chatMessages &&
                        chatMessages.map(el => (
                            <div key={el.chats_id}>
                                <div className="nameimg">
                                    <h3>
                                        {el.first} {el.last}
                                    </h3>
                                    <img className="chatpic" src={el.imgurl} />
                                </div>
                                <p>{el.msg}</p>
                            </div>
                        ))}
                </div>
                <textarea
                    placeholder="Press enter to send a msg"
                    onKeyUp={keyCheck}
                ></textarea>
            </div>
        </div>
    );
}
