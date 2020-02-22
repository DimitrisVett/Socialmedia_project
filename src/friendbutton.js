import React, { useEffect, useState } from "react";
import axios from "./axios";

export default function FriendButton({ otherId }) {
    console.log("otherId in FriendButton", otherId);
    const [buttonText, setButtonText] = useState("defualt button text");

    useEffect(() => {
        console.log("button mounted", otherId);
        axios
            .get(`/friendsstatus/${otherId}`)
            .then(({ data }) => {
                //destracture data
                setButtonText(data.buttonText);
            })
            .catch();
    }, []);

    function submit() {
        console.log("clicked", buttonText);
        axios
            .post(`/friendsstatus/${otherId}`)
            .then(({ data }) => {
                setButtonText(data.buttonText);
            })
            .catch();
    }

    return (
        <div>
            <button onClick={submit}> {buttonText} </button>
        </div>
    );
}
