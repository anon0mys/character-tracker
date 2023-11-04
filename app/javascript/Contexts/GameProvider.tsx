import React, { useContext, createContext, useState } from "react";
import { IGameType } from "../Api";
import GameStore from "./GameStore";


interface GameContextType {
    game: IGameType | null
    setCurrentGame: (game: IGameType) => void
    clearCurrentGame: () => void
}

const GameContext = createContext<GameContextType>(null!);

const GameProvider = ({ children }: {children: React.ReactNode}) => {
    const storage = GameStore()
    const [game, setGame] = useState<IGameType | null>(storage.getCurrentGame())

    const setCurrentGame = (game: IGameType) => {
        storage.setCurrentGame(game)
        setGame(game)
    }

    const clearCurrentGame = () => {
        storage.removeCurrentGame()
        setGame(null)
    }

    const value = { game, setCurrentGame, clearCurrentGame }

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

const useGame = () => {
    return useContext(GameContext)
}

export { GameProvider, useGame }