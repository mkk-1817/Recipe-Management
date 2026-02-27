import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL;
export const fetchRecipes = async (limit = 30, skip = 0) => {
  const response = await axios.get(`${API_BASE}?limit=${limit}&skip=${skip}`);
  return response.data;
};
export const fetchRecipeById = async (id) => {
  const response = await axios.get(`${API_BASE}/${id}`);
  return response.data;
};

export const searchRecipes = async (query) => {
  const response = await axios.get(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
  return response.data;
};


export const fetchRecipesByTag = async (tag) => {
  const response = await axios.get(`${API_BASE}/tag/${encodeURIComponent(tag)}`);
  return response.data;
};

export const fetchTags = async () => {
  const response = await axios.get('https://dummyjson.com/recipes/tags');
  return response.data;
};

export const addRecipe = async (recipeData) => {
  const response = await axios.post(`${API_BASE}/add`, recipeData, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const getLikedRecipes = () => {
  try {
    const liked = localStorage.getItem('liked_recipes');
    return liked ? JSON.parse(liked) : [];
  } catch {
    return [];
  }
};

export const saveLikedRecipes = (likedIds) => {
  localStorage.setItem('liked_recipes', JSON.stringify(likedIds));
};
