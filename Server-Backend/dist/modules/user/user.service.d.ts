declare const _default: {
    getUserByEmail: (email: string) => Promise<any>;
    createUser: (name: string, email: string, targetAmount: number, password: string, role: string) => Promise<any>;
    listUsers: () => Promise<any>;
    updateUser: (email: string, newName: string, targetAmount: number, role: string) => Promise<any>;
    deleteUser: (email: string) => Promise<any>;
};
export default _default;
