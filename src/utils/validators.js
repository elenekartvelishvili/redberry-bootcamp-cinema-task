export const validateEmail = (value) => {
  if (!value.trim()) return 'Email is required';
  if (!/^\S+@\S+\.\S+$/.test(value)) return 'Please enter a valid email';
  return '';
};

export const validatePassword = (value) => {
  if (!value) return 'Password is required';
  if (value.length < 3) return 'Password must be at least 3 characters';
  return '';
};