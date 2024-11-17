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
import { conversationService } from '../database/conversationService';

class AuthService {
    async createAccount(email, password) {
        try {
            // Create Firebase user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            // Create user in our database
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
                // If database creation fails, delete the Firebase user
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
            console.error('Auth error:', error);
            let errorMessage = 'Failed to create account';

            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'An account already exists with this email';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email address format';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Password should be at least 6 characters';
                    break;
                default:
                    errorMessage = error.message;
            }

            return {
                success: false,
                error: errorMessage
            };
        }
    }

    async signIn(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            // Update last login in our database
            const response = await fetch(`${API_URL}/users/firebase/${firebaseUser.uid}/login`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Database sync error:', errorData);
            }

            return {
                success: true,
                user: firebaseUser
            };

        } catch (error) {
            console.error('Sign in error:', error);
            let errorMessage = 'Failed to sign in';

            switch (error.code) {
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email address format';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'This account has been disabled';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'No account found with this email';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Invalid password';
                    break;
                case 'auth/invalid-credential':
                    errorMessage = 'Invalid email or password';
                    break;
                default:
                    errorMessage = error.message;
            }

            return {
                success: false,
                error: errorMessage
            };
        }
    }
    async forgotPassword(email) {
        try {
            await sendPasswordResetEmail(auth, email);
            return {
                success: true,
                message: 'Password reset email sent'
            };
        } catch (error) {
            let errorMessage = 'Failed to send reset email';

            switch (error.code) {
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email address format';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'No account found with this email';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Too many requests. Please try again later';
                    break;
                default:
                    errorMessage = error.message;
            }

            return {
                success: false,
                error: errorMessage
            };
        }
    }

    async signOut() {
        try {
            const currentUser = auth.currentUser;
            if (currentUser) {
                // Get active conversations for the user
                const response = await fetch(
                    `${API_URL}/users/firebase/${currentUser.uid}/active-conversations`
                );

                if (response.ok) {
                    const { conversations } = await response.json();

                    // Complete all active conversations
                    await Promise.all(conversations.map(async (conv) => {
                        try {
                            const summaryResult = await conversationService.generateConversationSummary(
                                conv.conversation_ID
                            );

                            if (summaryResult.success) {
                                await conversationService.updateConversationStatus(
                                    conv.conversation_ID,
                                    'completed',
                                    summaryResult.summary
                                );
                            }
                        } catch (error) {
                            console.error(`Error completing conversation ${conv.conversation_ID}:`, error);
                        }
                    }));
                }

                await userService.updateLastLogin(currentUser.uid);
            }
            return auth.signOut();
        } catch (error) {
            console.error('Error during sign out:', error);
            throw error;
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
                console.error('Reauthentication error:', error);

                switch (error.code) {
                    case 'auth/wrong-password':
                        return {
                            success: false,
                            error: 'Current password is incorrect'
                        };
                    case 'auth/too-many-requests':
                        return {
                            success: false,
                            error: 'Too many attempts. Please try again later'
                        };
                    default:
                        return {
                            success: false,
                            error: 'Failed to authenticate. Please try again'
                        };
                }
            }

            try {
                await updatePassword(user, newPassword);
                return {
                    success: true,
                    message: 'Password updated successfully'
                };
            } catch (error) {
                console.error('Password update error:', error);

                switch (error.code) {
                    case 'auth/weak-password':
                        return {
                            success: false,
                            error: 'Password is too weak. Please choose a stronger password'
                        };
                    case 'auth/requires-recent-login':
                        return {
                            success: false,
                            error: 'Please log in again before changing your password'
                        };
                    default:
                        return {
                            success: false,
                            error: 'Failed to update password. Please try again'
                        };
                }
            }
        } catch (error) {
            console.error('Reset password error:', error);
            return {
                success: false,
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

            // re-authenticate the user
            const credential = EmailAuthProvider.credential(
                user.email,
                currentPassword
            );

            try {
                await reauthenticateWithCredential(user, credential);
            } catch (error) {
                console.error('Reauthentication error:', error);
                return {
                    success: false,
                    error: 'Current password is incorrect'
                };
            }

            // delete MySQL data first
            const response = await fetch(`${API_URL}/users/firebase/${user.uid}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete user data from database');
            }

            await deleteUser(user); // delete Firebase account once MySQL data is deleted

            return {
                success: true,
                message: 'Account successfully deleted'
            };

        } catch (error) {
            console.error('Delete account error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default new AuthService();
