export type User = {
    id: string;
    email: string;
    password: string;
    displayName: string;
    picture: string | null;
    role: string;
    isVerified: boolean;
    isTwoFactorEnabled: boolean;
    method: string;
    createdAt: Date;
    updatedAt: Date;
}