import "components/Appointment/styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import React from 'react';
import Form from "./Form";
import useVisualMode from "hooks/useVisualMode";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

export default function Appointment(props) {
    const EMPTY = "EMPTY";
    const SHOW = "SHOW";
    const CREATE = "CREATE";
    const SAVING = "SAVING";
    const DELETE = "DELETE";
    const CONFIRM = "CONFIRM";
    const EDIT = "EDIT";
    const ERROR_SAVE = "ERROR_SAVE";
    const ERROR_DELETE = "ERROR_DELETE";

    const { mode, transition, back } = useVisualMode(
        props.interview ? SHOW : EMPTY
      );
    function save(name, interviewer) {
        const interview = {
          student: name,
          interviewer
        };
        transition(SAVING);
        props.bookInterview(props.id, interview)
        .then(() => transition(SHOW))
        .catch((error) => { transition(ERROR_SAVE, true)})
    }

    function deleteAppointment() {
        transition(CONFIRM);
    }
    function confirmDeleteAppointment() {
        transition(DELETE, true);
        props.cancelInterview(props.id)
        .then(() => transition(EMPTY))
        .catch((error) => {transition(ERROR_DELETE, true)});
    }

    function editInterview(name, interviewer) {
        transition(EDIT);
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
                    
                />
            )}
            {mode === SHOW && (
                <Show
                student={props.interview && props.interview.student}
                interviewer={props.interview && props.interview.interviewer}
                onEdit={editInterview}
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
            {mode === EDIT && (
                <Form 
                    name={props.interview.student}
                    interviewer={props.interview.interviewer && props.interview.interviewer.id}
                    interviewers={props.interviewers}
                    onCancel={() => back()}
                    onSave={save}
                />
            )}
            {mode === ERROR_SAVE && (
                <Error 
                    message={"Appointment not saved, try again"}
                    onClose={back}
                />
            )}
            {mode === ERROR_DELETE && (
                <Error 
                message={"Appointment not deleted, try again"}
                onClose={back} 
                />
            )}


        </article>
    )
}