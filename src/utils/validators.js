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
export const validateUsername = (value) => {
  if (!value.trim()) return 'Username is required';
  if (value.trim().length < 3) return 'Username must be at least 3 characters';
  return '';
};

export const validateConfirmPassword = (value, password) => {
  if (!value) return 'Please confirm your password';
  if (value !== password) return 'Passwords do not match';
  return '';
};

export const validateFullName=(value)=> {

const name=value.trim();
if(!name) return 'Name is required';
if(name.length<3) return 'Name must be at least 3 characters';
if(name.length>50) return 'Name must not exceed 50 characters';
return '';

};


export const validateMobile=(value)=> {
const digits=value.replaceAll(' ','');
if(!digits) return 'Mobile number is required';
if(!/^\d+$/.test(digits))
   {

    return 'Please enter a valid Georgian mobile number (9 digits starting with 5)';
}

 if (!digits.startsWith('5')) return 'Georgian mobile numbers must start with 5';
 if (digits.length !== 9) return 'Mobile number must be exactly 9 digits';
  return '';

}


const getAge=(dateString)=> {

 const birth = new Date(dateString);
 const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const hadBirthdayThisYear =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
  if (!hadBirthdayThisYear) age -= 1;
  return age;

};

export const validateDateOfBirth = (value) => {
  if (!value) return 'Date of birth is required';
  if (new Date(value) > new Date()) return 'Please enter a valid date of birth';
  if (getAge(value) < 12) return 'You must be at least 12 years old to create an account';
  return '';
};