import axios from 'axios';

const dataFromApi = async (method, url, endpoint = "", body) => {
    try {
        const response = await axios({
            url: `http://192.168.3.58:3000/${url}${endpoint}`,
            method,
            data: body,
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            withCredentials: true,
            timeout: 15000
        });
        return response;
    } catch (err) {
        throw err;
    }
};

export default dataFromApi;