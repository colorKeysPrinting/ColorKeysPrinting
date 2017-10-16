import axios        from 'axios';
import { Cookies }  from 'react-cookie';

const cookies = new Cookies();
const instance = axios.create({
    baseURL: process.env.API_URL,
    timeout: 20000,
    headers: {
        'content-type': 'application/json; charset=UTF-8',
    },
    cookies
})

instance.interceptors.request.use(
    (config) => {
        if (_.size(config.cookies.get('sibi-ge-admin')) > 0) {
            const token = config.cookies.get('sibi-ge-admin').token;
            config.headers['x-auth-token'] = token;
        }
        return config
    }
)

export default instance;