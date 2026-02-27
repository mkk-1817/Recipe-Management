import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL;
/**
 * Fetch all recipes with optional pagination
 */
export const fetchRecipes = async (limit = 30, skip = 0) => {
  const response = await axios.get(`${API_BASE}?limit=${limit}&skip=${skip}`);
  return response.data;
};

/**
 * Fetch a single recipe by ID
 */
export const fetchRecipeById = async (id) => {
  const response = await axios.get(`${API_BASE}/${id}`);
  return response.data;
};

/**
 * Search recipes by query string
 */
export const searchRecipes = async (query) => {
  const response = await axios.get(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
  return response.data;
};

/**
 * Fetch recipes by tag/category
 */
export const fetchRecipesByTag = async (tag) => {
  const response = await axios.get(`${API_BASE}/tag/${encodeURIComponent(tag)}`);
  return response.data;
};

/**
 * Get all available tags
 */
export const fetchTags = async () => {
  const response = await axios.get('https://dummyjson.com/recipes/tags');
  return response.data;
};

/**
 * Simulate adding a new recipe (POST)
 */
export const addRecipe = async (recipeData) => {
  const response = await axios.post(`${API_BASE}/add`, recipeData, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

/**
 * Get liked recipe IDs from localStorage
 */
export const getLikedRecipes = () => {
  try {
    const liked = localStorage.getItem('liked_recipes');
    return liked ? JSON.parse(liked) : [];
  } catch {
    return [];
  }
};

/**
 * Save liked recipe IDs to localStorage
 */
export const saveLikedRecipes = (likedIds) => {
  localStorage.setItem('liked_recipes', JSON.stringify(likedIds));
};
