# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: finance-tracker.spec.js >> Finance Tracker E2E Tests - 2 Cycles >> Cycle 1 >> C1.10 - View Analytics page
- Location: e2e\finance-tracker.spec.js:215:11

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Analytics')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Analytics')

```

# Test source

```ts
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
  148 |         await expect(page.locator('text=Savings Goals')).toBeVisible({ timeout: 5000 });
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
> 222 |         await expect(page.locator('text=Analytics')).toBeVisible({ timeout: 5000 });
      |                                                      ^ Error: expect(locator).toBeVisible() failed
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
  249 |           await expect(page.locator('text=Settings')).toBeVisible({ timeout: 5000 });
  250 |           console.log(`✅ [Cycle ${cycle}] Settings page loaded`);
  251 |         } catch (e) {
  252 |           console.log(`⚠️ [Cycle ${cycle}] Settings page loading`);
  253 |         }
  254 | 
  255 |         await page.close();
  256 |       });
  257 | 
  258 |       test(`C${cycle}.13 - Toggle dark mode`, async ({ browser }) => {
  259 |         const page = await browser.newPage();
  260 |         await page.goto(`${BASE_URL}/#/settings`);
  261 | 
  262 |         await page.waitForTimeout(1500);
  263 | 
  264 |         // Find and click dark mode toggle
  265 |         const darkModeButton = await page.locator('button:has-text("Dark Mode")').first();
  266 |         if (darkModeButton) {
  267 |           await darkModeButton.click();
  268 |           await page.waitForTimeout(500);
  269 |           console.log(`✅ [Cycle ${cycle}] Dark mode toggled`);
  270 |         }
  271 | 
  272 |         await page.close();
  273 |       });
  274 | 
  275 |       test(`C${cycle}.14 - Export data`, async ({ browser }) => {
  276 |         const page = await browser.newPage();
  277 |         await page.goto(`${BASE_URL}/#/settings`);
  278 | 
  279 |         await page.waitForTimeout(1500);
  280 | 
  281 |         // Look for export button
  282 |         const exportButton = await page.locator('button:has-text("Export")').first();
  283 |         if (exportButton) {
  284 |           await exportButton.click();
  285 |           await page.waitForTimeout(500);
  286 |           console.log(`✅ [Cycle ${cycle}] Data exported`);
  287 |         }
  288 | 
  289 |         await page.close();
  290 |       });
  291 | 
  292 |       test(`C${cycle}.15 - View Profile page`, async ({ browser }) => {
  293 |         const page = await browser.newPage();
  294 |         await page.goto(`${BASE_URL}/#/profile`);
  295 | 
  296 |         await page.waitForTimeout(1500);
  297 | 
  298 |         // Should see profile info
  299 |         try {
  300 |           await expect(page.locator('text=Profile')).toBeVisible({ timeout: 5000 });
  301 |           console.log(`✅ [Cycle ${cycle}] Profile page loaded`);
  302 |         } catch (e) {
  303 |           console.log(`⚠️ [Cycle ${cycle}] Profile page loading`);
  304 |         }
  305 | 
  306 |         await page.close();
  307 |       });
  308 | 
  309 |       test(`C${cycle}.16 - Logout`, async ({ browser }) => {
  310 |         const page = await browser.newPage();
  311 |         await page.goto(`${BASE_URL}/#/dashboard`);
  312 | 
  313 |         await page.waitForTimeout(1500);
  314 | 
  315 |         // Find logout button (usually in sidebar)
  316 |         const logoutButton = await page.locator('button:has-text("Logout")').first();
  317 |         if (logoutButton) {
  318 |           await logoutButton.click();
  319 |           await page.waitForTimeout(1000);
  320 | 
  321 |           // Should redirect to login
  322 |           await expect(page.locator('text=Login')).toBeVisible({ timeout: 5000 });
```