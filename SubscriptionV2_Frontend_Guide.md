# Subscription V2 API Documentation

## 1. Get Available Plans
**Endpoint:** `GET /api/subscription/v2/plans`  
**Description:** Fetches all available subscription plans and trial settings.

**Request:** None

**Response:**
```json
{
  "succeeded": true,
  "message": "Plans retrieved successfully.",
  "data": {
    "plans": [
      {
        "productId": "prod_Rv...",
        "name": "Rewoz Plus",
        "description": "Retain & Reward",
        "priceId": "price_1Q...",
        "amount": 29.99,
        "currency": "aud",
        "recurringInterval": "month",
        "isActive": false,
        "isTrial": true,
        "allowTrial": true,
        "trailDays": 30,
        "features": [
            { "key": "feature_1", "value": "{\"title\": \"...\", \"description\": \"...\", \"icon\": \"gift\"}" }
        ]
      }
    ]
  }
}
```

---

## 2. Check Subscription Status
**Endpoint:** `GET /api/subscription/v2/status`  
**Description:** Checks if the logged-in user has an active or trialing subscription.

**Request:** None

**Response:**
```json
{
  "succeeded": true,
  "message": "Status retrieved.",
  "data": {
    "isSubscription": true,
    "status": "trialing",       // "incomplete", "active", "trialing", "canceled", "past_due"
    "endsAt": null,
    "trialEndsAt": "2026-03-13T13:15:18",
    "subscriptionId": "sub_1SzVmGP..."
  }
}
```

---

## 3. Create Payment Link (Start Subscription)
**Endpoint:** `POST /api/subscription/v2/create-payment-link`  
**Description:** Generates a Stripe Checkout URL for the selected plan.

**Request:**
```json
{
  "stripePriceId": "price_1Q..."
}
```

**Response:**
```json
{
  "succeeded": true,
  "message": "Payment link generated successfully.",
  "data": "https://buy.stripe.com/test_..."
}
```
*Action: Redirect user to this URL.*

---

## 4. Cancel Subscription
**Endpoint:** `POST /api/subscription/v2/cancel`  
**Description:** Cancels the current active subscription at the end of the billing period.

**Request:** None

**Response:**
```json
{
  "message": "Subscription cancellation parity scheduled."
}
```

---

## 5. Get Subscription History
**Endpoint:** `GET /api/subscription/v2/history`  
**Description:** Returns a list of all subscription records (past and present).

**Request:** None

**Response:**
```json
{
  "succeeded": true,
  "message": "Subscription history retrieved.",
  "data": [
    {
      "id": 1,
      "stripeSubscriptionId": "sub_...",
      "stripePriceId": "price_...",
      "status": "Canceled",           // 3=Trialing, 4=Active, 7=Canceled
      "startedAt": "2026-02-01T10:00:00Z",
      "endsAt": null,
      "canceledAt": null
    }
  ]
}
```

---

## 6. Get Payment History (Invoices)
**Endpoint:** `GET /api/subscription/v2/payments`  
**Optional Filter:** `GET /api/subscription/v2/payments/{subscriptionId}`  
**Description:** Returns a list of payment invoices.

**Request:** None

**Response:**
```json
{
  "succeeded": true,
  "message": "Payment history retrieved.",
  "data": [
    {
      "id": 101,
      "paymentMethod": "card",
      "subscriptionId": "sub_1Sz...",
      "invoiceId": "in_1Sz...",
      "amountPaid": 29.99,
      "currency": "AUD",
      "status": "succeeded",
      "paidAt": "2026-02-11T14:30:00Z",
      "businessId": 55
    }
  ]
}
```

---

## 7. Frontend Integration: Payment History

### Location & UX Rationale
We chose to place the **Payment History** section **below the available subscription plans**.

**Why?**
1.  **Current Focus**: Users primarily visit the subscription page to check their *current status* or *upgrade/change plans*. This information should remain at the top for immediate access.
2.  **Secondary Information**: Historical data (past invoices) is important for record-keeping but less frequently accessed than current plan status or upgrade options.
3.  **Visual Hierarchy**: Placing a data-heavy table at the bottom avoids cluttering the main decision-making area which is focused on plan cards and pricing.

### UI Component Structure
The Payment History section features:
-   **Header**: Clear title with icon ("Payment History") for context.
-   **Table Layout**: A clean, responsive table showing:
    -   **Invoice ID**: Truncated or full ID.
    -   **Date**: Formatted date string.
    -   **Amount**: Currency formatted amount.
    -   **Method**: Payment method icon and name.
    -   **Status**: Color-coded badge for quick status recognition (Succeeded, Pending, Failed).
-   **State Management**: Data is fetched via `fetchPaymentHistory` Redux action on page load and stored in `state.subscription.paymentHistory`.
