import axios from "utils/axios";
import jwtDecode from "jwt-decode";

export const setSession = (token) => {
  if (token) {
    localStorage.setItem("access-token", token);
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem("access-token");
    delete axios.defaults.headers.common.Authorization;
  }
};

export const setRefresh = (token) => {
  if (token) {
    localStorage.setItem("refresh-token", token);
  } else {
    localStorage.removeItem("refresh-token");
  }
};

export const verifyToken = (serviceToken) => {
  if (!serviceToken) {
    return false;
  }
  const decoded = jwtDecode(serviceToken);
  /**
   * Property 'exp' does not exist on type '<T = unknown>(token: string, options?: JwtDecodeOptions | undefined) => T'.
   */
  return decoded.exp > Date.now() / 1000;
};

export const formatDate = (date) => {
  if (!date) return null;

  // Create new date object from given date string
  const dateTime = new Date(date);

  // Extract year, month, and day from date object as strings
  const year = dateTime.getFullYear();
  const month = (dateTime.getMonth() + 1).toString().padStart(2, "0");
  const day = dateTime.getDate().toString().padStart(2, "0");

  // Extract hour and minute from date object as strings
  let ampm = "AM";
  let hour = dateTime.getHours();
  if (hour >= 12) {
    ampm = "PM";
    if (hour !== 12) hour -= 12;
  } else {
    if (hour === 0) hour = 12;
  }
  hour = hour.toString().padStart(2, "0");
  const minute = dateTime.getMinutes().toString().padStart(2, "0");

  // Return formatted date string using template literals
  return `${month}/${day}/${year} ${hour}:${minute} ${ampm}`;
};
