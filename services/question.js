import axios from "axios";
const BASE_URL = "http://localhost:3000/api/question";

export const createQuestion = async (quizId, questionData) => {
    try {
        console.log(quizId)
        const config = {
            headers: {
                Accept: "application/json",
                "Content-Type":"application/json"
            }
        }

        const resp = await axios.post(`${BASE_URL}/creating/${quizId}`, questionData, config);
        return resp.data;

    } catch (err) {
        console.log(err)
    }
}
