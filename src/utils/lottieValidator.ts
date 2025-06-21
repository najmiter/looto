export function validateLottie(lottieJson: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (typeof lottieJson !== 'object' || lottieJson === null) {
    errors.push('Lottie JSON must be a valid object.');
    return { isValid: false, errors };
  }

  if (!Array.isArray(lottieJson.layers)) {
    errors.push("Lottie JSON must contain a 'layers' array.");
  }

  if (typeof lottieJson.v !== 'string') {
    errors.push("Lottie JSON must have a 'v' property of type string.");
  }

  if (typeof lottieJson.fr !== 'number') {
    errors.push("Lottie JSON must have a 'fr' property of type number.");
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  return { isValid: true, errors: [] };
}
