export const success = (data: unknown, message = 'Success') => ({
  success: true,
  message,
  data,
});

export const error = (message: string, code = 400) => ({
  success: false,
  message,
  error: code,
});
