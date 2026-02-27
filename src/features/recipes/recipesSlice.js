import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as recipeService from './services/recipeService';

export const fetchRecipes = createAsyncThunk(
  'recipes/fetchRecipes',
  async ({ limit, skip = 0 } = {}, { rejectWithValue }) => {
    try {
      const data = await recipeService.fetchRecipes(limit, skip);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recipes');
    }
  }
);

export const fetchRecipeById = createAsyncThunk(
  'recipes/fetchRecipeById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await recipeService.fetchRecipeById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recipe');
    }
  }
);

export const searchRecipes = createAsyncThunk(
  'recipes/searchRecipes',
  async (query, { rejectWithValue }) => {
    try {
      const data = await recipeService.searchRecipes(query);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Search failed');
    }
  }
);

export const fetchTags = createAsyncThunk(
  'recipes/fetchTags',
  async (_, { rejectWithValue }) => {
    try {
      const data = await recipeService.fetchTags();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tags');
    }
  }
);

export const addNewRecipe = createAsyncThunk(
  'recipes/addNewRecipe',
  async (recipeData, { rejectWithValue }) => {
    try {
      const data = await recipeService.addRecipe(recipeData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add recipe');
    }
  }
);


const likedFromStorage = recipeService.getLikedRecipes();

const initialState = {
  recipes: [],
  total: 0,
  currentRecipe: null,
  likedRecipeIds: likedFromStorage,
  tags: [],
  searchQuery: '',
  selectedTag: '',
  selectedLimit: 10,
  skip: 0,
  loading: false,
  detailLoading: false,
  error: null,
};


const recipesSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    toggleLike: (state, action) => {
      const recipeId = action.payload;
      const index = state.likedRecipeIds.indexOf(recipeId);
      if (index === -1) {
        state.likedRecipeIds.push(recipeId);
      } else {
        state.likedRecipeIds.splice(index, 1);
      }
      recipeService.saveLikedRecipes(state.likedRecipeIds);
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.skip = 0;
    },
    setSelectedTag: (state, action) => {
      state.selectedTag = action.payload;
      state.skip = 0;
    },
    setSelectedLimit: (state, action) => {
      state.selectedLimit = action.payload;
      state.skip = 0;
    },
    setSkip: (state, action) => {
      state.skip = action.payload;
    },
    clearCurrentRecipe: (state) => {
      state.currentRecipe = null;
    },
    clearRecipeError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes = action.payload.recipes;
        state.total = action.payload.total;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRecipeById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchRecipeById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentRecipe = action.payload;
      })
      .addCase(fetchRecipeById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      })
      .addCase(searchRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes = action.payload.recipes;
        state.total = action.payload.total;
      })
      .addCase(searchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.tags = action.payload;
      })
      .addCase(addNewRecipe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewRecipe.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes.unshift(action.payload);
      })
      .addCase(addNewRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export const {
  toggleLike,
  setSearchQuery,
  setSelectedTag,
  setSelectedLimit,
  setSkip,
  clearCurrentRecipe,
  clearRecipeError,
} = recipesSlice.actions;

export const selectRecipes = (state) => state.recipes.recipes;
export const selectTotal = (state) => state.recipes.total;
export const selectCurrentRecipe = (state) => state.recipes.currentRecipe;
export const selectLikedRecipeIds = (state) => state.recipes.likedRecipeIds;
export const selectTags = (state) => state.recipes.tags;
export const selectSearchQuery = (state) => state.recipes.searchQuery;
export const selectSelectedTag = (state) => state.recipes.selectedTag;
export const selectSelectedLimit = (state) => state.recipes.selectedLimit;
export const selectSkip = (state) => state.recipes.skip;
export const selectRecipesLoading = (state) => state.recipes.loading;
export const selectDetailLoading = (state) => state.recipes.detailLoading;
export const selectRecipesError = (state) => state.recipes.error;

export const selectIsLiked = (recipeId) => (state) =>
  state.recipes.likedRecipeIds.includes(recipeId);

export const selectLikedRecipes = (state) =>
  state.recipes.recipes.filter((r) => state.recipes.likedRecipeIds.includes(r.id));

export default recipesSlice.reducer;
