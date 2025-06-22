export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateLottie = (data: any): ValidationResult => {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Invalid Lottie data'] };
  }

  if (!data.v) errors.push('Missing version property');
  if (typeof data.fr !== 'number') errors.push('Invalid frame rate');
  if (typeof data.w !== 'number') errors.push('Invalid width');
  if (typeof data.h !== 'number') errors.push('Invalid height');
  if (!Array.isArray(data.layers)) errors.push('Invalid layers array');

  if (data.layers) {
    data.layers.forEach((layer: any, index: number) => {
      if (typeof layer.ty !== 'number') {
        errors.push(`Layer ${index}: Invalid type`);
      }
      if (typeof layer.ip !== 'number') {
        errors.push(`Layer ${index}: Invalid in point`);
      }
      if (typeof layer.op !== 'number') {
        errors.push(`Layer ${index}: Invalid out point`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
