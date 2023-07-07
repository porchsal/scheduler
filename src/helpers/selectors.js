

export function getAppointmentsForDay(state, day) {
    let result = [];
    let appointmentsForDay = state.days.filter(e => e.name === day);
    if(!appointmentsForDay) 
        return result;
    if (appointmentsForDay.length === 0){ 
        console.log(result);
        return result;}
    for (const a of appointmentsForDay[0].appointments) {
    result.push(state.appointments[a]);
        }
    console.log(appointmentsForDay);
    return result;
};

export function getInterview(state, interview) {
    let result = {};
    if(!interview){
        return null;
    } else {
        result = {
            "student": interview.student,
            "interviewer": state.interviewers[interview.interviewer]
        }
    }
    return result;
};
