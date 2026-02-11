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
            const response = await axiosInstance.get('Subscription/plans');
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
            const response = await axiosInstance.get('Subscription/status');
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
            const response = await axiosInstance.post('Subscription/cancel');
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
            .addCase(fetchSubscription.fulfilled, (state, action: PayloadAction<any[]>) => {
                const sortedPlans = action.payload.sort((a, b) => a.amount - b.amount);
                const activePlan = sortedPlans.find(p => p.isActive);
                const cancelledPlan = sortedPlans.find(p => p.isActive && p.subscriptionEndAt);

                const modifiedPlans = sortedPlans.map((plan) => ({
                    ...plan,
                    features: plan.features.map((feature: any) => ({
                        ...feature,
                        value: typeof feature.value === 'string' ? JSON.parse(feature.value) : feature.value
                    }))
                }));

                state.anyActivePlan = !!activePlan;
                state.subscriptionList = modifiedPlans;
                state.doesUserCancelled = !!cancelledPlan;
                state.subscriptionEndsOn = cancelledPlan?.subscriptionEndAt || null;
                state.isLoading = false;
            })
            .addCase(fetchSubscription.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(subscriptionStatus.fulfilled, (state, action: PayloadAction<any>) => {
                state.isSubscribed = !!action.payload?.data?.isSubscription;
            })
            .addCase(cancelSubscription.fulfilled, (state) => {
                state.isLoading = false;
            });
    }
});

export default subscriptionSlice.reducer;
