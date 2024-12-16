import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import axios from 'axios';

import Loader from '../components/Loader';
import Error from '../components/Error';
const { TabPane } = Tabs;

function Adminscreen() {
   
    return (
        <div className="mt-3 bs" style={{ marginLeft: '1.5rem', marginRight: '1.5rem' }}>
            <h1 className='text-center'><b>Admin Panel</b></h1>
            <Tabs defaultActiveKey="1" tabBarStyle={{ marginLeft: '1.5rem', marginRight: '1.5rem' }}>
                <TabPane tab="Bookings" key="1">
                    <Bookings />
                </TabPane>
                <TabPane tab="Rooms" key="2">
                    <Rooms />
                </TabPane>
                <TabPane tab="Add Room" key="3">
                    <h1>Add Room</h1>
                </TabPane>
                <TabPane tab="Users" key="4">
                    <User/>
                </TabPane>
            </Tabs>
        </div>
    );
}

export default Adminscreen;

export function Bookings() {
    const [bookings, setbookings] = useState([]);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setloading(true);
                const response = await axios.get("/api/bookings/getallbookings");
                setbookings(response.data);
                setloading(false);
            } catch (error) {
                console.error(error);
                setloading(false);
                seterror(error);
            }
        };

        fetchBookings();

        return () => {
            // any cleanup logic if needed
        };
    }, []);

    return (
        <div className="row">
            <div className='col-md-10'>
                <h1>Bookings</h1>
                {loading && (<Loader />)}
                {error && (<Error message="Something went wrong" />)}
                {bookings.length > 0 ? (
                    <table className="table table-bordered table-dark">
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>User ID</th>
                                <th>Room</th>
                                <th>From Date</th>
                                <th>To Date</th>
                                <th>Status</th>
                                <th>Total Amount</th>
                                <th>Total Days</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map(booking => (
                                <tr key={booking._id}>
                                    <td>{booking._id}</td>
                                    <td>{booking.userid}</td>
                                    <td>{booking.room}</td>
                                    <td>{booking.fromdate}</td>
                                    <td>{booking.todate}</td>
                                    <td>{booking.status}</td>
                                    <td>₹{booking.totalAmount}.00</td>
                                    <td>{booking.Totaldays}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    !loading && <p>No bookings available</p>
                )}
            </div>
        </div>
    );
}

export function Rooms() {
    const [rooms, setrooms] = useState([]);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState();

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                setloading(true);
                const response = await axios.get("/api/rooms/getallrooms");
                setrooms(response.data);
                setloading(false);
            } catch (error) {
                console.error(error);
                setloading(false);
                seterror(error);
            }
        };

        fetchRooms();

        return () => {
            // any cleanup logic if needed
        };
    }, []);

    return (
        <div className="row">
            <div className='col-md-10'>
                <h1>Rooms</h1>
                {loading && (<Loader />)}
                {error && (<Error message="Something went wrong" />)}
                {rooms.length > 0 ? (
                    <table className="table table-bordered table-dark">
                        <thead>
                            <tr>
                                <th>Room ID</th>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Rent per day</th>
                                <th>Max Count</th>
                                <th>Phone Number</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rooms.map(room => (
                                <tr key={room._id}>
                                    <td>{room._id}</td> {/* Add Room ID */}
                                    <td>{room.name}</td>
                                    <td>{room.type}</td>
                                    <td>₹{room.rentperday}</td>
                                    <td>{room.maxcount}</td>
                                    <td>{room.phonenumber}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    !loading && <p>No rooms available</p>
                )}
            </div>
        </div>
    );
}




export function User() {
    const [users, setusers] = useState([]);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setloading(true);
                const response = await axios.get("/api/users/getallusers");
                setusers(response.data);
                setloading(false);
            } catch (error) {
                console.error(error);
                setloading(false);
                seterror(error);
            }
        };

        fetchUsers();

        return () => {
            // any cleanup logic if needed
        };
    }, []);

    return (
        <div className="row">
            <div className='col-md-10'>
                <h1>Users</h1>
                {loading && (<Loader />)}
                {error && (<Error message="Something went wrong" />)}
                {users.length > 0 ? (
                    <table className="table table-bordered table-dark">
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Is Admin</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td>{user._id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.isAdmin ? "Yes" : "No"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    !loading && <p>No users available</p>
                )}
            </div>
        </div>
    );
}