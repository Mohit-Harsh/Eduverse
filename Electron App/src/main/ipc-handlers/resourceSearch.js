<<<<<<< HEAD
import axios from "axios";

async function searchResources()
{
    let res = await axios.get(`https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_SEARCH_API_KEY}&cx=${process.env.SEARCH_ENGINE_ID}&q=${"MOS Circuit Design Processes PDF notes for VLSI"}`);
    let data = res.data;
}

export default searchResources;
=======
import axios from 'axios'

async function searchResources() {
  let res = await axios.get(
    `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_SEARCH_API_KEY}&cx=${process.env.SEARCH_ENGINE_ID}&q=${'MOS Circuit Design Processes PDF notes for VLSI'}`
  )
  let data = res.data
}

export default searchResources
>>>>>>> 3ac1da4 (added upload functionality)
