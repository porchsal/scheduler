import { useReducer, useEffect } from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

function reducer(state, action) {
    if (action.type === SET_DAY) {
        return { ...state, day: action.day };
    } else if (action.type === SET_APPLICATION_DATA) {
        return {
            ...state,
            days: action.days,
            appointments: action.appointments,
            interviewers: action.interviewers
        };
    } else if (action.type === SET_INTERVIEW) {
        const { id, interview } = action;
        return {
            ...state,
            days: state.days.map((day) => {
                let changeInSpots = 0;
                if (day.name === state.day) {
                    if (interview && state.appointments[id].interview) {
                        changeInSpots = 0;
                    } else if (interview) {
                        changeInSpots = -1;
                    } else {
                        changeInSpots = 1;
                    }
                }
                return {
                    ...day,
                    spots: day.spots + changeInSpots
                };
            }),
            appointments: {
                ...state.appointments,
                [id]: {
                    ...state.appointments[action.id],
                    interview: action.interview ? { ...interview } : null
                }
            }
        }
    } else {
        throw new Error(
            `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
}



export default function useApplicationData(){
    const [state, dispatch] = useReducer(reducer, {
        day: "Monday",
        days: [],
        appointments: {},
        interviewers: {}
      });
    
    const setDay = day => dispatch({ type: SET_DAY, day });

    useEffect(() => {
        const daysData = axios.get("/api/days");
        const appointmentsData = axios.get("/api/appointments");
        const interviewersData = axios.get("/api/interviewers");
        Promise.all([daysData, appointmentsData, interviewersData])
            .then(all => {
                dispatch({
                    type: SET_APPLICATION_DATA,
                    days: all[0].data,
                    appointments: all[1].data,
                    interviewers: all[2].data
                })
            })
    }, []);
    
    
    function bookInterview(id, interview) {
  
        const appointment = {
          ...state.appointments[id],
          interview
        };
        return axios.put(`/api/appointments/${id}`, appointment)
        .then(() => dispatch({type: SET_INTERVIEW, id, interview}))
      };
      
    function cancelInterview(id) {
      const appointment = {
        ...state.appointments[id],
        interview: null
      }

      return axios.delete(`/api/appointments/${id}`, appointment)
      .then(() => dispatch({type: SET_INTERVIEW, id, interview:null}))
    
      }
    return {
        state,
        setDay,
        bookInterview,
        cancelInterview
    }
};