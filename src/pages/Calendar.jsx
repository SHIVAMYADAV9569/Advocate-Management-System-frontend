import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import './Calendar.css';

const Calendar = ({ user, onLogout }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_URL}/dashboard/calendar?month=${currentDate.getMonth() + 1}&year=${currentDate.getFullYear()}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const data = await response.json();
      if (data.success) {
        setEvents(data.data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const getEventsForDay = (day) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day && 
             eventDate.getMonth() === currentDate.getMonth() &&
             eventDate.getFullYear() === currentDate.getFullYear();
    });
  };

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dayEvents = getEventsForDay(day);
    const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
    
    days.push(
      <div key={day} className={`calendar-day ${isToday ? 'today' : ''}`}>
        <span className="day-number">{day}</span>
        {dayEvents.map((event, idx) => (
          <div key={idx} className={`event ${event.type}`}>
            {event.title}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="page-container">
      <Sidebar user={user} onLogout={onLogout} />
      <div className="main-content">
        <div className="page-header">
          <h1>Calendar</h1>
        </div>

        <div className="calendar-container">
          <div className="calendar-header">
            <button onClick={prevMonth}><ChevronLeft size={24} /></button>
            <h2>{monthName}</h2>
            <button onClick={nextMonth}><ChevronRight size={24} /></button>
          </div>

          <div className="calendar-grid">
            <div className="calendar-weekday">Sun</div>
            <div className="calendar-weekday">Mon</div>
            <div className="calendar-weekday">Tue</div>
            <div className="calendar-weekday">Wed</div>
            <div className="calendar-weekday">Thu</div>
            <div className="calendar-weekday">Fri</div>
            <div className="calendar-weekday">Sat</div>
            {days}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
