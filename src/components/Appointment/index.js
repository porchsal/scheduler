import "components/Appointment/styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import React from 'react';
import Form from "./Form";
import useVisualMode from "hooks/useVisualMode";
import Status from "./Status";
import Confirm from "./Confirm";

export default function Appointment(props) {
    const EMPTY = "EMPTY";
    const SHOW = "SHOW";
    const CREATE = "CREATE";
    const SAVING = "SAVING";
    const DELETE = "DELETE";
    const CONFIRM = "CONFIRM";

    const { mode, transition, back } = useVisualMode(
        props.interview ? SHOW : EMPTY
      );
    function save(name, interviewer) {
        const interview = {
          student: name,
          interviewer
        };
        transition(SAVING);
        props.bookInterview(props.id, interview).then(
            () => transition(SHOW)
        )
    }

    function deleteAppointment() {
        transition(CONFIRM);
    }
    function confirmDeleteAppointment() {
        transition(DELETE, true);
        props.cancelInterview(props.id).then(() => transition(EMPTY));
    }

    return (
        <article className="appointment">
            <Header time={props.time} />
            {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
            {mode === CREATE && (
                <Form
                    interviewers={props.interviewers}
                    onCancel={() => back()}
                    onSave={save}
                    onDelete={deleteAppointment}
                />
            )}
            {mode === SHOW && (
                <Show
                student={props.interview && props.interview.student}
                interviewer={props.interview && props.interview.interviewer}
                onDelete={deleteAppointment}
                />
            )}
            {mode === SAVING && (
                <Status
                    message={SAVING}
                />
            )}

            {mode === CONFIRM && (
                <Confirm
                    message={CONFIRM}
                    onConfirm={confirmDeleteAppointment}
                    onCancel={() => back()}
                />
            )}
            {mode === DELETE && (
                <Status
                    message={DELETE}
                />
            )}


        </article>
    )
}