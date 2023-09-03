export const setAccessToken = (accessToken: string): void => {
  localStorage.setItem('accessToken', accessToken);
};
export const setRefreshToken = (refreshToken: string): void => {
  localStorage.setItem('refreshToken', refreshToken);
};

export const setLS = (item: string, value: any): void =>
  localStorage.setItem(item, value);
export const getLS = (item: string): string => localStorage.getItem(item) || '';
export const clearLS = (): void => localStorage.clear();
