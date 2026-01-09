// import axios from "axios";

// const API = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default API;

import axios from "axios";

const API = axios.create({
   baseURL: import.meta.env.VITE_API_URL ||  "http://localhost:5256",
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
