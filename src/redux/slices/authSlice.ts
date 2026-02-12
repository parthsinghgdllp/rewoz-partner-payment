import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axiosInstance';

interface AuthState {
    user: any | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null,
    isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('accessToken') : false,
    loading: false,
    error: null,
};

export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: { emailOrMobile: string; password: string; remember: boolean }, { rejectWithValue }) => {
        try {
            const body = {
                ...credentials,
                role: 'BusinessUser',
            };

            // Prepend +61 if it's a mobile number starting with 4
            const phoneRegex = /^4\d{0,8}$/;
            if (phoneRegex.test(body.emailOrMobile)) {
                body.emailOrMobile = '+61' + body.emailOrMobile;
            }

            const response = await axiosInstance.post('Auth/login', body);
            const { data, succeeded, message } = response.data;

            if (!succeeded) {
                return rejectWithValue(message);
            }

            if (typeof window !== 'undefined') {
                localStorage.setItem('accessToken', data.token);
                localStorage.setItem('user', JSON.stringify(data));
            }

            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
        }
    }
);

export const validateToken = createAsyncThunk(
    'auth/validateToken',
    async (token: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('Auth/validateToken', { token, remember: true });
            const { data, succeeded, message } = response.data;

            if (!succeeded) {
                return rejectWithValue(message);
            }

            if (typeof window !== 'undefined') {
                localStorage.setItem('accessToken', data.token);
                localStorage.setItem('user', JSON.stringify(data));
            }

            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Token validation failed');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            if (typeof window !== 'undefined') {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
            }
        },
        clearError: (state) => {
            state.error = null;
        },
        setToken: (state, action: PayloadAction<string>) => {
            if (typeof window !== 'undefined') {
                localStorage.setItem('accessToken', action.payload);
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(validateToken.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(validateToken.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(validateToken.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.error = action.payload;
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('user');
                }
            });
    },
});

export const { logout, clearError, setToken } = authSlice.actions;
export default authSlice.reducer;
