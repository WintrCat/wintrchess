import LanguageOption from "@/types/LanguageOption";

import iconFlagsGb from "@assets/img/flags/GB.png";
import iconFlagsIn from "@assets/img/flags/IN.png";
import iconFlagsVn from "@assets/img/flags/VN.png";
import iconFlagsEs from "@assets/img/flags/ES.png";
import iconFlagsPt from "@assets/img/flags/PT.png";
import iconFlagsPl from "@assets/img/flags/PL.png";
import iconFlagsFr from "@assets/img/flags/FR.png";
import iconFlagsDe from "@assets/img/flags/DE.png";
import iconFlagsRu from "@assets/img/flags/RU.png";
import iconFlagsCn from "@assets/img/flags/CN.png";

const languages: LanguageOption[] = [
    {
        id: "en",
        label: "English",
        flag: iconFlagsGb
    },
    {
        id: "hi",
        label: "हिन्दी",
        flag: iconFlagsIn
    },
    {
        id: "mr",
        label: "मराठी",
        flag: iconFlagsIn
    },
    {
        id: "vi",
        label: "Tiếng Việt",
        flag: iconFlagsVn
    },
    {
        id: "es",
        label: "Español",
        flag: iconFlagsEs
    },
    // {
    //     id: "fil",
    //     label: "Filipino",
    //     flag: iconFlagsPh
    // },
    // {
    //     id: "ar",
    //     label: "العربية",
    //     flag: iconFlagsSa
    // },
    {
        id: "pt",
        label: "Português",
        flag: iconFlagsPt
    },
    {
        id: "pl",
        label: "Polski",
        flag: iconFlagsPl
    },
    // {
    //     id: "id",
    //     label: "Bahasa Indonesia",
    //     flag: iconFlagsId
    // },
    {
        id: "fr",
        label: "Français",
        flag: iconFlagsFr
    },
    {
        id: "de",
        label: "Deutsch",
        flag: iconFlagsDe
    },
    {
        id: "ru",
        label: "русский",
        flag: iconFlagsRu
    },
    {
        id: "zh",
        label: "中文",
        flag: iconFlagsCn
    }
];

export default languages;