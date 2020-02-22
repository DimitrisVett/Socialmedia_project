import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { receiveFriendsWannabes, acceptFriend, deleteFriend } from "./actions";
import React, { useEffect } from "react";

export default function Friend() {
    const dispatch = useDispatch();
    const users = useSelector(state => {
        return state.users && state.users.filter(user => user.accepted == true);
    });
    const friendRequests = useSelector(state => {
        return (
            state.users && state.users.filter(user => user.accepted == false)
        );
    });
    useEffect(() => {
        dispatch(receiveFriendsWannabes());
    }, []);
    return (
        <div>
            <div className="friends">
                <h1>Your Friends</h1>
                {users && users.length == 0 && (
                    <div className="user"> You have no friends </div>
                )}
                <div className="users">
                    {users &&
                        users.map(user => (
                            <div className="user" key={user.id}>
                                <Link to={`/user/${user.id}`}>
                                    <h3>
                                        {user.first} {user.last}
                                    </h3>
                                    <img src={user.imgurl} />
                                </Link>
                                <button
                                    onClick={() =>
                                        dispatch(deleteFriend(user.id))
                                    }
                                >
                                    Unfriend
                                </button>
                            </div>
                        ))}
                </div>
            </div>
            <div className="friends">
                <h1>Pending friend requests</h1>
                {friendRequests &&
                    friendRequests.map(user => (
                        <div className="user" key={user.id}>
                            <Link to={`/user/${user.id}`}>
                                <h3>
                                    {user.first} {user.last}
                                </h3>
                                <img src={user.imgurl} />
                            </Link>
                            <button
                                onClick={() => dispatch(acceptFriend(user.id))}
                            >
                                Accept Request
                            </button>
                        </div>
                    ))}
            </div>
        </div>
    );
}
