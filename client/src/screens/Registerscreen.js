import React, { useState, useEffect } from 'react'

import Loader from '../components/Loader';
import Error from '../components/Error';
import Success from '../components/Success';
import axios from "axios";

function Registerscreen() {
    const [name, setname] = useState('');
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const [cpassword, setcpassword] = useState('');

    const [loading, setloading] = useState(false)
    const [error, seterror] = useState()
    const [success, setsuccess] = useState()

    async function register() {
        if (!name || !email || !password || !cpassword) {
            alert('Please fill in all fields');
            return;
        }
        if (password == cpassword) {
            const user = {
                name,
                email,
                password,
                cpassword
            }

            try {
                setloading(true)
                const result = await axios.post('http://localhost:5000/api/users/register', user).data
                setloading(false)
                setsuccess(true)

                setname('')
                setemail('')
                setpassword('')
                setcpassword('')

            } catch (error) {
                console.log(error)
                setloading(false)
                seterror(true)

            }
        }
        else {
            alert('password not matched!')
        }
    }
    return (
        <div>
            {loading && (<Loader />)}
            {error && (<Error />)}
            <div className='row justify-content-center mt-5'>
                <div className='col-md-5'>
                    {success && (<Success message='Registration successful, click on login!' />)}

                    <div className='bs'>
                        <h2>Register</h2>
                        <input type='text' className='form-control' placeholder='name'
                            value={name} onChange={(e) => setname(e.target.value)} />
                        <input type='text' className='form-control' placeholder='email'
                            value={email} onChange={(e) => setemail(e.target.value)} />
                        <input type='password' className='form-control' placeholder='password'
                            value={password} onChange={(e) => setpassword(e.target.value)} />
                        <input type='password' className='form-control' placeholder='confirm password'
                            value={cpassword} onChange={(e) => setcpassword(e.target.value)} />
                        <div className='d-flex justify-content-center'>
                            <button className='btn btn-primary mt-3' onClick={register}>Register</button>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Registerscreen