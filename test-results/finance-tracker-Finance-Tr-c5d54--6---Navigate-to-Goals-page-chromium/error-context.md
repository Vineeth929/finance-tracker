# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: finance-tracker.spec.js >> Finance Tracker E2E Tests - 2 Cycles >> Cycle 2 >> C2.6 - Navigate to Goals page
- Location: e2e\finance-tracker.spec.js:141:11

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Savings Goals')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Savings Goals')

```

# Test source

```ts
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
  127 |         await page.fill('input[placeholder*="description"], textarea', 'Groceries');
  128 | 
  129 |         // Submit
  130 |         await page.click('button:has-text("Add")');
  131 |         await page.waitForTimeout(1000);
  132 | 
  133 |         // Check if transaction appears
  134 |         const hasExpense = await page.locator('text=5000').isVisible({ timeout: 5000 });
  135 |         expect(hasExpense).toBeTruthy();
  136 | 
  137 |         console.log(`✅ [Cycle ${cycle}] Expense transaction added: ₹5000`);
  138 |         await page.close();
  139 |       });
  140 | 
  141 |       test(`C${cycle}.6 - Navigate to Goals page`, async ({ browser }) => {
  142 |         const page = await browser.newPage();
  143 |         await page.goto(`${BASE_URL}/#/goals`);
  144 | 
  145 |         await page.waitForTimeout(1500);
  146 | 
  147 |         // Should see Goals page
> 148 |         await expect(page.locator('text=Savings Goals')).toBeVisible({ timeout: 5000 });
      |                                                          ^ Error: expect(locator).toBeVisible() failed
  149 | 
  150 |         console.log(`✅ [Cycle ${cycle}] Goals page loaded`);
  151 |         await page.close();
  152 |       });
  153 | 
  154 |       test(`C${cycle}.7 - Create a saving goal`, async ({ browser }) => {
  155 |         const page = await browser.newPage();
  156 |         await page.goto(`${BASE_URL}/#/goals`);
  157 | 
  158 |         await page.waitForTimeout(1500);
  159 | 
  160 |         // Click + New Goal button
  161 |         await page.click('button:has-text("New Goal")');
  162 |         await page.waitForTimeout(500);
  163 | 
  164 |         // Fill goal form
  165 |         await page.fill('input[placeholder*="Goal Title"]', 'Emergency Fund');
  166 |         await page.fill('textarea[placeholder*="What is this goal"]', 'Save 6 months of expenses');
  167 |         await page.fill('input[placeholder*="₹0"]', '300000');
  168 | 
  169 |         // Submit
  170 |         await page.click('button:has-text("Create Goal")');
  171 |         await page.waitForTimeout(1500);
  172 | 
  173 |         // Check if goal appears
  174 |         const hasGoal = await page.locator('text=Emergency Fund').isVisible({ timeout: 5000 });
  175 |         expect(hasGoal).toBeTruthy();
  176 | 
  177 |         console.log(`✅ [Cycle ${cycle}] Goal created: Emergency Fund (₹300000)`);
  178 |         await page.close();
  179 |       });
  180 | 
  181 |       test(`C${cycle}.8 - View Markets page`, async ({ browser }) => {
  182 |         const page = await browser.newPage();
  183 |         await page.goto(`${BASE_URL}/#/markets`);
  184 | 
  185 |         await page.waitForTimeout(2000);
  186 | 
  187 |         // Should load market data
  188 |         try {
  189 |           await expect(page.locator('text=Bitcoin'), { timeout: 5000 }).toBeVisible();
  190 |           console.log(`✅ [Cycle ${cycle}] Markets page loaded with crypto data`);
  191 |         } catch (e) {
  192 |           console.log(`⚠️ [Cycle ${cycle}] Markets still loading (may be rate limited)`);
  193 |         }
  194 | 
  195 |         await page.close();
  196 |       });
  197 | 
  198 |       test(`C${cycle}.9 - View News page`, async ({ browser }) => {
  199 |         const page = await browser.newPage();
  200 |         await page.goto(`${BASE_URL}/#/news`);
  201 | 
  202 |         await page.waitForTimeout(2000);
  203 | 
  204 |         // Should see news sections
  205 |         try {
  206 |           await expect(page.locator('text=All')).toBeVisible({ timeout: 5000 });
  207 |           console.log(`✅ [Cycle ${cycle}] News page loaded`);
  208 |         } catch (e) {
  209 |           console.log(`⚠️ [Cycle ${cycle}] News page loading`);
  210 |         }
  211 | 
  212 |         await page.close();
  213 |       });
  214 | 
  215 |       test(`C${cycle}.10 - View Analytics page`, async ({ browser }) => {
  216 |         const page = await browser.newPage();
  217 |         await page.goto(`${BASE_URL}/#/analytics`);
  218 | 
  219 |         await page.waitForTimeout(1500);
  220 | 
  221 |         // Should see analytics chart
  222 |         await expect(page.locator('text=Analytics')).toBeVisible({ timeout: 5000 });
  223 | 
  224 |         console.log(`✅ [Cycle ${cycle}] Analytics page loaded`);
  225 |         await page.close();
  226 |       });
  227 | 
  228 |       test(`C${cycle}.11 - View Budget page`, async ({ browser }) => {
  229 |         const page = await browser.newPage();
  230 |         await page.goto(`${BASE_URL}/#/budget`);
  231 | 
  232 |         await page.waitForTimeout(1500);
  233 | 
  234 |         // Should see budget page
  235 |         await expect(page.locator('text=Budget')).toBeVisible({ timeout: 5000 });
  236 | 
  237 |         console.log(`✅ [Cycle ${cycle}] Budget page loaded`);
  238 |         await page.close();
  239 |       });
  240 | 
  241 |       test(`C${cycle}.12 - View Settings page`, async ({ browser }) => {
  242 |         const page = await browser.newPage();
  243 |         await page.goto(`${BASE_URL}/#/settings`);
  244 | 
  245 |         await page.waitForTimeout(1500);
  246 | 
  247 |         // Should see settings
  248 |         try {
```