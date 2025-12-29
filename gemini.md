# Project Review & Improvement Plan

## Codebase Review Findings

1.  **Data Persistence**: 
    - **Current State**: The application uses in-memory storage (`let inMemoryCodes = [...]`) in `codeService.ts`.
    - **Issue**: All data added via the Admin Page is lost when the page is refreshed.
    - **Recommendation**: Switch to `localStorage` for persistence so that admin updates are saved across browser sessions.

2.  **Auto-Discovery / Automation**:
    - **Current State**: The "Auto-Discovery Engine" in `AdminPage` and `codeService` is a simulation (mock logs). It does not actually fetch data.
    - **Issue**: The user requested "latest redeem code from twitter" and "latest news".
    - **Recommendation**: Due to CORS policies and API restrictions (Twitter/YouTube APIs require authenticated backends), a purely client-side "auto-fetch" is difficult to implement reliably. 
    - **Solution**: We will enhance the **Admin Page** to allow the admin to manually input "News" and "Redeem Codes" efficiently. This gives the Admin full control to input what they find on Twitter/YouTube.

3.  **News Page**:
    - **Current State**: The `NewsPage.tsx` contains hardcoded static data.
    - **Issue**: New news cannot be added.
    - **Recommendation**: Create a `newsService.ts` backed by `localStorage` and update `NewsPage` to fetch from it. Update `AdminPage` to allow adding/deleting news.

4.  **Admin Page**:
    - **Current State**: Only supports adding Codes.
    - **Recommendation**: Add a "Manage News" section.

## Implementation Plan

### Step 1: Core Definitions
- Update `types.ts` to include `NewsItem` interface.

### Step 2: Service Layer
- Update `codeService.ts` to use `localStorage` for `LootCode`s.
- Create `newsService.ts` to handle `NewsItem`s with `localStorage`.

### Step 3: Admin Page Upgrade
- Add a Tabbed interface: "Redeem Codes" vs "News".
- Implement "Add News" form (Title, Date, Category, Description).

### Step 4: News Page Upgrade
- Fetch data from `newsService` instead of having hardcoded arrays.

### Step 5: Verification
- Verify that codes and news added via Admin Page appear on Home and News pages respectively.
- Verify persistence after reload.

## Future Recommendations (For "Real" Automation)
To truly automate fetching from Twitter/YouTube, you would need a **Backend Server** (Node.js/Python) with:
- Twitter API Key (Standard/Pro Access).
- YouTube Data API Key.
- A scheduled job (Cron) to run every hour.
Since this is currently a frontend-only setup, the "Manual Entry" via Admin Page is the best reliable solution.
