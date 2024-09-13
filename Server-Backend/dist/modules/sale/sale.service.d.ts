declare const _default: {
    createSale: (amount: number, userId: number) => Promise<any>;
    listSales: () => Promise<false | {
        user: {
            id: number;
            name: string;
            email: string;
            password: string;
            role: string;
            createdAt: Date;
            targetAmount: number;
        };
        sale: {
            date: Date;
            amount: number;
        }[];
    }[]>;
};
export default _default;
