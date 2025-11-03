interface UserType {
    email: string;
    token: string;
}

interface AuthStore {
    getUser(): UserType | null 
    saveUser(user: UserType): void
    removeUser(): void
}

const AuthStore = (): AuthStore => {
    const getUser = () => {
        const user = localStorage.getItem('user')
        return user ? JSON.parse(user) : null
    }

    const saveUser = (user: UserType) => {
        localStorage.setItem('user', JSON.stringify(user))
    }

    const removeUser = () => {
        localStorage.removeItem('user')
    }

    return {
        getUser,
        saveUser,
        removeUser
    }
}

export {AuthStore}
export type {UserType}