import { get, post } from '../../../api/axiosInstance';

export const fetchRecipes = async (limit = 30, skip = 0) => {
  return get(`?limit=${limit}&skip=${skip}`);
};

export const fetchRecipeById = async (id) => {
  return get(`/${id}`);
};

export const searchRecipes = async (query) => {
  return get(`/search?q=${encodeURIComponent(query)}`);
};

export const fetchRecipesByTag = async (tag) => {
  return get(`/tag/${encodeURIComponent(tag)}`);
};

export const fetchTags = async () => {
  return get('/tags');
};

export const addRecipe = async (recipeData) => {
  return post('/add', recipeData);
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
