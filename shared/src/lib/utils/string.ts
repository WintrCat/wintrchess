import { range, sample, times } from "lodash-es";

const alphanumericPool = [
    ...range(48, 58),
    ...range(65, 91),
    ...range(97, 123)
].map(code => String.fromCharCode(code));

export function randomNormalString(length: number, underscores = true) {
    const pool = underscores
        ? alphanumericPool.concat(["_"])
        : alphanumericPool;

    return times(length, () => sample(pool)).join("");
}