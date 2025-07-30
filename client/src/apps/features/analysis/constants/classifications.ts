import { Classification } from "shared/constants/Classification";

import iconClassificationsBrilliant from "@assets/img/classifications/brilliant.png";
import iconClassificationsCritical from "@assets/img/classifications/critical.png";
import iconClassificationsBest from "@assets/img/classifications/best.png";
import iconClassificationsExcellent from "@assets/img/classifications/excellent.png";
import iconClassificationsOkay from "@assets/img/classifications/okay.png";
import iconClassificationsInaccuracy from "@assets/img/classifications/inaccuracy.png";
import iconClassificationsMistake from "@assets/img/classifications/mistake.png";
import iconClassificationsBlunder from "@assets/img/classifications/blunder.png";
import iconClassificationsForced from "@assets/img/classifications/forced.png";
import iconClassificationsTheory from "@assets/img/classifications/theory.png";
import iconClassificationsRisky from "@assets/img/classifications/risky.png";

import iconClassificationsLoading from "@assets/img/classifications/loading.png";
import iconClassificationsError from "@assets/img/classifications/error.png";

export const classificationImages = {
    [Classification.BRILLIANT]: iconClassificationsBrilliant,
    [Classification.CRITICAL]: iconClassificationsCritical,
    [Classification.BEST]: iconClassificationsBest,
    [Classification.EXCELLENT]: iconClassificationsExcellent,
    [Classification.OKAY]: iconClassificationsOkay,
    [Classification.INACCURACY]: iconClassificationsInaccuracy,
    [Classification.MISTAKE]: iconClassificationsMistake,
    [Classification.BLUNDER]: iconClassificationsBlunder,
    [Classification.FORCED]: iconClassificationsForced,
    [Classification.THEORY]: iconClassificationsTheory,
    [Classification.RISKY]: iconClassificationsRisky
};

export const loadingClassificationIcon = iconClassificationsLoading;

export const errorClassificationIcon = iconClassificationsError;

export const classificationColours = {
    [Classification.BRILLIANT]: "#1baaa6",
    [Classification.CRITICAL]: "#5b8baf",
    [Classification.BEST]: "#98bc49",
    [Classification.EXCELLENT]: "#98bc49",
    [Classification.OKAY]: "#97af8b",
    [Classification.INACCURACY]: "#f4bf44",
    [Classification.MISTAKE]: "#e28c28",
    [Classification.BLUNDER]: "#c93230",
    [Classification.FORCED]: "#97af8b",
    [Classification.THEORY]: "#a88764",
    [Classification.RISKY]: "#8983ac"
};

export const classificationNames = {
    [Classification.BRILLIANT]: "classifications.brilliant",
    [Classification.CRITICAL]: "classifications.critical",
    [Classification.BEST]: "classifications.best",
    [Classification.EXCELLENT]: "classifications.excellent",
    [Classification.OKAY]: "classifications.okay",
    [Classification.INACCURACY]: "classifications.inaccuracy",
    [Classification.MISTAKE]: "classifications.mistake",
    [Classification.BLUNDER]: "classifications.blunder",
    [Classification.FORCED]: "classifications.forced",
    [Classification.THEORY]: "classifications.theory",
    [Classification.RISKY]: "classifications.risky"
};

export const inalterableClassifications = [
    Classification.BRILLIANT,
    Classification.CRITICAL,
    Classification.BEST,
    Classification.FORCED,
    Classification.THEORY
];