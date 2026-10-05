const STORAGE_KEY = 'recently-viewed';
const MAX_ITEMS = 6;

export const getRecentlyViewed = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

export const addRecentlyViewed = (movie) => {
  const item = {
    id: movie.id,
    slug: movie.slug,
    title: movie.title,
    backdropUrl: movie.backdropUrl,
    runtimeMinutes: movie.runtimeMinutes,
    genre: movie.genres[0]?.name || '',
    ageCode: movie.ageRating.code,
  };

  const others = getRecentlyViewed().filter((saved) => saved.id !== movie.id);
  const next = [item, ...others].slice(0, MAX_ITEMS);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
};