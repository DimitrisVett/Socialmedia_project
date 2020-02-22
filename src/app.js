import React from "react";
import axios from "./axios";
import { ProfilePic } from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";
import { OtherProfile } from "./otherprofile";
import FindPeople from "./findpeople";
import { BrowserRouter, Route } from "react-router-DOM";
import Friends from "./friends";
import { Chat } from "./chat";
import { Link } from "react-router-dom";

export class App extends React.Component {
    constructor() {
        super();
        this.state = {
            first: "dynamic",
            last: "dynamic",
            uploaderVisible: false
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.updateImg = this.updateImg.bind(this);
        this.updateBio = this.updateBio.bind(this);
    }

    componentDidMount() {
        console.log("mounted *snap*");
        axios.get("/infos").then(({ data }) => {
            // console.log("data", data);
            this.setState({
                first: data.first,
                last: data.last,
                imgUrl: data.imgurl,
                bio: data.bio
            });
        });
    }

    toggleModal() {
        this.setState({ uploaderVisible: !this.state.uploaderVisible });
    }
    updateImg(imgUrl) {
        this.setState({
            imgUrl: imgUrl
        });
    }
    updateBio(bio) {
        this.setState({
            bio: bio
        });
    }

    render() {
        // if (!this.state.firstName) {
        //     //could add loading Component to display till app gets rendered fully
        //     return null;
        // }
        return (
            <div>
                <BrowserRouter>
                    <div className="header">
                        <Link to="/">
                            <div className="logo">
                                <img src="/logo.png" />
                            </div>
                        </Link>
                        <div className="menu">
                            <Link to="/">
                                <h2>My profile </h2>
                            </Link>
                            <Link to="/friends">
                                <h2>Friends </h2>
                            </Link>
                            <Link to="/users">
                                <h2>Find People </h2>
                            </Link>
                            <Link to="/chat">
                                <h2>Chat</h2>
                            </Link>
                            <a href="/logout">
                                <h2>Log Out</h2>
                            </a>
                        </div>
                        <ProfilePic
                            firstName={this.state.first}
                            imgUrl={this.state.imgUrl}
                            toggle={this.toggleModal}
                            picclass="smallpic"
                        />
                    </div>
                    <Route
                        exact
                        path="/"
                        render={() => (
                            <Profile
                                first={this.state.first}
                                last={this.state.last}
                                bio={this.state.bio}
                                imgUrl={this.state.imgUrl}
                                picclass="midpic"
                                toggle={this.toggleModal}
                                updateBio={this.updateBio}
                            />
                        )}
                    />
                    <Route path="/user/:id" component={OtherProfile} />
                    <Route path="/users" component={FindPeople} />
                    <Route path="/friends" component={Friends} />
                    <Route path="/chat" component={Chat} />
                    {this.state.uploaderVisible && (
                        <Uploader
                            updateImg={this.updateImg}
                            toggle={this.toggleModal}
                        />
                    )}
                </BrowserRouter>
            </div>
        );
    }
}
// render={props => (
//     <OtherProfile
//         key={props.match.url}
//         match={props.match}
//         history={props.history}
//     />
// )}
