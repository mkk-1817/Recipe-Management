import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, clearError, selectAuthLoading, selectAuthError } from '../authSlice';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import '../styles/Register.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    age: '',
    gender: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);

  useEffect(() => {
    return () => { dispatch(clearError()); };
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.username.trim()) errs.username = 'Username is required';
    else if (formData.username.trim().length < 3) errs.username = 'Min 3 characters';
    if (!formData.email.trim()) errs.email = 'Email is required';
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.age || Number(formData.age) < 1) errs.age = 'Valid age is required';
    if (!formData.gender) errs.gender = 'Please select a gender';
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 4) errs.password = 'Min 4 characters';
    if (formData.password !== formData.confirmPassword)
      errs.confirmPassword = 'Passwords do not match';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await dispatch(
      registerUser({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        name: formData.name.trim(),
        age: formData.age,
        gender: formData.gender,
      })
    );

    if (!result.error) {
      navigate('/login');
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-brand">
          <span className="register-brand-icon">🍳</span>
          <h1 className="register-brand-title">RecipeGram</h1>
          <p className="register-brand-subtitle">
            Sign up to discover and share delicious recipes
          </p>
        </div>

        {authError && <Alert severity="error" sx={{ mb: 2 }}>{authError}</Alert>}

        <form onSubmit={handleRegister} className="register-form">
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Pick a username"
            error={!!fieldErrors.username}
            helperText={fieldErrors.username}
            fullWidth
            required
            margin="dense"
            size="small"
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your email address"
            error={!!fieldErrors.email}
            helperText={fieldErrors.email}
            fullWidth 
            required
            margin="dense"
            size="small"
          />
          <TextField
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your full name"
            error={!!fieldErrors.name}
            helperText={fieldErrors.name}
            fullWidth
            required
            margin="dense"
            size="small"
          />
          <div className="register-row">
            <TextField
              label="Age"
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Age"
              error={!!fieldErrors.age}
              helperText={fieldErrors.age}
              fullWidth
              required
              margin="dense"
              size="small"
            />
            <TextField
              select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              error={!!fieldErrors.gender}
              helperText={fieldErrors.gender}
              fullWidth
              required
              margin="dense"
              size="small"
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
          </div>
          <TextField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            error={!!fieldErrors.password}
            helperText={fieldErrors.password}
            fullWidth
            required
            margin="dense"
            size="small"
          />
          <TextField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            error={!!fieldErrors.confirmPassword}
            helperText={fieldErrors.confirmPassword}
            fullWidth
            required
            margin="dense"
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
            {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign Up'}
          </Button>
        </form>

        <div className="register-divider"><span>OR</span></div>

        <p className="register-footer">
          Already have an account?{' '}
          <Link to="/login" className="register-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;