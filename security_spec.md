# Security Specification - Jersey Valley

## Data Invariants
1. A user can only read their own profile and order history.
2. Orders must have a valid `userId` matching the authenticated user.
3. Products are read-only for customers, writeable only by admins.
4. User rank and points can only be updated by the system/admin, not by the user themselves.
5. All IDs must be strictly validated.

## The Dirty Dozen Payloads (Rejection Targets)

1. **Identity Spoofing**: Creating an order with someone else's `userId`.
2. **Privilege Escalation**: User trying to set their own rank to "Legendary".
3. **Price Manipulation**: Updating a product's price from the client.
4. **Unauthorized Read**: User A trying to read Order B (belonging to User B).
5. **Orphaned Write**: Creating an order for a user that doesn't exist in `/users`.
6. **Integrity Breach**: Updating an order's status to "Delivered" without being an admin.
7. **Resource Poisoning**: Injecting a 2MB string into product description.
8. **Shadow Field**: Adding `isAdmin: true` to a user profile.
9. **Invalid ID**: Using `../../system` as a document ID.
10. **Time Spoofing**: Setting `createdAt` to a future date instead of server time.
11. **Negative Price**: Creating a product with price `-500`.
12. **System Bypass**: Reading PII of other users via blanket `list`.

## Test Runner (Mock Logic)
The `firestore.rules.test.ts` would verify that all the above payloads return `PERMISSION_DENIED`.
