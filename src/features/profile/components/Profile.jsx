import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser, selectIsAuthenticated } from '../../auth/authSlice';
import { selectLikedRecipeIds, selectRecipes } from '../../recipes/recipesSlice';
import RecipeCard from '../../recipes/components/RecipeCard';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import '../styles/Profile.css';

function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const likedIds = useSelector(selectLikedRecipeIds);
  const allRecipes = useSelector(selectRecipes);

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) return null;

  const likedRecipes = allRecipes.filter((r) => likedIds.includes(r.id));

  return (
    <div className="profile-page">
      
      <div className="profile-card">

        <div className="profile-card-top">
          <Avatar
            sx={{
              width: 100,
              height: 100,
              fontSize: 42,
              fontWeight: 800,
              background: 'linear-gradient(135deg, #f56040, #e1306c)',
            }}
          >
            {(user.username || 'U').charAt(0).toUpperCase()}
          </Avatar>
          <div className="profile-stats">
            <div className="profile-stat">
              <span className="profile-stat-value">{likedIds.length}</span>
              <span className="profile-stat-label">Liked</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-value">{allRecipes.length}</span>
              <span className="profile-stat-label">Recipes</span>
            </div>
          </div>
        </div>

        <div className="profile-details">
          <h2 className="profile-name">{user.name || user.username}</h2>
          <p className="profile-username">@{user.username}</p>
          <div className="profile-meta">
            {user.email && <span className="profile-meta-item">✉️ {user.email}</span>}
            {user.age && <span className="profile-meta-item">🎂 {user.age} years old</span>}
            {user.gender && <span className="profile-meta-item">👤 {user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}</span>}
          </div>
        </div>

       
      </div>

      <div className="profile-liked-section">
        <h3 className="profile-section-title">❤️ Liked Recipes ({likedRecipes.length})</h3>
        {likedRecipes.length > 0 ? (
          <div className="profile-recipe-grid">
            {likedRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="profile-empty">
            <p>You haven&apos;t liked any recipes yet.</p>
            <Button variant="contained" onClick={() => navigate('/dashboard')}>
              Discover Recipes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
