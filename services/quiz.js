import axios from "axios";
const BASE_URL = "/api";

export const createQuiz = async quizData => {
    try {
        const config = {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        };

        let resp = await axios.post(`${BASE_URL}/quiz`, quizData, config)

        return resp.data

    } catch (err) {
        console.log(err)
    }
}

export async function getQuizzes() {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        let resp = await axios.get(`${BASE_URL}/quiz`, config)

        return resp.data

    } catch (err) {
        console.log(err)
    }
}


export const getQuizDetail = async quizId => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        let resp = await axios.get(`${BASE_URL}/quiz/details/${quizId}`, config)

        return resp.data
    } catch (err) {
        console.log(err)
    }
}

export const enrollToQuiz = async (quizId, userId) => {
    try {
        let resp = await axios.patch(`${BASE_URL}/quiz/enroll/${quizId}/${userId}`);

        return resp.data;

    } catch (err) {
        console.log(err)
    }
}

export const enrollToQuizCode = async (quizCode) => {
    try {
        let resp = await axios.patch(`${BASE_URL}/quiz/enroll_private/${quizCode}`);

        return resp.data;

    } catch (err) {
        console.log(err.response.data)
        return err.response.data
    }
}

export const startQuiz = async (quizId, userId) => {
    try {
        let resp = await axios.patch(`${BASE_URL}/quiz/start/${quizId}/${userId}`);
        console.log(resp)

        return resp.data

    } catch (err) {
        console.log(err.response.data)
        return err.response.data
    }
}

export const getMyEnrolledQuizzes = async userId => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        let resp = await axios.get(`${BASE_URL}/quiz/enrolled/${userId}`, config)

        return resp.data

    } catch (err) {
        console.log(err)
    }
}


export const submitQuiz = async (params, quizData) => {
    try {
        const config = {
            headers: {
                Accept:"application/json",
                "Content-Type":"application/json"
            }
        }

        let resp = await axios.post(`${BASE_URL}/quiz/start/${params.quizId}/${params.userId}`, quizData, config)

        return resp.data

    } catch (err) {
        console.log(err)        
    }
}

export const getQuizAttemptResponses = async quizId => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        let resp = await axios.get(`${BASE_URL}/quiz/start/${quizId}`, config)

        return resp.data

    } catch (err) {
        console.log(err)
    }
}

export const resetQuiz = async () => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        let resp = await axios.get(`${BASE_URL}/quiz/start`, config)

        return resp.data

    } catch (err) {
        console.log(err)
    }
}

export const removeQuiz = async (quizId) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        let resp = await axios.delete(`${BASE_URL}/quiz/details/${quizId}`, config)

        return resp.data

    } catch (err) {
        console.log(err)
    }
}