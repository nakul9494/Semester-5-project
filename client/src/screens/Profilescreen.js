import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import axios from 'axios';
import Loader from '../components/Loader';
import Error from '../components/Error';
import Swal from 'sweetalert2'
import { Divider, Flex, Tag } from 'antd';


const { TabPane } = Tabs;

export default function Profilescreen() {
  const user = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    if (!user) {
      window.location.href = '/login';
    }
  }, [user]);

  return (
    <div className='mt-3 bs'>
      {/* Apply margin-left to tabs */}
      <Tabs defaultActiveKey='1' tabBarStyle={{ marginLeft: '1.5rem' }}>
        <TabPane tab='Profile' key='1'>
          {/* Apply margin-left to tab content */}
          <div style={{ marginLeft: '1.5rem' }}>
            <h1>My Profile</h1>
            <br />
            <h1>Name : {user.name}</h1>
            <h1>Email : {user.email}</h1>
            <h1>isAdmin : {user.isAdmin ? 'YES' : 'NO'}</h1>
          </div>
        </TabPane>
        <TabPane tab='Bookings' key='2'>
          {/* Apply margin-left to tab content */}
          <div style={{ marginLeft: '1.5rem' }}>
            <MyBookings />
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
}

export function MyBookings() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const [bookings, setBookings] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState();

  useEffect(() => {
    let isMounted = true;

    const fetchBookings = async () => {
      try {
        setloading(true);
        const { data } = await axios.post('/api/bookings/getbookingsbyuserid', { userid: user._id });
        if (isMounted) {
          setBookings(data);
          console.log(data);
        }
      } catch (error) {
        if (isMounted) {
          console.log(error);
          seterror(error);
        }
      } finally {
        if (isMounted) {
          setloading(false);
        }
      }
    };

    fetchBookings();

    return () => {
      isMounted = false;
    };
  }, [user._id]);


  async function cancelBooking(bookingid, roomid) {

    try {
      setloading(true)
      const { result } = await axios.post("/api/bookings/cancelbooking", { bookingid, roomid });
      console.log(result)
      setloading(false)
      Swal.fire('Congratulations🎉', 'Your Booking has been cancelled successfully!', 'success').then(result => {
        window.location.reload()
      })
    } catch (error) {
      console.log(error)
      setloading(false)
      Swal.fire('Oops☹️', 'Something went wrong', 'error')

    }

  }

  return (
    <div>
      <div className='row'>
        <div className='col-md-6'>
          {loading && (<loader />)}
          {bookings && (bookings.map(booking => {
            return <div className='bs'>
              <h1>{booking.room}</h1>
              <p><b>Booking ID</b> : {booking._id}</p>
              <p><b>Check In</b> : {booking.fromdate}</p>
              <p><b>Check Out</b> : {booking.todate}</p>
              <p><b>Total Amount</b> : {booking.totalAmount}</p>
              {/* <p><b>Status</b> : {booking.status == 'booked' ? 'Confirmed' : 'Cancelled'}</p> */}
              <p><b>Status</b> : {" "}
              {booking.status=='cancelled'? (<Tag color="red">CANCELLED</Tag>) : (<Tag color="green">CONFIRMED</Tag>)}
              </p>

              {booking.status !== 'cancelled' && (<div className='d-flex justify-content-end'>
                <button className='btn btn-primary' onClick={() => { cancelBooking(booking._id, booking.roomid) }}>Cancel Booking</button>
              </div>)}

            </div>
          }))}

        </div>
      </div>
    </div>
  );
}
