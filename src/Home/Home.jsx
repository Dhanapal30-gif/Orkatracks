import React, { useState, useEffect } from 'react';
import './Home.css';
import { getHoliday } from '../Services/Services';  // Adjust the import path if needed
import moment from 'moment';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch holiday data
  const getEvent = () => {
    getHoliday()
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : [];

        // Sort events by date
        const sortedEvents = data
          .map(event => ({
            title: event.holiDayName, // Holiday name from API response
            date: moment(event.holiDay, "YYYY-MM-DD") // Adjusted to correct date format
          }))
          .sort((a, b) => a.date - b.date); // Sorting by date in ascending order

        setEvents(sortedEvents); // Store sorted holidays
        setCurrentIndex(0); // Start from the first holiday
      })
      .catch((error) => {
        console.error("Error fetching holiday data:", error);
      });
  };

  useEffect(() => {
    getEvent(); // Fetch holiday data on component mount
  }, []);

  const nextEvent = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
  };

  const prevEvent = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length);
  };

  return (
    <div style={{backgroundColor:'#244d5c',width:'100%',height:'707px'}}>
    <div className='home'>
      {events.length > 0 ? (
        <>
          <h1>{events[currentIndex].title}</h1>
          <p>{events[currentIndex].date.format("DD-MM-YYYY")}</p>
          <button onClick={prevEvent}>&lt; Previous</button>
          <button onClick={nextEvent}>Next &gt;</button>
        </>
      ) : (
        <p>Loading holidays...</p>
      )}
    </div>
    </div>
  );
}

export default Home;
