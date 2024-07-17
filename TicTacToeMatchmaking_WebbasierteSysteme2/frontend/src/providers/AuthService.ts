export const getToken = () => {
    return localStorage.getItem('tictactoe_token');
};
  
export const setToken = (token: string) => {
    localStorage.setItem('tictactoe_token', token);
};
  
export const removeToken = () => {
    localStorage.removeItem('tictactoe_token');
};