import React, { useState, useEffect } from "react";
import "./Calendar.css";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight, faPlus, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";

interface EventItem {
  _id: string;
  title: string;
  time: string;
}

interface Event {
  _id: string;
  day: number;
  month: number;
  year: number;
  events: EventItem[];
}

const Calendar = () => {
  const [today] = useState(new Date());
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [activeDay, setActiveDay] = useState(today.getDate());
  const [eventsArr, setEventsArr] = useState<Event[]>([]);
  const [eventTitle, setEventTitle] = useState("");
  const [eventTimeFrom, setEventTimeFrom] = useState("");
  const [eventTimeTo, setEventTimeTo] = useState("");
  const [showEventForm, setShowEventForm] = useState(false);
  const [gotoDateInput, setGotoDateInput] = useState("");

  useEffect(() => {
    const savedEvents = localStorage.getItem("events");
    if (savedEvents) {
      setEventsArr(JSON.parse(savedEvents));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(eventsArr));
  }, [eventsArr]);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const initCalendar = () => {
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const prevLastDate = new Date(year, month, 0).getDate();
    const nextDays = 7 - new Date(year, month + 1, 0).getDay() - 1;

    let days = [];
    for (let x = firstDay; x > 0; x--) {
      days.push(
        <motion.div className="day prev-date" key={`prev-${x}`} onClick={prevMonth}>
          {prevLastDate - x + 1}
        </motion.div>
      );
    }
    for (let i = 1; i <= lastDate; i++) {
      let event = eventsArr.find(event => event.day === i && event.month === month + 1 && event.year === year);
      days.push(
        <motion.div
          key={i}
          className={`day ${activeDay === i ? "selected" : ""} ${event ? "event" : ""}`}
          onClick={() => setActiveDay(i)}
          whileHover={{ scale: 1.1 }}
        >
          {i}
        </motion.div>
      );
    }
    for (let j = 1; j <= nextDays; j++) {
      days.push(
        <motion.div className="day next-date" key={`next-${j}`} onClick={nextMonth}>
          {j}
        </motion.div>
      );
    }
    return days;
  };

  const addEvent = () => {
    if (!eventTitle || !eventTimeFrom || !eventTimeTo) {
      alert("Please fill all fields");
      return;
    }

    const newEvent = {
      _id: Math.random().toString(36).substr(2, 9),
      title: eventTitle,
      time: `${eventTimeFrom} - ${eventTimeTo}`,
    };

    setEventsArr(prevEvents => {
      let updatedEvents = [...prevEvents];
      let existingEvent = updatedEvents.find(event => event.day === activeDay && event.month === month + 1 && event.year === year);

      if (existingEvent) {
        existingEvent.events.push(newEvent);
      } else {
        updatedEvents.push({
          _id: Math.random().toString(36).substr(2, 9),
          day: activeDay,
          month: month + 1,
          year: year,
          events: [newEvent],
        });
      }

      return updatedEvents;
    });

    setEventTitle("");
    setEventTimeFrom("");
    setEventTimeTo("");
    setShowEventForm(false);
  };

  const deleteEvent = (eventId: string) => {
    setEventsArr(prevEvents =>
      prevEvents
        .map(event => ({
          ...event,
          events: event.events.filter(e => e._id !== eventId),
        }))
        .filter(event => event.events.length > 0)
    );
  };

  const gotoDate = () => {
    const dateArr = gotoDateInput.split("/");
    if (dateArr.length === 2 && dateArr[0] > "0" && dateArr[0] < "13" && dateArr[1].length === 4) {
      setMonth(Number(dateArr[0]) - 1);
      setYear(Number(dateArr[1]));
      setGotoDateInput("");
    } else {
      alert("Invalid Date Format. Use mm/yyyy");
    }
  };

  const prevMonth = () => {
    setMonth(prev => (prev === 0 ? 11 : prev - 1));
    if (month === 0) setYear(prev => prev - 1);
  };

  const nextMonth = () => {
    setMonth(prev => (prev === 11 ? 0 : prev + 1));
    if (month === 11) setYear(prev => prev + 1);
  };

  const goToToday = () => {
    setMonth(today.getMonth());
    setYear(today.getFullYear());
    setActiveDay(today.getDate());
  };

  const getEventsForActiveDay = () => {
    return eventsArr.find(event => event.day === activeDay && event.month === month + 1 && event.year === year)?.events || [];
  };

  return (
    <motion.div className="Calendar-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="left">
        <div className="calendar">
          <div className="month">
            <FontAwesomeIcon icon={faAngleLeft} className="prev" onClick={prevMonth} />
            <div className="date">{months[month]} {year}</div>
            <FontAwesomeIcon icon={faAngleRight} className="next" onClick={nextMonth} />
          </div>
          <div className="weekdays">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => <div key={day}>{day}</div>)}
          </div>
          <div className="days">{initCalendar()}</div>
        </div>
      </div>
      <div className="right">
        <button onClick={goToToday}>Today</button>
        <input type="text" placeholder="mm/yyyy" value={gotoDateInput} onChange={(e) => setGotoDateInput(e.target.value)} />
        <button onClick={gotoDate}>Go</button>

        <div className="events">
          {getEventsForActiveDay().length > 0 ? getEventsForActiveDay().map(event => (
            <div className="event" key={event._id}>
              <h3>{event.title}</h3>
              <span>{event.time}</span>
              <FontAwesomeIcon icon={faTrash} onClick={() => deleteEvent(event._id)} />
            </div>
          )) : <h3>No Events</h3>}
        </div>

        <button className="add-event" onClick={() => setShowEventForm(!showEventForm)}>+</button>

        {showEventForm && (
          <div className="event-form">
            <input type="text" placeholder="Event Title" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} />
            <input type="time" value={eventTimeFrom} onChange={(e) => setEventTimeFrom(e.target.value)} />
            <input type="time" value={eventTimeTo} onChange={(e) => setEventTimeTo(e.target.value)} />
            <button onClick={addEvent}>Add</button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Calendar;
