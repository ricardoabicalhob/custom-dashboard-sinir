export interface User {
    name :string
    email :string
    token: string
}

export interface AuthToken {
    sub :string
    role :number
    exp :number
}