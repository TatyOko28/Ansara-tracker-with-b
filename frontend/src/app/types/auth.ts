export type SigninDto = { email: string; password: string };
export type SignupDto = { name: string; email: string; password: string };
export type ResetPasswordDemandDto = { email: string };
export type ResetPasswordConfirmationDto = { email: string; password: string; code: string };
export type DeleteAccountDto = { password: string };

export type SigninResponse = { access_token: string };
