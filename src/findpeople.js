import React, { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [results, setResults] = useState([]);

    useEffect(() => {
        // console.log(results);

        axios
            .get("/users.json/" + results)
            .then(({ data }) => {
                setUsers(data);
            })
            .catch(err => console.log("err in find people: ", err));
    }, [results]);

    return (
        <div className="findppl">
            <div className="friends">
                {users.map(user => (
                    <div key={user.id}>
                        <Link to={`/user/${user.id}`}>
                            <h1>
                                {user.first} {user.last}
                            </h1>
                            <img src={user.imgurl || "/assets/default.png"} />
                        </Link>
                    </div>
                ))}
            </div>
            <input
                className="search"
                onChange={e => setResults(e.target.value)}
                placeholder="Find people"
            />
        </div>
    );
}
