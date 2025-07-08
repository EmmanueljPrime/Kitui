import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        userId: Number(localStorage.getItem('userId')) || null,
        username: '',
        token: localStorage.getItem('token') || '',
    }),
    actions: {
        setUser(userId: number,username: string, token: string) {
            this.userId = userId;
            this.username = username;
            this.token = token;
            localStorage.setItem('userId', userId.toString());
            localStorage.setItem('token', token);
        },
        clearUser() {
            this.userId = null;
            this.username = '';
            this.token = '';
            localStorage.removeItem('userId');
            localStorage.removeItem('token');
        },
    },
});