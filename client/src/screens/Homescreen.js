import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Room from '../components/Room';
import Loader from '../components/Loader';
import Error from '../components/Error';
import moment from 'moment';
import { DatePicker } from 'antd';
import { TimePicker } from 'antd';

const { RangePicker } = DatePicker;

function Homescreen() {
  const [rooms, setrooms] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(false);
  const [fromdate, setfromdate] = useState();
  const [todate, settodate] = useState();
  const [duplicaterooms, setduplicaterooms] = useState([]);
  const [searchkey, setsearchkey] = useState('');
  const [type, settype] = useState('all');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setloading(true);
        const { data } = await axios.get('/api/rooms/getallrooms');
        setrooms(data);
        setduplicaterooms(data);
        setloading(false);
      } catch (error) {
        seterror(true);
        console.log(error);
        setloading(false);
      }
    };

    fetchRooms();
  }, []);

  function filterByDate(dates) {
    if (!dates) {
      setrooms(duplicaterooms); // Reset to show all rooms
      setfromdate(null);
      settodate(null);
      return;
    }

    const temprooms = [];

    const fromDate = moment(dates[0].$d).format('DD-MM-YYYY');
    const toDate = moment(dates[1].$d).format('DD-MM-YYYY');

    setfromdate(fromDate);
    settodate(toDate);

    for (const room of duplicaterooms) {
      let availability = true;

      if (room.currentbookings.length > 0) {
        for (const booking of room.currentbookings) {
          const bookingFromDate = booking.fromdate;
          const bookingToDate = booking.todate;

          // Check if the selected date range overlaps with the booking date range or exactly matches the start/end dates
          if (
            moment(fromDate).isBetween(bookingFromDate, bookingToDate, null, '[]') ||
            moment(toDate).isBetween(bookingFromDate, bookingToDate, null, '[]') ||
            moment(bookingFromDate).isBetween(fromDate, toDate, null, '[]') ||
            moment(bookingToDate).isBetween(fromDate, toDate, null, '[]') ||
            fromDate === bookingFromDate ||
            fromDate === bookingToDate ||
            toDate === bookingFromDate ||
            toDate === bookingToDate
          ) {
            availability = false;
            break; // Stop checking further if the room is not available
          }
        }
      }

      if (availability || room.currentbookings.length === 0) {
        temprooms.push(room);
      }
    }

    setrooms(temprooms);
  }

  function filterBySearch() {
    const temprooms = duplicaterooms.filter((room) =>
      room.name.toLowerCase().includes(searchkey.toLowerCase())
    );
    setrooms(temprooms);
  }

  function filterByType(e) {
    const selectedType = e.target.value;
    settype(selectedType);

    if (selectedType === 'all') {
      // Show all rooms
      setrooms(duplicaterooms);
    } else {
      // Filter by selected type
      const temprooms = duplicaterooms.filter(
        (room) => room.type.toLowerCase() === selectedType.toLowerCase()
      );
      setrooms(temprooms);
    }
  }

  return (
    <div className='container'>
      <div className='row mt-5 bs'>
        <div className='col-md-3'>
          <RangePicker format='DD-MM-YYYY' onChange={filterByDate} />
          <TimePicker.RangePicker />
        </div>
        <div className='col-md-5 d-flex align-items-center'>
          <input
            type='text'
            className='form-control me-2'
            placeholder='Search rooms'
            value={searchkey}
            onChange={(e) => {
              setsearchkey(e.target.value);
            }}
            onKeyUp={filterBySearch}
          />
          <div className='col-md-3'>
            <select
              className='form-control'
              value={type}
              onChange={filterByType} // Directly call filterByType
            >
              <option value='all'>All</option>
              <option value='Standard'>Standard</option>
              <option value='Suite'>Suite</option>
              <option value='Deluxe'>Deluxe</option>
            </select>
          </div>
        </div>
      </div>

      <div className='row justify-content-center mt-5'>
        {loading ? (
          <Loader />
        ) : (
          rooms.map((room) => (
            <div className='col-md-9 mt-2' key={room._id}>
              <Room room={room} fromdate={fromdate} todate={todate} searchkey={searchkey} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Homescreen;
