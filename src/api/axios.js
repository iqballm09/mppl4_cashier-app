import axios from 'axios';

export default axios.create({
    baseURL: "https://foodpayapi.up.railway.app"
});