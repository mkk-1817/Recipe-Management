import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, selectUser, selectIsAuthenticated } from '../../auth/authSlice';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import '../styles/Navbar.css';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  // Don't show navbar on login/register pages
  if (!isAuthenticated) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #dbdbdb' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between',height: 64 }}>
        {/* Logo / Brand */}
        <Link to="/dashboard" className="navbar-brand">
          <span className="navbar-title">RecipeApp</span>
        </Link>
        {/* User Section */}
        <div className="navbar-user">
          <IconButton component={Link} to={`/profile/${user?.username || ''}`}>
            <Avatar
              sx={{
                width: 28,
                height: 28,
                fontSize: 14,
                bgcolor: '#e1306c',
                fontWeight: 600,
              }}
            >
              {(user?.username || 'U').charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          <span className="navbar-username">{user?.username || 'User'}</span>
          <IconButton onClick={handleLogout} size="small" title="Logout">
            <LogoutIcon fontSize="small" />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
