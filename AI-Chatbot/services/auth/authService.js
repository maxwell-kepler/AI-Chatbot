// services/auth/authService.js
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword,
    deleteUser
} from 'firebase/auth';
import { auth } from '../../config/firebase';
import { userService } from '../database/userService';
import { API_URL } from "../../config/api.client";
import tokenService from './tokenService';

class AuthService {
    async createAccount(email, password) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            const response = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firebaseId: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: email.split('@')[0],
                    createAt: new Date().toISOString(),
                    lastLogin: new Date().toISOString()
                })
            });

            if (!response.ok) {
                await firebaseUser.delete();
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create user in database');
            }

            const userData = await response.json();

            return {
                success: true,
                user: firebaseUser,
                userData: userData.data
            };

        } catch (error) {
            console.log('Account creation attempt failed:', error.code);
            return {
                success: false,
                errorCode: error.code || 'auth/unknown',
                error: error.message
            };
        }
    }

    async signIn(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            const token = await firebaseUser.getIdToken();
            await tokenService.setToken(token);

            const response = await fetch(`${API_URL}/users/firebase/${firebaseUser.uid}/login`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log('Database sync warning:', errorData);
            }

            return {
                success: true,
                user: firebaseUser
            };
        } catch (error) {
            console.log('Sign in attempt failed:', error.code);
            return {
                success: false,
                errorCode: error.code || 'auth/unknown',
                error: error.message
            };
        }
    }

    async signOut() {
        try {
            const currentUser = auth.currentUser;
            if (currentUser) {
                tokenService.clearTimers();

                try {
                    const token = await tokenService.getToken();
                    const response = await fetch(
                        `${API_URL}/users/firebase/${currentUser.uid}/active-conversations`,
                        {
                            headers: {
                                Authorization: token ? `Bearer ${token}` : ''
                            }
                        }
                    );

                    if (response.ok) {
                        const { conversations } = await response.json();
                        console.log(`Found ${conversations.length} active conversations to complete`);

                        await Promise.all(conversations.map(async (conv) => {
                            console.log(`Completing conversation: ${conv.conversation_ID}`);

                            try {
                                const summaryResponse = await fetch(
                                    `${API_URL}/conversations/${conv.conversation_ID}/summary`,
                                    {
                                        method: 'GET',
                                        headers: {
                                            Authorization: token ? `Bearer ${token}` : ''
                                        }
                                    }
                                );

                                if (!summaryResponse.ok) {
                                    throw new Error('Failed to generate summary');
                                }

                                const updateResponse = await fetch(
                                    `${API_URL}/conversations/${conv.conversation_ID}/status`,
                                    {
                                        method: 'PUT',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            Authorization: token ? `Bearer ${token}` : ''
                                        },
                                        body: JSON.stringify({ status: 'completed' })
                                    }
                                );

                                if (!updateResponse.ok) {
                                    throw new Error('Failed to update conversation status');
                                }

                                console.log(`Successfully completed conversation: ${conv.conversation_ID}`);
                            } catch (error) {
                                console.error(`Error completing conversation ${conv.conversation_ID}:`, error);
                            }
                        }));
                    }
                } catch (error) {
                    console.error('Error handling active conversations during logout:', error);
                }
                await userService.updateLastLogin(currentUser.uid);
            }

            await tokenService.clearToken();
            await auth.signOut();
        } catch (error) {
            console.error('Error during sign out:', error);
            throw error;
        }
    }

    startTokenRefreshMonitor() {
        setInterval(async () => {
            try {
                const tokenRefreshed = await tokenService.refreshTokenIfNeeded();
                if (tokenRefreshed) {
                    console.log('Token refreshed due to expiry approaching');
                }
            } catch (error) {
                console.error('Error in token refresh monitor:', error);
            }
        }, 60 * 1000);
    }

    async forgotPassword(email) {
        try {
            await sendPasswordResetEmail(auth, email);
            return {
                success: true,
                message: 'Password reset email sent'
            };
        } catch (error) {
            console.log('Password reset attempt failed:', error.code);
            return {
                success: false,
                errorCode: error.code || 'auth/unknown',
                error: error.message
            };
        }
    }

    async resetPassword(currentPassword, newPassword) {
        try {
            const user = auth.currentUser;

            if (!user || !user.email) {
                return {
                    success: false,
                    error: 'No authenticated user found'
                };
            }

            const credential = EmailAuthProvider.credential(
                user.email,
                currentPassword
            );

            try {
                await reauthenticateWithCredential(user, credential);
            } catch (error) {
                console.log('Reauthentication attempt failed:', error.code);
                return {
                    success: false,
                    errorCode: error.code,
                    error: 'Current password is incorrect'
                };
            }

            try {
                await updatePassword(user, newPassword);
                return {
                    success: true,
                    message: 'Password updated successfully'
                };
            } catch (error) {
                console.log('Password update attempt failed:', error.code);
                return {
                    success: false,
                    errorCode: error.code,
                    error: 'Failed to update password'
                };
            }
        } catch (error) {
            console.log('Reset password process failed:', error.code);
            return {
                success: false,
                errorCode: error.code || 'auth/unknown',
                error: 'An unexpected error occurred'
            };
        }
    }

    async deleteAccount(currentPassword) {
        try {
            const user = auth.currentUser;
            if (!user || !user.email) {
                return {
                    success: false,
                    error: 'No authenticated user found'
                };
            }

            // Re-authenticate first
            const credential = EmailAuthProvider.credential(
                user.email,
                currentPassword
            );

            try {
                await reauthenticateWithCredential(user, credential);
            } catch (error) {
                console.log('Reauthentication for deletion failed:', error.code);
                return {
                    success: false,
                    errorCode: error.code,
                    error: 'Current password is incorrect'
                };
            }

            // Delete MySQL data first
            const response = await fetch(`${API_URL}/users/firebase/${user.uid}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete user data from database');
            }

            // If MySQL deletion was successful, delete Firebase account
            await deleteUser(user);

            return {
                success: true,
                message: 'Account successfully deleted'
            };

        } catch (error) {
            console.log('Account deletion process failed:', error);
            return {
                success: false,
                errorCode: error.code || 'auth/unknown',
                error: error.message
            };
        }
    }
}
const authService = new AuthService();
export default authService;
