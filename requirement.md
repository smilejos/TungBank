# Role: Senior Angular Developer

**Task**: Create a simple, frontend-only Expense Tracker application using **Angular (Standalone Components)**. The backend is a Google Apps Script (GAS) Web App acting as a database API.

## 1. Technical Stack
- **Framework**: Angular (Latest version, Standalone API, Signals preferred for state management).
- **Styling**: Tailwind CSS (via CDN or standard setup) or Standard CSS with Flexbox/Grid.
- **HTTP**: Angular `HttpClient`.
- **Backend**: Google Apps Script (Web App).

## 2. Backend API Specification (Strict Adherence)
The backend is already deployed. You must follow this API contract strictly to avoid CORS and logic errors.

### Base URL
https://script.google.com/macros/s/AKfycbyYP_AfB_lzq8SMX_xn8AQKPR3SPC04zpFEbv1fWpH0yOklpW6qrygsB7bHYWQp-a9r/exec

### Data Model (`ExpenseRecord`)
- `id`: string (GUID)
- `date`: string (ISO date string, e.g., "2023-12-25")
- `item`: string (Name of the transaction)
- `amount`: number (Positive number)
- `category`: string
- `note`: string

### API Interaction Rules
1.  **CORS Handling**: All POST requests **must** set `Content-Type: text/plain;charset=utf-8` to avoid browser preflight (OPTIONS) requests which GAS does not support.
2.  **Structure**: All requests send a JSON string inside the body.

### Endpoints

#### A. GET (Fetch All Data)
- **Method**: `GET`
- **Params**: `?sheetName={UserSheetName}`
- **Response**: JSON Array of `ExpenseRecord`.

#### B. POST (Create, Update, Delete)
- **Method**: `POST`
- **Body Schema**:
  ```json
  {
    "sheetName": "Shawn",  // or "Ethan"
    "action": "create",    // options: "create", "update", "delete"
    "data": { ...ExpenseRecord object... }, // Required for create/update
    "id": "guid-string"    // Required for delete
  }


## 3. Frontend Feature Requirements
A. User Context (Sheet Switching)
Users: "Shawn" and "Ethan".

Functionality:

### A selector (dropdown or toggle) at the top to switch users.

Switching users updates the sheetName variable and re-fetches data from the API.

The UI must reflect the current user (e.g., "Shawn's Wallet").

### B. Dashboard Layout (Main View)
The layout should be split into two main sections (Responsive: Stack on mobile, Side-by-side on Desktop):

Left Panel: User Summary

Avatar: A simple placeholder image or initial icon for the current user.
Total Balance: Calculate the sum of the amount field from all records fetched for this user.
Logic: Assume the raw data's amount is signed (+/-) OR handle income/expense logic based on a type field.
Correction for this app: Let's assume the user enters positive numbers for Income and negative for Expense, OR adds a "Type" toggle. Requirement: Treat amount as the value. Add a UI logic to distinguish Income vs Expense (e.g., if category is 'Salary' or manually selected as Income). Simpler approach for this prompt: Add a type field ('income' | 'expense') to the form, but store it as positive/negative amount in the backend, or just use positive numbers and color code based on the amount value (Positive = Income, Negative = Expense).
Let's standardize: Store Expense as Negative numbers, Income as Positive numbers in the backend.
Right Panel: Recent Transactions
Display the latest 5 records only (sort by date descending).
List Item Design:
Date: Format YYYY-MM-DD.
Item & Note: Main text.
Amount:
Income (Positive): Display in Red (e.g., +$5,000).
Expense (Negative): Display in Green (e.g., -$150).
Edit Button: A pencil icon next to each record.

### C. Actions & Forms
#### 1. Add New Record (FAB)

Place a "Floating Action Button" (+) at the bottom right.
Opens a Modal/Dialog to add a record.
Fields: Date, Item, Amount, Category, Note.
Logic: Allow user to choose "Income" or "Expense". If Expense, convert amount to negative before sending to API.

#### 2. Edit / Delete Record

Clicking the "Edit" button on a list item opens the same Modal with pre-filled data.
Update: Modifies the record and calls API action: 'update'.
Delete: A "Delete" button inside the modal calls API action: 'delete'.

## 4. Implementation Steps (Output Request)
Please generate the following files:

app.config.ts: Setup provideHttpClient().
api.service.ts: The Angular Service handling the sheetName logic and doGet/doPost implementation strictly following the GAS contract.
app.component.ts: The main logic (state for current user, computed signals for balance/recent list).
app.component.html & app.component.css: The layout and styling.
transaction-dialog.component.ts: (Optional) Or implement a simple inline form/overlay for the Add/Edit logic.
Constraint: Keep the code clean, use Angular Signals (computed, signal) for reactivity, and ensure the color coding (Red for Income, Green for Expense) is implemented correctly.