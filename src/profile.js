import React from "react";
import { ProfilePic } from "./profilepic";
import { BioEdit } from "./bioedit";

export default function Profile(props) {
    return (
        <div className="profile">
            <h1> Welcome {props.first} </h1>
            <ProfilePic
                first={props.first}
                last={props.last}
                imgUrl={props.imgUrl}
                picclass={props.picclass}
                toggle={props.toggle}

                //add dynamic className
            />
            <BioEdit bio={props.bio} updateBio={props.updateBio} />
        </div>
    );
}
