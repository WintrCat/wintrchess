import { GameAnalysis } from "shared/types/game/GameAnalysis";

interface AccuraciesCardProps {
    accuracies: {
        white: number;
        black: number;
    };
    estimatedRatings?: GameAnalysis["estimatedRatings"];
}

export default AccuraciesCardProps;