import React, { useContext, createContext, useState } from "react";
import { IGameType } from "../Api";


interface GameContextType {
    game: IGameType | null
    setCurrentGame: (game: IGameType) => void
}

const GameContext = createContext<GameContextType>(null!);

const GameProvider = ({ children }: {children: React.ReactNode}) => {
    const [game, setGame] = useState<IGameType | null>(null)

    const setCurrentGame = (game: IGameType) => {
        setGame(game)
    }

    const value = { game, setCurrentGame}

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

const useGame = () => {
    return useContext(GameContext)
}

export { GameProvider, useGame }