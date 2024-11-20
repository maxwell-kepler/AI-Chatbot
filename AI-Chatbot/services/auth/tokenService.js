// services/auth/tokenService.js
import { auth } from '../../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';

const TOKEN_EXPIRY_TIME = 15 * 60 * 1000; // 15 minute for testing
const WARNING_TIME = 5 * 60 * 1000; // Warn 60 seconds before expiry
const LAST_ACTIVITY_KEY = 'lastActivityTimestamp';
const TOKEN_KEY = 'authToken';

class TokenService {
    constructor() {
        this.warningTimeout = null;
        this.expiryTimeout = null;
        this.lastActivityTime = Date.now();
        this.warningShown = false;
        this.isLoginPage = false;
    }

    setIsLoginPage(value) {
        this.isLoginPage = value;
        if (value) {
            this.clearTimers();
        }
    }

    clearTimers() {
        console.log('Clearing all timers');
        if (this.warningTimeout) {
            clearTimeout(this.warningTimeout);
            this.warningTimeout = null;
        }
        if (this.expiryTimeout) {
            clearTimeout(this.expiryTimeout);
            this.expiryTimeout = null;
        }

        if (Platform.OS === 'ios') {
            Alert.alert('', '', [], { cancelable: true });
        }
        this.warningShown = false;
    }

    startExpiryTimer() {
        if (this.isLoginPage) {
            console.log('Skipping timer on login page');
            return;
        }

        const now = Date.now();
        const timeSinceLastActivity = now - this.lastActivityTime;

        console.log(`Starting new expiry timer. Time since last activity: ${timeSinceLastActivity / 1000}s`);

        this.clearTimers();

        this.warningTimeout = setTimeout(() => {
            if (!this.warningShown && !this.isLoginPage &&
                (Date.now() - this.lastActivityTime) >= (TOKEN_EXPIRY_TIME - WARNING_TIME)) {
                this.showExpiryWarning();
            }
        }, Math.max(0, TOKEN_EXPIRY_TIME - WARNING_TIME - timeSinceLastActivity));

        this.expiryTimeout = setTimeout(async () => {
            if (!this.isLoginPage &&
                (Date.now() - this.lastActivityTime) >= TOKEN_EXPIRY_TIME) {
                await this.forceLogout();
            }
        }, Math.max(0, TOKEN_EXPIRY_TIME - timeSinceLastActivity));

        console.log(`Next warning in: ${(TOKEN_EXPIRY_TIME - WARNING_TIME - timeSinceLastActivity) / 1000}s`);
        console.log(`Next expiry in: ${(TOKEN_EXPIRY_TIME - timeSinceLastActivity) / 1000}s`);
    }

    async updateLastActivity() {
        try {
            const now = Date.now();
            this.lastActivityTime = now;
            this.warningShown = false;
            await AsyncStorage.setItem(LAST_ACTIVITY_KEY, now.toString());

            this.startExpiryTimer();

            console.log(`Activity updated at: ${new Date(now).toLocaleTimeString()}`);
            console.log(`Session extended for ${TOKEN_EXPIRY_TIME / 1000} seconds`);
        } catch (error) {
            console.error('Error updating last activity:', error);
        }
    }


    showExpiryWarning() {
        if (this.isLoginPage || this.warningShown) return;

        this.warningShown = true;
        console.log('Showing expiry warning');

        Alert.alert(
            'Session Expiring',
            'Your session will expire in 60 seconds. Would you like to stay logged in?',
            [
                {
                    text: 'Stay Logged In',
                    onPress: async () => {
                        console.log('User chose to stay logged in');
                        await this.updateLastActivity();
                    },
                },
                {
                    text: 'Logout',
                    style: 'cancel',
                    onPress: async () => {
                        console.log('User chose immediate logout');
                        await this.forceLogout();
                    },
                },
            ],
            { cancelable: false }
        );
    }

    async forceLogout() {
        console.log('Forcing immediate logout');
        this.clearTimers(); // clear everything first
        await this.clearToken();
        await auth.signOut(); // immediate signout
    }

    async clearToken() {
        try {
            this.lastActivityTime = null;
            this.warningShown = false;
            await AsyncStorage.multiRemove([TOKEN_KEY, LAST_ACTIVITY_KEY]);
        } catch (error) {
            console.error('Error clearing token:', error);
        }
    }


    async getToken() {
        try {
            const tokenData = await AsyncStorage.getItem(TOKEN_KEY);
            if (!tokenData) return null;

            const { value } = JSON.parse(tokenData);
            return value;
        } catch (error) {
            console.error('Error retrieving token:', error);
            return null;
        }
    }

    async setToken(token) {
        try {
            const tokenData = {
                value: token,
                timestamp: Date.now()
            };
            await AsyncStorage.setItem(TOKEN_KEY, JSON.stringify(tokenData));
            await this.updateLastActivity();
        } catch (error) {
            console.error('Error storing token:', error);
            throw error;
        }
    }

    async isTokenExpired() {
        try {
            const lastActivity = await this.getLastActivity();
            if (!lastActivity) return true;

            const timeSinceLastActivity = Date.now() - lastActivity;
            const isExpired = timeSinceLastActivity > TOKEN_EXPIRY_TIME;
            console.log(`Token status: ${isExpired ? 'expired' : 'valid'} (${timeSinceLastActivity / 1000}s since last activity)`);
            return isExpired;
        } catch (error) {
            console.error('Error checking token expiry:', error);
            return true;
        }
    }

    async refreshTokenIfNeeded() {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) return false;

            if (await this.isTokenExpired()) {
                const newToken = await currentUser.getIdToken(true);
                await this.setToken(newToken);
                return true;
            }

            await this.updateLastActivity();
            return false;
        } catch (error) {
            console.error('Error refreshing token:', error);
            return false;
        }
    }
}

const tokenService = new TokenService();
export default tokenService;