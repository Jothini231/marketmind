import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getUsers = () => api.get("/users").then((res) => res.data);

export const getRecommendations = (userId) =>
  api.get(`/recommendations/${userId}`).then((res) => res.data);

export const getListings = (params) =>
  api.get("/listings", { params }).then((res) => res.data);

export const createInteraction = (data) =>
  api.post("/interactions", data).then((res) => res.data);

export const getUserInteractions = (userId) =>
  api.get(`/interactions/${userId}`).then((res) => res.data);

export const getListingImage = (listingId) =>
  api.get(`/images/${listingId}`).then((res) => res.data);

export default api;
