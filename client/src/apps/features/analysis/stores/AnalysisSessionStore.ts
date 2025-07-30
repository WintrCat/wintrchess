import { create } from "zustand";

interface AnalysisSessionStore {
    analysisSessionToken?: string;
    analysisCaptchaError?: string;

    setAnalysisSessionToken: (token?: string) => void;
    setAnalysisCaptchaError: (error?: string) => void;
}

const useAnalysisSessionStore = create<AnalysisSessionStore>(set => ({
    setAnalysisSessionToken(token) {
        set({ analysisSessionToken: token });   
    },

    setAnalysisCaptchaError(error) {
        set({ analysisCaptchaError: error });
    }
}));

export default useAnalysisSessionStore;