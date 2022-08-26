import axios from "axios";
// const BASE_URL = "http://localhost:3000/api";

const register = async (userData) => {
    try {
        const config = {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        };

        let resp = await axios.post(`/api/user`, userData, config);
        console.log(resp.data)
        return resp.data;
    } catch (err) {
        console.log(err);
        return err.response.data
    }
};


export { register };
