import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface Subscription {
    priceId: string;
    name: string;
    amount: number;
    isActive: boolean;
    features: string[];
}

interface SubscriptionState {
    subscriptionList: Subscription[];
    anyActivePlan: boolean;
    isLoading: boolean;
    doesUserCancelled: boolean;
    subscriptionEndsOn: string | null;
    error: string | null;
}

const initialState: SubscriptionState = {
    subscriptionList: [
        {
            priceId: 'price_1',
            name: 'Partner Pro Plan',
            amount: 29.99,
            isActive: false,
            features: [
                'Advanced Analytics Dashboard',
                'Priority Partner Support',
                'Unlimited Transaction History',
                'Exclusive Marketing Assets',
                'Early Access to New Features'
            ]
        },
        {
            priceId: 'price_2',
            name: 'Partner Lite',
            amount: 0,
            isActive: true,
            features: [
                'Basic Analytics',
                'Email Support',
                '30 Days Transaction History',
                'Standard Marketing Kit'
            ]
        }
    ],
    anyActivePlan: true,
    isLoading: false,
    doesUserCancelled: false,
    subscriptionEndsOn: null,
    error: null,
};

// Mock fetchSubscription
export const fetchSubscription = createAsyncThunk(
    'subscription/fetch',
    async (_, { rejectWithValue }) => {
        try {
            // Simulated API call delay
            await new Promise((resolve) => setTimeout(resolve, 800));
            return initialState.subscriptionList;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

const subscriptionSlice = createSlice({
    name: 'subscription',
    initialState,
    reducers: {
        cancelSubscription: (state) => {
            state.doesUserCancelled = true;
            state.subscriptionEndsOn = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        },
        setSubscriptions: (state, action: PayloadAction<Subscription[]>) => {
            state.subscriptionList = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchSubscription.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchSubscription.fulfilled, (state, action) => {
            state.isLoading = false;
            state.subscriptionList = action.payload;
        });
        builder.addCase(fetchSubscription.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });
    }
});

export const { cancelSubscription, setSubscriptions } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
