import React from "react";
import axios from "./axios"; //to update

export class BioEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editMode: false,
            buttontext: "Update Bio"
            //if null from query at bio props setState of button :add your bio
        };
    }
    componentDidMount() {
        if (!this.props.bio) {
            this.setState({
                buttontext: "Add your Bio"
            });
        }
    }
    toggleEdit() {
        this.setState({ editMode: !this.state.editMode });
    }
    updateBioPost() {
        axios
            .post("/bio", { bio: this.state.bio })
            .then(() => {
                this.props.updateBio(this.state.bio);
                this.toggleEdit();
            })
            .catch(e => console.log(e));
    }
    handleChangeBio(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    render() {
        if (this.state.editMode) {
            return (
                <div>
                    <textarea
                        onChange={e => this.handleChangeBio(e)}
                        name="bio"
                        defaultValue={this.props.bio}
                    />
                    <button
                        onClick={() => {
                            this.updateBioPost();
                        }}
                    >
                        sumbit
                    </button>
                </div>
            );
        } else {
            if (!this.props.bio) {
                return (
                    <div>
                        <h1> {this.props.bio} </h1>
                        <button onClick={() => this.toggleEdit()}>
                            {this.state.buttontext}
                        </button>
                    </div>
                );
            } else {
                return (
                    <div>
                        <h1> {this.props.bio} </h1>
                        <button onClick={() => this.toggleEdit()}>
                            Edit your profile
                        </button>
                    </div>
                );
            }
        }
    }
}
