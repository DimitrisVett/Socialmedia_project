export default function reducer(state = {}, action) {
    if (action.type == "FRIENDS_WANNABES") {
        state = {
            ...state,
            users: action.users
        };
    }

    if (action.type == "ACCEPT_FRIENDS") {
        const users = [
            ...state.users.map(user => {
                if (action.id == user.id) {
                    user.accepted = action.accepted;
                    return user;
                } else return user;
            })
        ];

        state = {
            ...state,
            users
        };
    }

    if (action.type == "DELETE_FRIENDS") {
        const users = [...state.users.filter(user => action.id != user.id)];

        state = {
            ...state,
            users
        };
    }

    if (action.type == "ADD_MESSAGE") {
        console.log("ADD MESSAGE");
        state = {
            ...state,
            chatMessages: [...state.chatMessages, action.message]
        };
    }

    if (action.type == "GET_MESSAGES") {
        state = {
            ...state,
            chatMessages: action.chatMessages
        };
    }

    return state;
}
