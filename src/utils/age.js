export const isTooYoung = (user, minAge) =>
  user !== null && user.age !== null && minAge >= 16 && user.age < minAge;