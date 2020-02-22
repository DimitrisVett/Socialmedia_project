import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        console.log("event in handleChange", e);
        this.file = e.target.files[0];
        let fd = new FormData();
        fd.append("file", this.file);

        axios
            .post("/upload", fd)
            .then(res => {
                console.log("res from POST /upload IN THEN :", res.data);

                this.props.updateImg(res.data.imgUrl);
            })
            .catch(function(err) {
                console.log("error in POST /upload", err);
            });
    }
    render() {
        return (
            <div onClick={this.props.toggle} className="uploader">
                <div className="outer">
                    <div className="inner">
                        <label>Back</label>
                    </div>
                </div>
                <h1> Upload your profile picture </h1>
                <input
                    onChange={e => this.handleChange(e)}
                    type="file"
                    name="file"
                    accept="image/*"
                />
            </div>
        );
    }
}
// <h2 onClick={this.props.toggle}>X</h2>
