import { IGameType } from "../Api";

interface GameStore {
    getCurrentGame(): IGameType | null
    setCurrentGame(game: IGameType): void
    removeCurrentGame(): void
}

const GameStore = (): GameStore => {
    const getCurrentGame = () => {
        const game = localStorage.getItem('currentGame')
        return game ? JSON.parse(game) : null
    }

    const setCurrentGame = (game: IGameType) => {
        localStorage.setItem('currentGame', JSON.stringify(game))
    }

    const removeCurrentGame = () => {
        localStorage.removeItem('currentGame')
    }

    return {
        getCurrentGame,
        setCurrentGame,
        removeCurrentGame
    }
}

export default GameStore