import React, { useState, useEffect } from 'react'
import axios from "axios";
import Loader from '../components/Loader';
import Error from '../components/Error';

function Loginscreen() {
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const[loading , setloading] = useState(false)
    const[error , seterror] = useState()

    async function Login() {
        const user = {
            email,
            password
        };
        try {
            setloading(true);
            const response = await axios.post('http://localhost:5000/api/users/login', user);
            const result = response.data;
    
            if (response.status === 200 && result) {
                localStorage.setItem('currentUser', JSON.stringify(result));
                window.location.href = '/home';
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            console.log(error);
            setloading(false);
            seterror(true);
        }
    }
    


    return (
        <div>
            {loading && (<Loader/>)}
            
            <div className='row justify-content-center mt-5'>
                <div className='col-md-5'>
                {error && (<Error message = 'Invalid credentials'/>)}

                    <div className='bs'>
                        <h2>Login</h2>

                        <input type='text' className='form-control' placeholder='email'
                            value={email} onChange={(e) => setemail(e.target.value)} />
                        <input type='password' className='form-control' placeholder='password'
                            value={password} onChange={(e) => setpassword(e.target.value)} />

                        <div className='d-flex justify-content-center'>
                            <button className='btn btn-primary mt-3' onClick={Login}>Login</button>
                        </div>


                    </div>

                </div>
            </div>
        </div>
    )
}

export default Loginscreen