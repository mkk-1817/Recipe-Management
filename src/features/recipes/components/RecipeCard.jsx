import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleLike, selectIsLiked } from '../recipesSlice';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import './styles/RecipeCard.css';

function RecipeCard({ recipe }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLiked = useSelector(selectIsLiked(recipe.id));

  const handleLike = (e) => {
    e.stopPropagation();
    dispatch(toggleLike(recipe.id));
  };

  const handleViewDetails = () => {
    navigate(`/recipe/${recipe.id}`);
  };

  return (
    <Card className="recipe-card">
      <CardActionArea onClick={handleViewDetails}>
        <CardMedia
          component="img"
          height={200}
          image={recipe.image}
          alt={recipe.name}
        />
        <CardContent>
          <div className="recipe-card-header">
            <h3 className="recipe-card-title">{recipe.name}</h3>
            <IconButton
              size="small"
              onClick={handleLike}
              aria-label={isLiked ? 'Unlike' : 'Like'}
              sx={{ color: isLiked ? 'error.main' : 'text.secondary' }}
            >
              {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </div>

          <div className="recipe-card-tags">
            {recipe.tags?.slice(0, 3).map((tag) => (
              <Chip key={tag} label={tag} size="small" className="recipe-tag" />
            ))}
          </div>

          <div className="recipe-card-meta">
            <span>⏱ {recipe.prepTimeMinutes + recipe.cookTimeMinutes} min</span>
            <span>🍽 {recipe.servings} servings</span>
            {recipe.difficulty && (
              <span className={`difficulty difficulty-${recipe.difficulty.toLowerCase()}`}>
                {recipe.difficulty}
              </span>
            )}
          </div>

          <div className="recipe-card-rating">
            <span>{'⭐'.repeat(Math.round(recipe.rating))}</span>
            <span className="review-count">({recipe.reviewCount})</span>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default RecipeCard;
