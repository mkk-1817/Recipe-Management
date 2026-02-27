import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  loginUser,
  clearError,
  selectAuthLoading,
  selectAuthError,
  selectIsAuthenticated,
} from '../authSlice';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import '../styles/Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => { dispatch(clearError()); };
  }, [dispatch]);

  const validate = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = 'Username is required';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 3) newErrors.password = 'Password must be at least 3 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(loginUser({ username: username.trim(), password }));
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <span className="login-brand-icon">🍳</span>
          <h1 className="login-brand-title">RecipeGram</h1>
          <p className="login-brand-subtitle">Share & discover amazing recipes</p>
        </div>

        {authError && <Alert severity="error" sx={{ mb: 2 }}>{authError}</Alert>}

        <form onSubmit={handleLogin} className="login-form">
          <TextField
            label="Username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            error={!!errors.username}
            helperText={errors.username}
            fullWidth
            margin="normal"
            size="small"
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            error={!!errors.password}
            helperText={errors.password}
            fullWidth
            margin="normal"
            size="small"
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign In'}
          </Button>
        </form>

        <div className="login-divider"><span>OR</span></div>

        <p className="login-footer">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="login-link">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

