import axios from "./axios";

export async function receiveFriendsWannabes() {
    const { data } = await axios.get("/relationships");
    return {
        type: "FRIENDS_WANNABES",
        users: data
    };
}
export async function acceptFriend(id) {
    await axios.post("/friendsstatus/" + id);
    return {
        type: "ACCEPT_FRIENDS",
        accepted: true,
        id
    };
}

export async function deleteFriend(id) {
    await axios.post("/friendsstatus/" + id);
    return {
        type: "DELETE_FRIENDS",
        id
    };
}

export async function chatMessage(msg) {
    return {
        type: "ADD_MESSAGE",
        message: msg
    };
}

export async function chatMessages(msgs) {
    return {
        type: "GET_MESSAGES",
        chatMessages: msgs
    };
}
