import axios from "axios";

const findZipCode = axios.create({
  baseURL: "https://api.pagar.me/1/zipcodes",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default findZipCode;
