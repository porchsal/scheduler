

export function getAppointmentsForDay(state, day) {
    let result = [];
    let appointmentsForDay = state.days.filter(e => e.name === day);
    if(!appointmentsForDay) 
        return result;
    if (appointmentsForDay.length === 0){ 
        return result;}
    for (const a of appointmentsForDay[0].appointments) {
    result.push(state.appointments[a]);
        }
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

export function getInterviewersForDay(state, day) {
    let result = [];
    let interviewersForDay = state.days.find(e => e.name === day);
    if (!interviewersForDay) {
        return result;
      }
    if (interviewersForDay.interviewers.length < 1) {
        return result;
      }
         
    let actualInterviewers = interviewersForDay.interviewers;
    result = actualInterviewers.map(id => state.interviewers[id]);
    return result;
};
