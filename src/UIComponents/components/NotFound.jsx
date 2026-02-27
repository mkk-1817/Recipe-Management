import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import '../styles/NotFound.css';

function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <span className="not-found-emoji">🍳</span>
        <h1 className="not-found-title">404</h1>
        <h2>Recipe Not Found!</h2>
        <p>
          Oops! Looks like this recipe got burned. The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button
          component={Link}
          to="/dashboard"
          variant="contained"
          size="large"
        >
          🏠 Back to Kitchen
        </Button>
      </div>
    </div>
  );
}

export default NotFound;
