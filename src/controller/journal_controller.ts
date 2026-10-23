import { VirtualJournal } from "../ts/journal.js";

let instance: VirtualJournal | null = null;

export function init(): void {
    if (instance) return;

    instance = new VirtualJournal();
}

export function destroy(): void {
    instance?.destroy();
    instance = null;
}