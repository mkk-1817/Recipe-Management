import { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../auth/authSlice';
import {
  fetchRecipes,
  searchRecipes,
  fetchTags,
  setSearchQuery,
  setSelectedTag,
  setSelectedLimit,
  setSkip,
  selectRecipes,
  selectRecipesLoading,
  selectRecipesError,
  selectSearchQuery,
  selectSelectedTag,
  selectSelectedLimit,
  selectSkip,
  selectTotal,
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
  const selectedLimit = useSelector(selectSelectedLimit);
  const skip = useSelector(selectSkip);
  const total = useSelector(selectTotal);
  const [showLikedOnly, setShowLikedOnly] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Fetch recipes and tags on mount
  useEffect(() => {
    dispatch(fetchRecipes({ limit: selectedLimit || 0, skip: 0 }));
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
          dispatch(fetchRecipes({ limit: selectedLimit || 0, skip: 0 }));
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
        dispatch(fetchRecipes({ limit: selectedLimit || 0, skip: 0 }));
      }
    },
    [dispatch, selectedLimit]
  );

  const handleLimitChange = useCallback(
    (value) => {
      dispatch(setSelectedLimit(value));
      dispatch(fetchRecipes({ limit: value || 0, skip: 0 }));
    },
    [dispatch]
  );

  const handleNextPage = useCallback(() => {
    const newSkip = skip + selectedLimit;
    dispatch(setSkip(newSkip));
    dispatch(fetchRecipes({ limit: selectedLimit, skip: newSkip }));
  }, [dispatch, skip, selectedLimit]);

  const handlePrevPage = useCallback(() => {
    const newSkip = Math.max(0, skip - selectedLimit);
    dispatch(setSkip(newSkip));
    dispatch(fetchRecipes({ limit: selectedLimit, skip: newSkip }));
  }, [dispatch, skip, selectedLimit]);

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
      <div className="dashboard-banner">
        <h1 className="dashboard-greeting">
          Welcome, <span>{user?.name || user?.username || 'Chef'}</span>! 
        </h1>
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
                    onClick={() => { setLocalSearch(''); dispatch(setSearchQuery('')); dispatch(fetchRecipes({ limit: selectedLimit || 0, skip: 0 })); }}
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
          value={selectedLimit}
          onChange={(e) => handleLimitChange(e.target.value)}
          size="small"
          sx={{ minWidth: 150 }}
          label="Limit"
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
        </TextField>
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
            disabled={likedIds.length === 0}
          >
            
          <span sx={{ fontSize: '0.875rem', fontWeight: 500,color: '#e1306c' }}>❤️ {likedIds.length} liked</span>
          </Button>
        </div>
      </div>

      {/* Recipe Count */}
      <div className="dashboard-meta">
        <span className="recipe-count">
          {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} found
        </span>
        
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
          <Button variant="contained" onClick={() => dispatch(fetchRecipes({ limit: selectedLimit || 0, skip }))}>
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

      {/* Pagination */}
      {!loading && !error && selectedLimit && filteredRecipes.length > 0 && (
        <div className="pagination-controls">
          <Button
            variant="outlined"
            size="small"
            disabled={skip === 0}
            onClick={handlePrevPage}
          >
            Previous
          </Button>
          <span className="page-info">
            Page {Math.floor(skip / selectedLimit) + 1} of {Math.ceil(total / selectedLimit)}
          </span>
          <Button
            variant="outlined"
            size="small"
            disabled={skip + selectedLimit >= total}
            onClick={handleNextPage}
          >
            Next
          </Button>
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
              dispatch(setSelectedLimit(10));
              setShowLikedOnly(false);
              dispatch(fetchRecipes({ limit: 10, skip: 0 }));
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