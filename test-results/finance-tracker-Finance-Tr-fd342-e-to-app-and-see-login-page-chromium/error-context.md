# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: finance-tracker.spec.js >> Finance Tracker E2E Tests - 2 Cycles >> Cycle 1 >> C1.1 - Navigate to app and see login page
- Location: e2e\finance-tracker.spec.js:21:11

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Login')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Login')

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | const BASE_URL = 'http://localhost:5173/finance-tracker';
  4   | const testUsers = [
  5   |   { name: 'Test User Cycle 1', email: `user1_${Date.now()}@example.com`, password: 'Test123!' },
  6   |   { name: 'Test User Cycle 2', email: `user2_${Date.now()}@example.com`, password: 'Test123!' }
  7   | ];
  8   | 
  9   | test.describe('Finance Tracker E2E Tests - 2 Cycles', () => {
  10  | 
  11  |   testUsers.forEach((user, cycleIndex) => {
  12  |     const cycle = cycleIndex + 1;
  13  | 
  14  |     test.describe(`Cycle ${cycle}`, () => {
  15  |       let page;
  16  | 
  17  |       test.beforeAll(async ({ browser }) => {
  18  |         page = await browser.newPage();
  19  |       });
  20  | 
  21  |       test(`C${cycle}.1 - Navigate to app and see login page`, async ({ browser }) => {
  22  |         const page = await browser.newPage();
  23  |         await page.goto(BASE_URL);
  24  | 
  25  |         // Should see login form
> 26  |         await expect(page.locator('text=Login')).toBeVisible({ timeout: 5000 });
      |                                                  ^ Error: expect(locator).toBeVisible() failed
  27  |         await expect(page.locator('text=Sign Up')).toBeVisible();
  28  | 
  29  |         console.log(`✅ [Cycle ${cycle}] Login page loaded`);
  30  |         await page.close();
  31  |       });
  32  | 
  33  |       test(`C${cycle}.2 - Sign up new user`, async ({ browser }) => {
  34  |         const page = await browser.newPage();
  35  |         await page.goto(BASE_URL);
  36  | 
  37  |         // Click Sign Up button
  38  |         await page.click('text=Sign Up');
  39  |         await page.waitForTimeout(500);
  40  | 
  41  |         // Fill signup form
  42  |         await page.fill('input[placeholder*="Full Name"]', user.name);
  43  |         await page.fill('input[type="email"]', user.email);
  44  |         await page.fill('input[type="password"]', user.password);
  45  | 
  46  |         // Find and fill confirm password
  47  |         const passwordInputs = await page.locator('input[type="password"]').all();
  48  |         if (passwordInputs.length > 1) {
  49  |           await passwordInputs[1].fill(user.password);
  50  |         }
  51  | 
  52  |         // Submit form
  53  |         await page.click('button:has-text("Create Account")');
  54  | 
  55  |         // Should redirect to dashboard
  56  |         await page.waitForURL('**/dashboard', { timeout: 5000 });
  57  |         await expect(page.locator('text=Welcome Back')).toBeVisible({ timeout: 5000 });
  58  | 
  59  |         console.log(`✅ [Cycle ${cycle}] User signed up: ${user.email}`);
  60  |         await page.close();
  61  |       });
  62  | 
  63  |       test(`C${cycle}.3 - Dashboard displays correctly`, async ({ browser }) => {
  64  |         const page = await browser.newPage();
  65  |         await page.goto(`${BASE_URL}/#/dashboard`);
  66  | 
  67  |         // Wait for page to load
  68  |         await page.waitForTimeout(2000);
  69  | 
  70  |         // Check for key dashboard elements
  71  |         await expect(page.locator('text=Welcome Back')).toBeVisible({ timeout: 5000 });
  72  |         await expect(page.locator('text=Total Income')).toBeVisible();
  73  |         await expect(page.locator('text=Total Expenses')).toBeVisible();
  74  |         await expect(page.locator('text=Net Savings')).toBeVisible();
  75  | 
  76  |         console.log(`✅ [Cycle ${cycle}] Dashboard loaded with stat cards`);
  77  |         await page.close();
  78  |       });
  79  | 
  80  |       test(`C${cycle}.4 - Add income transaction`, async ({ browser }) => {
  81  |         const page = await browser.newPage();
  82  |         await page.goto(`${BASE_URL}/#/transactions`);
  83  | 
  84  |         // Wait for transactions page
  85  |         await page.waitForTimeout(1500);
  86  | 
  87  |         // Click Add Income button
  88  |         await page.click('button:has-text("Add Income")');
  89  |         await page.waitForTimeout(500);
  90  | 
  91  |         // Fill income form
  92  |         const amountInput = page.locator('input[placeholder*="0"]').first();
  93  |         await amountInput.fill('50000');
  94  | 
  95  |         await page.selectOption('select', 'Salary');
  96  |         await page.fill('input[placeholder*="description"], textarea', 'Monthly Salary');
  97  | 
  98  |         // Submit
  99  |         await page.click('button:has-text("Add")');
  100 | 
  101 |         // Wait for transaction to appear
  102 |         await page.waitForTimeout(1000);
  103 | 
  104 |         // Check if transaction appears in list
  105 |         const hasIncome = await page.locator('text=50000').isVisible({ timeout: 5000 });
  106 |         expect(hasIncome).toBeTruthy();
  107 | 
  108 |         console.log(`✅ [Cycle ${cycle}] Income transaction added: ₹50000`);
  109 |         await page.close();
  110 |       });
  111 | 
  112 |       test(`C${cycle}.5 - Add expense transaction`, async ({ browser }) => {
  113 |         const page = await browser.newPage();
  114 |         await page.goto(`${BASE_URL}/#/transactions`);
  115 | 
  116 |         await page.waitForTimeout(1500);
  117 | 
  118 |         // Click Add Expense button
  119 |         await page.click('button:has-text("Add Expense")');
  120 |         await page.waitForTimeout(500);
  121 | 
  122 |         // Fill expense form
  123 |         const amountInput = page.locator('input[placeholder*="0"]').first();
  124 |         await amountInput.fill('5000');
  125 | 
  126 |         await page.selectOption('select', 'Food');
```