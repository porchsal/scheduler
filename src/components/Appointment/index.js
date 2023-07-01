import "components/Appointment/styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import React from 'react';

export default function Appointment(props) {
    return (
        <Header time={props.time} />
        //<article className="appointment"></article>
    )
}