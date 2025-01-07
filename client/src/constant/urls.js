const baseUrl = 'https://easypg-react.onrender.com';

export const loginUrl = `${baseUrl}/auth/login`;
export const signupUrl = `${baseUrl}/auth/signup`;

export const mailVerifyUrl = `${baseUrl}/mail/verify-email`;
export const mailVerifyOwnerUrl = `${baseUrl}/mailOwner/verify-email-pgOwner`;
export const protectedUrl = `${baseUrl}/auth/protected`;
export const logoutUrl = `${baseUrl}/auth/logout`;

export const signupownerUrl = `${baseUrl}/auth/signupOwner`;
export const findMessUrl = `${baseUrl}/auth/findMess`;
export const loginOwnerUrl = `${baseUrl}/auth/loginOwner`;
export const updateDetailsUrl= `${baseUrl}/auth/updateDetails`;
export const fetchDetailsUrl = `${baseUrl}/auth/get-details`;
export const forgotPasswordUserUrl = `${baseUrl}/auth/user/forgot-password`;
export const resetPasswordUserUrl = `${baseUrl}/auth/user/reset-password`;
export const tokenVerifyUserUrl = `${baseUrl}/auth/LoginUser/user/reset-password/:resetToken`;


export const forgotPasswordOwnerUrl = `${baseUrl}/auth/owner/forgot-password`;
export const resetPasswordOwnerUrl = `${baseUrl}/auth/owner/reset-password`;
export const tokenVerifyOwnerUrl = `${baseUrl}/auth/LoginOwner/owner/reset-password/:resetToken`;
export const refreshTokenHandler = `${baseUrl}/auth/refresh-token`

export const baseurl =`${baseUrl}`;