import { useRef, useState, useEffect } from 'react';
import axios from './api/axios';

const LOGIN_URL = '/api/merchants/login';
const TOPUP_URL = '/api/cashierTopups/cardID/merchantID'

const Login = () => {
    const errRef = useRef();
    const [email, setEmail] = useState('');
    const [merchantID, setMerchantID] = useState('');
    const [emailTopup, setEmailTopup] = useState('');
    const [amount, setAmount] = useState('');
    const [password, setPwd] = useState('');
    const [errMsg, setMsgErr] = useState('');
    const [passwordShown, setPasswordShown] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setMsgErr('');
    }, [email, password]);
    useEffect(() => {
        setMsgErr('');
    }, [emailTopup, amount]);

    // Password toggle handler
    const togglePassword = () => {
        // When the handler is invoked
        // inverse the boolean state of passwordShown
        setPasswordShown(!passwordShown);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log({ email, password });
        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ email: email, password: password }),
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            console.log(JSON.stringify(response?.data));
            alert("Log in successfull")
            const merchantID = response?.data?.id;
            // Pass data
            setMerchantID(merchantID);
            setEmail('');
            setPwd('');
            setSuccess(true);
        } catch (err) {
            if (!err?.response) {
                setMsgErr('No Server Response');
            } else if (err.response?.status === 400) {
                setMsgErr('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setMsgErr('Unauthorized');
            } else {
                setMsgErr('Login Failed');
            }
            errRef.current.focus();
        }
    }

    const handleSubmitTopUp = async (e) => {
        e.preventDefault();
        console.log({ emailTopup, amount, merchantID });
        try {
            const response = await axios.post(TOPUP_URL,
                JSON.stringify({ merchantID: merchantID, email: emailTopup, amount: Number(amount) }),
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            console.log(JSON.stringify(response?.data));
            // Pass data
            setEmailTopup('');
            setAmount('');
            setSuccess(true);
            alert('Top Up Successfull');
        } catch (err) {
            if (!err?.response) {
                setMsgErr('No Server Response');
            } else if (err.response?.status === 400) {
                setMsgErr('Missing Email or Amount');
            } else if (err.response?.status === 404) {
                setMsgErr('User not found');
            }
            else if (err.response?.status === 401) {
                setMsgErr('Unauthorized');
            } else {
                setMsgErr('Top Up Failed');
            }
            errRef.current.focus();
        }
    }

    const handleLogOut = async (e) => {
        alert('Logout successfully');
        window.location.reload(false);
    }

    return (
        <>
            {success ? (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h2>Foodpay Cashier - Topup</h2>
                    <form onSubmit={handleSubmitTopUp}>
                        <label>Email</label>
                        <input
                            type="email"
                            id="email"
                            autoComplete="off"
                            onChange={(e) => setEmailTopup(e.target.value)}
                            value={emailTopup}
                            required
                        />
                        <label>Amount</label>
                        <input
                            type="text"
                            id="amount"
                            onChange={(e) => setAmount(e.target.value)}
                            value={amount}
                            required
                        />
                        <button type='submit'>Proceed</button>
                    </form>
                    <button onClick={handleLogOut}>Log Out</button>
                </section>
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h2>Foodpay Cashier - Sign In</h2>
                    <form onSubmit={handleSubmit}>
                        <label>Email</label>
                        <input
                            type="email"
                            id="email"
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                        />
                        <label>Password</label>
                        <input
                            type={passwordShown ? "text" : "password"}
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={password}
                            required
                        />
                        <p onClick={togglePassword}>Show Password</p>
                        <button type='submit'>Sign In</button>
                    </form>
                </section >
            )}
        </>
    )
}

export default Login;