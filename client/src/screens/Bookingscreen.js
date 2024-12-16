import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';
import Error from '../components/Error';
import moment from 'moment';
import StripeCheckout from 'react-stripe-checkout';
import Swal from 'sweetalert2'


function Bookingscreen() {
  const { roomid, fromdate, todate } = useParams();
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState();
  const [room, setRoom] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);

  const Fromdate = moment(fromdate, 'DD-MM-YYYY');
  const Todate = moment(todate, 'DD-MM-YYYY');
  const Totaldays = moment.duration(Todate.diff(Fromdate)).asDays() + 1;

  useEffect(() => {
    if(!localStorage.getItem('currentUser')){
      window.location.reload = '/login'
    }
    const fetchRoom = async () => {
      try {
        setloading(true);
        const { data } = await axios.post('/api/rooms/getroombyid', { roomid });
        setRoom(data);
        setloading(false);

        // Calculate the total amount after room data is fetched
        setTotalAmount(Totaldays * data.rentperday);
      } catch (error) {
        seterror(true);
        console.log(error);
        setloading(false);
      }
    };

    fetchRoom();
  }, [roomid, Totaldays]);




  async function onToken(token) {
    console.log(token)
    const bookingDetails = {
      room,
      userid: JSON.parse(localStorage.getItem('currentUser'))._id,
      fromdate,
      todate,
      totalAmount,
      Totaldays,
      token

    }

    try {
      setloading(true)
      const result = await axios.post('/api/bookings/bookroom', bookingDetails);
      setloading(false)
      Swal.fire('Congratulations🎉','Your room has been booked','success').then(result=>{
        window.location.href='/bookings'
      })
    } catch (error) {
      setloading(false)
      Swal.fire('Oops☹️','Something went wrong','error')
    }
  }



  return (
    <div className='m-5'>
      {loading ? (
        <Loader />
      ) : room ? (
        <div>
          <div className='row justify-content-center mt-5 bs'>
            <div className='col-md-5'>
              <h1>{room.name}</h1>
              <img src={room.imageurls[0]} className='bigimg' alt='Room' />
            </div>
            <div className='col-md-5'>
              <div style={{ textAlign: 'right' }}>
                <h1>Booking Details</h1>
                <hr />
                <b>
                  <p>Name : {JSON.parse(localStorage.getItem('currentUser')).name}</p>
                  <p>From Date : {fromdate}</p>
                  <p>To Date : {todate}</p>
                  <p>Max Count : {room.maxcount}</p>
                </b>
              </div>
              <div style={{ textAlign: 'right' }}>
                <b>
                  <h1>Amount</h1>
                  <hr />
                  <p>Total days : {Totaldays}</p>
                  <p>Rent per day : {room.rentperday}</p>
                  <p>Total Amount : {totalAmount}</p>
                </b>
              </div>
              <div style={{ float: 'right' }}>


                <StripeCheckout
                  amount={totalAmount * 100}
                  token={onToken}
                  currency='INR'
                  stripeKey={process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}>
                  <button className='btn btn-primary'>Pay Now</button>
                </StripeCheckout>

              </div>
            </div>
          </div>
        </div>
      ) : (
        <Error />
      )}
    </div>
  );
}

export default Bookingscreen;
