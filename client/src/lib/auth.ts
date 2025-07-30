import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

import { additionalUserFields } from "shared/constants/account/schemas";

const authClient = createAuthClient({
    basePath: "/auth/account",
    plugins: [inferAdditionalFields({
        user: additionalUserFields
    })]
});

export default authClient;