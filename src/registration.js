import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    submit() {
        console.log(this.state.first);
        axios
            .post("/welcome", {
                first: this.state.first,
                last: this.state.last,
                email: this.state.email,
                password: this.state.password
            })
            .then(({ data }) => {
                if (data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true
                    });
                }
            });
    }
    handleChange(inputElement) {
        this.setState({
            [inputElement.name]: inputElement.value
        });
    }

    render() {
        return (
            <div className="login">
                {this.state.error && (
                    <div className="error">Oops! there was an error </div>
                )}
                <div className="inputs">
                    <input
                        required
                        name="first"
                        placeholder="first name"
                        onChange={e => this.handleChange(e.target)}
                    />
                    <input
                        required
                        name="last"
                        placeholder="last name"
                        onChange={e => this.handleChange(e.target)}
                    />
                    <input
                        required
                        name="email"
                        placeholder="email"
                        onChange={e => this.handleChange(e.target)}
                    />
                    <input
                        required
                        name="password"
                        type="password"
                        placeholder="password"
                        onChange={e => this.handleChange(e.target)}
                    />
                </div>
                <button onClick={() => this.submit()}>Sign Up</button>{" "}
                <Link to="/login">Take me to login</Link>
            </div>
        );
    }
}
