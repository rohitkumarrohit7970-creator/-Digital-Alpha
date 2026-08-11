# Assumptions

During the development of this full-stack assignment, the following assumptions were made to interpret the dataset and business logic requirements:

### 1. Data Interpretation & Seeding
- **Initial Coin Balance**: The total coin balance is generated during the initial database seed. It aggregates the 10,000 transactions and assigns a mathematically logical starting balance for the user, rather than hardcoding an arbitrary number.
- **Null Categories**: Any transaction in the JSON dataset with a `null` or missing category was assigned an "Uncategorized" label rather than being dropped, to ensure accurate total spending analytics.
- **Negative Transactions**: Negative amounts (if any exist or occur in the future) are treated as refunds and are mathematically subtracted from total spending metrics.
- **Pending/Failed Payments**: Pending and failed payments do not contribute to the user's "Reward Coins" calculation or "Total Spending". Only `SUCCESS` transactions yield coins.
- **Timestamp Normalization**: The dataset contained timestamps in multiple formats (e.g. ISO 8601 strings vs Unix millisecond integers, and some missing times completely like `2025-07-03`). The seed script assumes UTC timezone and normalizes everything into a strict PostgreSQL `TIMESTAMP WITH TIME ZONE` format.

### 2. Business Logic
- **Demo User Strategy**: Since authentication was out of scope, a fixed user ID (`USER_001`) is hardcoded in the backend. All redemptions and balance checks act on this specific user row.
- **Reward Cap**: There is no hard cap on how many times a user can redeem a reward, provided they have sufficient coin balance.

### 3. API & Data Serving
- **Pagination Strategy**: The frontend is assumed to operate under standard dashboard conditions, where serving 25 rows per page via offset/limit is highly performant. If the dataset scaled to millions of rows, cursor-based pagination would replace the current offset pagination.
