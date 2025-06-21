export const handleError = (error: Error): void => {
  const errorMessage = error.message || 'An unknown error occurred.';
  console.error(errorMessage);
  alert(errorMessage);
};
