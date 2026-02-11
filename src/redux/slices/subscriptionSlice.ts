import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axiosInstance';

interface Feature {
    name: string;
    value: any;
}

interface Subscription {
    priceId: string;
    name: string;
    description: string;
    amount: number;
    isActive: boolean;
    features: Feature[];
    subscriptionEndAt?: string;
}

interface SubscriptionState {
    subscriptionList: Subscription[];
    anyActivePlan: boolean;
    isLoading: boolean;
    doesUserCancelled: boolean;
    subscriptionEndsOn: string | null;
    error: string | null;
    isSubscribed: boolean;
}

const initialState: SubscriptionState = {
    subscriptionList: [],
    anyActivePlan: false,
    isLoading: false,
    doesUserCancelled: false,
    subscriptionEndsOn: null,
    error: null,
    isSubscribed: false,
};

export const fetchSubscription = createAsyncThunk(
    'subscription/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('subscription/v2/plans');
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const subscriptionStatus = createAsyncThunk(
    'subscription/status',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('subscription/v2/status');
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const createPaymentLink = createAsyncThunk(
    'subscription/createPaymentLink',
    async (stripePriceId: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('subscription/v2/create-payment-link', { stripePriceId });
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const cancelSubscription = createAsyncThunk(
    'subscription/cancel',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('subscription/v2/cancel');
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

const subscriptionSlice = createSlice({
    name: 'subscription',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubscription.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchSubscription.fulfilled, (state, action: PayloadAction<any>) => {
                const plans = action.payload.data?.plans || [];
                const sortedPlans = [...plans].sort((a, b) => a.amount - b.amount);
                const activePlan = sortedPlans.find(p => p.isActive);

                const modifiedPlans = sortedPlans.map((plan) => ({
                    ...plan,
                    features: plan.features.map((feature: any) => ({
                        ...feature,
                        value: typeof feature.value === 'string' ? JSON.parse(feature.value) : feature.value
                    }))
                }));

                state.anyActivePlan = !!activePlan;
                state.subscriptionList = modifiedPlans;
                state.isLoading = false;
            })
            .addCase(fetchSubscription.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(subscriptionStatus.fulfilled, (state, action: PayloadAction<any>) => {
                const data = action.payload?.data;
                state.isSubscribed = !!data?.isSubscription;
                state.doesUserCancelled = data?.status === 'canceled';
                state.subscriptionEndsOn = data?.endsAt || null;
            })
            .addCase(cancelSubscription.fulfilled, (state) => {
                state.isLoading = false;
            });
    }
});

export default subscriptionSlice.reducer;
