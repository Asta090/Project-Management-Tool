import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import "./Calendar.css";

interface EventItem {
  title: string;
  time: string;
}

interface Event {
  day: number;
  month: number;
  year: number;
  events: EventItem[];
}

const EventPopup: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: EventItem) => void;
}> = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");

  const handleSave = () => {
    if (title && time) {
      onSave({ title, time });
      setTitle("");
      setTime("");
      onClose();
    } else {
      alert("Please fill in all fields.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="event-popup-overlay">
      <div className="event-popup">
        <h2>Add Event</h2>
        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="time"
          placeholder="Event Time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <div className="popup-buttons">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const Calendar: React.FC = () => {
  const [today] = useState(new Date());
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [activeDay, setActiveDay] = useState(today.getDate());
  const [eventsArr, setEventsArr] = useState<Event[]>([]);
  const [gotoDateInput, setGotoDateInput] = useState("");
  const [isEventPopupOpen, setIsEventPopupOpen] = useState(false);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    const savedEvents = localStorage.getItem("events");
    if (savedEvents) {
      setEventsArr(JSON.parse(savedEvents));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(eventsArr));
  }, [eventsArr]);

  const initCalendar = () => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    const prevDays = prevLastDay.getDate();
    const lastDate = lastDay.getDate();
    const day = firstDay.getDay();
    const nextDays = 7 - lastDay.getDay() - 1;

    let days = [];
    for (let x = day; x > 0; x--) {
      days.push(
        <div key={`prev-${x}`} className="day prev-date" onClick={prevMonth}>
          {prevDays - x + 1}
        </div>
      );
    }

    for (let i = 1; i <= lastDate; i++) {
      const event = eventsArr.find(
        (event) =>
          event.day === i && event.month === month + 1 && event.year === year
      );
      days.push(
        <div
          key={i}
          className={`day ${activeDay === i ? "active" : ""} ${
            event ? "event" : ""
          }`}
          onClick={() => {
            setActiveDay(i);
            updateEvents(i);
          }}
        >
          {i}
        </div>
      );
    }

    for (let j = 1; j <= nextDays; j++) {
      days.push(
        <div key={`next-${j}`} className="day next-date" onClick={nextMonth}>
          {j}
        </div>
      );
    }

    return days;
  };

  const prevMonth = () => {
    setMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (month === 0) setYear((prev) => prev - 1);
  };

  const nextMonth = () => {
    setMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (month === 11) setYear((prev) => prev + 1);
  };

  const goToToday = () => {
    setMonth(today.getMonth());
    setYear(today.getFullYear());
    setActiveDay(today.getDate());
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

  const updateEvents = (date: number) => {
    const day = new Date(year, month, date);
    const dayName = day.toString().split(" ")[0];
    const eventDate = `${date} ${months[month]} ${year}`;
    console.log("Active Day:", dayName, eventDate);
  };

  const handleSaveEvent = (event: EventItem) => {
    const newEvent: Event = {
      day: activeDay,
      month: month + 1,
      year: year,
      events: [event],
    };

    const existingEventIndex = eventsArr.findIndex(
      (e) => e.day === activeDay && e.month === month + 1 && e.year === year
    );

    if (existingEventIndex !== -1) {
      // If an event already exists for this date, append the new event
      const updatedEvents = [...eventsArr];
      updatedEvents[existingEventIndex].events.push(event);
      setEventsArr(updatedEvents);
    } else {
      // If no event exists for this date, add a new event
      setEventsArr([...eventsArr, newEvent]);
    }
  };

  return (
    <div className="container">
      <div className="left">
        <div className="calendar">
          <div className="month">
            <FontAwesomeIcon icon={faAngleLeft} className="prev" onClick={prevMonth} />
            <div className="date">{months[month]} {year}</div>
            <FontAwesomeIcon icon={faAngleRight} className="next" onClick={nextMonth} />
          </div>
          <div className="weekdays">
            {weekdays.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>
          <div className="days">{initCalendar()}</div>
          <div className="goto-today">
            <div className="goto">
              <input
                type="text"
                placeholder="mm/yyyy"
                value={gotoDateInput}
                onChange={(e) => setGotoDateInput(e.target.value)}
              />
              <button className="goto-btn" onClick={gotoDate}>Go</button>
            </div>
            <button className="today-btn" onClick={goToToday}>Today</button>
          </div>
        </div>
      </div>
      <div className="right">
        <div className="today-date">
          <div className="event-day">{new Date(year, month, activeDay).toString().split(" ")[0]}</div>
          <div className="event-date">{activeDay} {months[month]} {year}</div>
        </div>
        <div className="events">
          {eventsArr
            .find(
              (event) =>
                event.day === activeDay &&
                event.month === month + 1 &&
                event.year === year
            )
            ?.events.map((event, index) => (
              <div key={index} className="event">
                <div className="title">
                  <FontAwesomeIcon icon={faCircle} />
                  <h3 className="event-title">{event.title}</h3>
                </div>
                <div className="event-time">
                  <span>{event.time}</span>
                </div>
              </div>
            )) || <div className="no-event">No Events</div>}
        </div>
        <button className="add-event-btn" onClick={() => setIsEventPopupOpen(true)}>
          Add Event
        </button>
      </div>
      <EventPopup
        isOpen={isEventPopupOpen}
        onClose={() => setIsEventPopupOpen(false)}
        onSave={handleSaveEvent}
      />
    </div>
  );
};

export default Calendar;
