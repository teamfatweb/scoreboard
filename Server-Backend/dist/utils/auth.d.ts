declare const _default: {
    generateAccessToken: (email: string) => string;
    hashPassword: (password: string) => Promise<string>;
    validatePassword: (password: string, hashedPassword: string) => Promise<boolean>;
};
export default _default;
