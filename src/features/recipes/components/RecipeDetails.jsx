import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchRecipeById,
  clearCurrentRecipe,
  toggleLike,
  selectCurrentRecipe,
  selectDetailLoading,
  selectRecipesError,
  selectIsLiked,
} from '../recipesSlice';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import './styles/RecipeDetails.css';

function RecipeDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const recipe = useSelector(selectCurrentRecipe);
  const loading = useSelector(selectDetailLoading);
  const error = useSelector(selectRecipesError);
  const isLiked = useSelector(selectIsLiked(Number(id)));

  useEffect(() => {
    dispatch(fetchRecipeById(id));
    return () => {
      dispatch(clearCurrentRecipe());
    };
  }, [dispatch, id]);

  const handleLike = () => {
    dispatch(toggleLike(Number(id)));
  };

  if (loading) {
    return (
      <div className="recipe-detail-loading">
        <CircularProgress />
        <p>Loading recipe...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recipe-detail-error">
        <p color='error'> {error}</p>
        <Button variant="contained" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  if (!recipe) return null;

  return (
    <div className="recipe-detail">
      {/* Hero Image */}
      <div className="recipe-detail-hero">
        <img src={recipe.image} alt={recipe.name} className="recipe-detail-image" />
        <div className="recipe-detail-hero-overlay">
          <IconButton
            onClick={() => navigate(-1)}
            sx={{ bgcolor: 'rgba(0,0,0,0.3)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' } }}
          >
            <ArrowBackIcon />
          </IconButton>
        </div>
      </div>

      {/* Content */}
      <div className="recipe-detail-content">
        {/* Title & Like */}
        <div className="recipe-detail-header">
          <h1 className="recipe-detail-title">{recipe.name}</h1>
          <IconButton
            onClick={handleLike}
            sx={{ color: isLiked ? 'error.main' : 'text.secondary' }}
          >
            {isLiked ? <FavoriteIcon fontSize="large" /> : <FavoriteBorderIcon fontSize="large" />}
          </IconButton>
        </div>

        {/* Tags */}
        <div className="recipe-detail-tags">
          {recipe.tags?.map((tag) => (
            <Chip key={tag} label={tag} size="small" className="recipe-tag" />
          ))}
          {recipe.mealType?.map((type) => (
            <Chip key={type} label={type} size="small" color="primary" variant="outlined" />
          ))}
        </div>

        {/* Stats */}
        <div className="recipe-detail-stats">
          <div className="stat-item">
            <span className="stat-label">Prep</span>
            <span className="stat-value">{recipe.prepTimeMinutes} min</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Cook</span>
            <span className="stat-value">{recipe.cookTimeMinutes} min</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Servings</span>
            <span className="stat-value">{recipe.servings}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Calories</span>
            <span className="stat-value">{recipe.caloriesPerServing}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Rating</span>
            <span className="stat-value">{recipe.rating} ({recipe.reviewCount})</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Difficulty</span>
            <span className="stat-value">{recipe.difficulty}</span>
          </div>
        </div>

        {/* Cuisine */}
        <div className="recipe-detail-cuisine">
          <strong>Cuisine:</strong> {recipe.cuisine}
        </div>

        {/* Ingredients */}
        <div className="recipe-detail-section">
          <h2 className="section-title">Ingredients</h2>
          <p>{recipe.ingredients?.join(', ')}</p>
        </div>

        {/* Instructions */}
        <div className="recipe-detail-section">
          <h2 className="section-title">Instructions</h2>
          <ol className="instructions-list">
            {recipe.instructions?.map((step, index) => (
              <li key={index} className="instruction-step">
                <span className="step-number">{index + 1}</span>
                <p className="step-text">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetails;
