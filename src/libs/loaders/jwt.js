import { refreshJwt } from 'actions/jwt';

export default ({ dispatch, token }) => {
    const refresh = 1000 * 60 * 20; // every 20 minutes
    // const refresh = 1000 * 20; // every 20 sec - dev purposes
    setInterval(() => {
        dispatch(refreshJwt(token));
    }, refresh);
}
