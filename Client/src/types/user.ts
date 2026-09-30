export type User = {
    id: string;
    displayName: string;    
    email: string;
    token: string;
    imageUrl: string;
    roles: string[];
}

export type Logincreds = {
    email: string;
    password: string;
}   

export type LoginCreds = Logincreds;

export type Registercreds = {    
    email: string;
    displayName: string;
    password: string;
    gender: string;
    dateOfBirth: string;
    city: string;
    country: string;
}

export type RegisterCreds = Registercreds;