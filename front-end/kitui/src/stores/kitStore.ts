import { defineStore } from 'pinia';

export const useKitStore = defineStore('kit', {
    state: () => ({
        currentKit: null as null | {
            id: number;
            name: string;
            config: any;
        }
    }),
    actions: {
        setKit(kit: { id: number; name: string; config: any }) {
            this.currentKit = kit;
        },
        clearKit() {
            this.currentKit = null;
        }
    }
});