import { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../auth/authSlice';
import {
  fetchRecipes,
  searchRecipes,
  fetchTags,
  setSearchQuery,
  setSelectedTag,
  selectRecipes,
  selectRecipesLoading,
  selectRecipesError,
  selectSearchQuery,
  selectSelectedTag,
  selectTags,
  selectLikedRecipeIds,
} from '../../recipes/recipesSlice';
import RecipeCard from '../../recipes/components/RecipeCard';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import '../styles/Dashboard.css';

function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const recipes = useSelector(selectRecipes);
  const loading = useSelector(selectRecipesLoading);
  const error = useSelector(selectRecipesError);
  const searchQuery = useSelector(selectSearchQuery);
  const selectedTag = useSelector(selectSelectedTag);
  const tags = useSelector(selectTags);
  const likedIds = useSelector(selectLikedRecipeIds);
  const [showLikedOnly, setShowLikedOnly] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Fetch recipes and tags on mount
  useEffect(() => {
    dispatch(fetchRecipes());
    dispatch(fetchTags());
  }, [dispatch]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchQuery) {
        dispatch(setSearchQuery(localSearch));
        if (localSearch.trim()) {
          dispatch(searchRecipes(localSearch.trim()));
        } else {
          dispatch(fetchRecipes());
        }
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [localSearch, searchQuery, dispatch]);

  const handleTagChange = useCallback(
    (tag) => {
      dispatch(setSelectedTag(tag));
      if (tag) {
        dispatch(searchRecipes(tag));
      } else {
        dispatch(fetchRecipes());
      }
    },
    [dispatch]
  );

  // Filter recipes by tag and liked
  const filteredRecipes = useMemo(() => {
    let result = recipes;
    if (selectedTag) {
      result = result.filter(
        (r) =>
          r.tags?.some((t) => t.toLowerCase() === selectedTag.toLowerCase()) ||
          r.cuisine?.toLowerCase() === selectedTag.toLowerCase()
      );
    }
    if (showLikedOnly) {
      result = result.filter((r) => likedIds.includes(r.id));
    }
    return result;
  }, [recipes, selectedTag, showLikedOnly, likedIds]);

  return (
    <div className="dashboard">
      {/* Welcome Banner */}
      <div className="dashboard-banner">
        <h1 className="dashboard-greeting">
          Welcome back, <span>{user?.name || user?.username || 'Chef'}</span>! 👨‍🍳
        </h1>
        <p className="dashboard-subtitle">What are you cooking today?</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="dashboard-toolbar">
        <TextField
          placeholder="Search recipes..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          size="small"
          sx={{ flex: 1, minWidth: 220 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: localSearch ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => { setLocalSearch(''); dispatch(setSearchQuery('')); dispatch(fetchRecipes()); }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
            },
          }}
        />
        <div className="filter-bar">
          <TextField
            select
            value={selectedTag}
            onChange={(e) => handleTagChange(e.target.value)}
            size="small"
            sx={{ minWidth: 150 }}
            label="Category"
          >
            <MenuItem value="">All Categories</MenuItem>
            {tags.map((tag) => (
              <MenuItem key={tag} value={tag}>{tag}</MenuItem>
            ))}
          </TextField>
          <Button
            variant={showLikedOnly ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setShowLikedOnly(!showLikedOnly)}
          >
            {showLikedOnly ? '❤️ Liked' : '🤍 Show Liked'}
          </Button>
        </div>
      </div>

      {/* Recipe Count */}
      <div className="dashboard-meta">
        <span className="recipe-count">
          {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} found
        </span>
        {likedIds.length > 0 && (
          <span className="liked-count">❤️ {likedIds.length} liked</span>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="dashboard-loading">
          <CircularProgress />
          <p>Loading delicious recipes...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="dashboard-error">
          <p>😞 {error}</p>
          <Button variant="contained" onClick={() => dispatch(fetchRecipes())}>
            Retry
          </Button>
        </div>
      )}

      {/* Recipe Grid */}
      {!loading && !error && (
        <div className="recipe-grid">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredRecipes.length === 0 && (
        <div className="dashboard-empty">
          <span className="empty-icon">🍽</span>
          <h3>No recipes found</h3>
          <p>Try adjusting your search or filters</p>
          <Button
            variant="outlined"
            onClick={() => {
              setLocalSearch('');
              dispatch(setSearchQuery(''));
              dispatch(setSelectedTag(''));
              setShowLikedOnly(false);
              dispatch(fetchRecipes());
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;