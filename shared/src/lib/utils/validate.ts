import { ZodType } from "zod";

/**
 * @description Validates data against a Zod schema, returning the first
 * error message string, or `undefined` if the validation was successful.
 */
export function validate(input: any, schema: ZodType) {
    const parse = schema.safeParse(input);
    if (parse.success) return;

    return parse.error.issues.at(0)?.message;
}