import axios from "axios"

const url = "http://localhost:3000"
class FetchingService {
    async get(route, params = {}, headers = {}) {
        try {
            const apiURL = url.concat(route);
            const response = await axios.get(apiURL, {
                params, // Correctly pass query parameters
                headers
            });
            return response?.data;
        } catch (error) {
            console.error(error);
        }
    }    
    async patch(route, body, headers) {
        try {
            const apiURL = url.concat(route)
            const response = await axios.patch(apiURL, body, {headers})
            return response?.data;
        } catch (error) {
            console.error(error)
        }
    }
    async post(route, body, headers, noParse = false) {
        try {
            const apiURL = url.concat(route)
            const response = await axios.post(apiURL, body, {headers})
            console.log(response)
            if (noParse) {
                return response;
            } else {
                return response?.data;
            }
        } catch (error) {
            console.error(error)
        }
    }
}

export const fetchingService = new FetchingService();