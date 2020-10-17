import axios from 'axios'

var from = 0;
var to = 12;
const retrieveBooks = async (bookIndex) => {
    try {
        const response = await axios.get('http://localhost:5000/book/from=' + from + '/to=' + to, bookIndex)
        // i think these numbers need to store in a state so that based on those numbers we can query others
        //eg: if im at 1-20, i click next, it will query 21-40
        return response.data;
    }
    catch (error) {
        console.log("error", error);
    }
}

export default retrieveBooks