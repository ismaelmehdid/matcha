export const messageMap: Record<string, string> = {
  'ERROR_USER_NOT_FOUND': 'User not found',
  'ERROR_INVALID_CREDENTIALS': 'Invalid credentials',
  'ERROR_INVALID_PASSWORD': 'Password is not strong enough',
  'ERROR_INTERNAL_SERVER': 'An unexpected internal server error occurred please try again later',

  'DEFAULT_SUCCESS_MESSAGE': 'Operation successful',
  'DEFAULT_ERROR_MESSAGE': 'An unexpected error occurred please try again later',
}

export const getMessage = (key: string | undefined, type: 'success' | 'error') => {
  if (key && messageMap[key]) {
    return messageMap[key];
  }
  return type === 'success' ? messageMap.DEFAULT_SUCCESS_MESSAGE : messageMap.DEFAULT_ERROR_MESSAGE;
}