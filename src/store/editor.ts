import { atomWithStorage } from "jotai/utils";

export const editorAtom = atomWithStorage<any[]>("editor", []);
