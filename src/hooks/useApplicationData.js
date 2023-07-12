import React, { useReducer, useEffect } from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return { ...state, day: action.day }
    case SET_APPLICATION_DATA:
      return { ...state, days: action.days, appointments: action.appointments, interviewers: action.interviewers }
    case SET_INTERVIEW:
    const { id, interview } = action;

    return {
        ...state,
        appointments: {
            ...state.appointments,
            [id]: {
                ...state.appointments[action.id],
                interview: action.interview ? { ...interview } : null
            }
        }
    }

    default:
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
  
    //   Promise.all([
    //     axios.get("/api/days"),
    //     axios.get("/api/appointments"),
    //     axios.get("/api/interviewers")
  
    //   ]).then(([days, appointments, interviewers]) => {
    //     setState(prev => {
    //       return (
    //         {...prev, days: days.data, appointments: appointments.data, interviewers: interviewers.data}
    //         )
    //     })
    //   })
        const daysData = axios.get("api/days");
        const appointmentsData = axios.get("api/appointments");
        const interviewersData = axios.get("api/interviewers");
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
        // const appointments = {
        //   ...state.appointments,
        //   [id]: appointment
        // };
        return axios.put(`/api/appointments/${id}`, appointment)
        .then(() => dispatch({type: SET_INTERVIEW, id, interview}))
      };
      
    function cancelInterview(id) {
      const appointment = {
        ...state.appointments[id],
        interview: null
      }
    //   const appointments = {
    //     ...state.appointments,
    //     [id]: appointment
    //   }
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