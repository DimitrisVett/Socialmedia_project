import React from "react";
import axios from "./axios";
import FriendButton from "./friendbutton";
import { Link } from "react-router-dom";

export class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        axios
            .get(`/friendsstatus/${this.props.match.params.id}`)
            .then(({ data }) => {
                console.log("data in friend status", data);
                this.setState({ accepted: data.accepted });
            });

        axios
            .post(`/relationships/${this.props.match.params.id}`)
            .then(({ data }) => {
                console.log(data);
                this.setState({ friendsOfOther: data });
            });

        axios
            .get(`/user.json/${this.props.match.params.id}`)
            .then(({ data }) => {
                this.setState(
                    {
                        first: data.first,
                        last: data.last,
                        imgUrl: data.imgurl,
                        bio: data.bio,
                        userId: data.meId
                    },
                    () => console.log("OtherProfile")
                );
                if (this.props.match.params.id == this.state.userId) {
                    this.props.history.push("/");
                }
            });
    }
    render() {
        if (!this.state.first) {
            return <h1>The user does not exist get over it </h1>;
        }
        return (
            <div>
                <div className="otherprofile">
                    <h1>
                        {this.state.first} {this.state.last}
                    </h1>
                    <img
                        className={this.state.picclass}
                        src={this.state.imgUrl}
                    />
                    <p> {this.state.bio}</p>
                    <FriendButton otherId={this.props.match.params.id} />
                </div>
                {this.state.accepted && (
                    <div className="friends">
                        <h2> Friends of {this.state.first} </h2>
                        <div className="users">
                            {this.state.friendsOfOther &&
                                this.state.friendsOfOther.map(friend => (
                                    <div className="user" key={friend.id}>
                                        <Link to={`/user/${friend.id}`}>
                                            <h3>
                                                {friend.first} {friend.last}
                                            </h3>
                                            <img src={friend.imgurl} />
                                        </Link>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
