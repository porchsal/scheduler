import React, { useState, useEffect } from "react";
import DayList from "components/DayList";
import "components/Application.scss";
import Appointment from "components/Appointment";
import axios from "axios";
import { getAppointmentsForDay } from "helpers/selectors";

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });
  const dailyAppointments = getAppointmentsForDay(state, state.day);
 const setDay = day => setState({ ...state, day });
  console.log(dailyAppointments);
  useEffect(() => {

    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments")

    ]).then(([days, appointments]) => {
      setState(prev => {
        return (
          {...prev, days: days.data, appointments: appointments.data}
          )
      })
    })
  }, []);
  
  const appointmentComponents = dailyAppointments.map(appointment => {
    return (
      <Appointment 
        key={appointment.id} 
        {...appointment} 
      />
    )
  });

  return (
    <main className="layout">
      <section className="sidebar">
        {/* Replace this with the sidebar elements during the "Project Setup & Familiarity" activity. */}
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days} 
            day={state.day} 
            setDay={setDay}
          />

        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointmentComponents}
        <Appointment 
          key="last" time="5pm" 
        />
      </section>
    </main>
  );
}
