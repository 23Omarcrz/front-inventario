import axios from 'axios';

const dataFromApi = async (method, url, endpoint = "", body) => {
    try {
        const response = await axios({
            url: `/api/${url}${endpoint}`,
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