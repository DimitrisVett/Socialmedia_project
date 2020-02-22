import React from "react";

export function ProfilePic(props) {
    let imgUrl = props.imgUrl;
    imgUrl = imgUrl || "/logo.png";
    return (
        <div>
            <img
                className={props.picclass}
                onClick={props.toggle}
                src={imgUrl}
            />
        </div>
    );
    //img src url prop
}
