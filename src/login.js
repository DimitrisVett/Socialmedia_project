import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    submit() {
        axios
            .post("/login", {
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
                <div className="inputs">
                    <input
                        name="email"
                        placeholder="email"
                        onChange={e => this.handleChange(e.target)}
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="password"
                        onChange={e => this.handleChange(e.target)}
                    />
                </div>
                <button onClick={() => this.submit()}>Sign Up</button>
                <Link to="/">Take me to register</Link>
            </div>
        );
    }
}
