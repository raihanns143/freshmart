# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-functional.spec.ts >> Product CRUD >> Edit Product
- Location: e2e\admin-functional.spec.ts:41:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForLoadState: Test timeout of 30000ms exceeded.
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e3]:
      - complementary [ref=e4]:
        - generic [ref=e5]:
          - img [ref=e7]
          - generic [ref=e10]:
            - paragraph [ref=e11]: FreshMart
            - paragraph [ref=e12]: Admin Panel
        - navigation [ref=e13]:
          - link "Dashboard" [ref=e14] [cursor=pointer]:
            - /url: /admin/dashboard
            - img [ref=e15]
            - generic [ref=e20]: Dashboard
          - link "Products" [ref=e21] [cursor=pointer]:
            - /url: /admin/products
            - img [ref=e22]
            - generic [ref=e26]: Products
          - link "Categories" [ref=e28] [cursor=pointer]:
            - /url: /admin/categories
            - img [ref=e29]
            - generic [ref=e32]: Categories
          - link "Brands" [ref=e33] [cursor=pointer]:
            - /url: /admin/brands
            - img [ref=e34]
            - generic [ref=e38]: Brands
          - link "Orders" [ref=e39] [cursor=pointer]:
            - /url: /admin/orders
            - img [ref=e40]
            - generic [ref=e44]: Orders
          - link "Customers" [ref=e45] [cursor=pointer]:
            - /url: /admin/customers
            - img [ref=e46]
            - generic [ref=e51]: Customers
          - link "Inventory" [ref=e52] [cursor=pointer]:
            - /url: /admin/inventory
            - img [ref=e53]
            - generic [ref=e56]: Inventory
          - link "Coupons" [ref=e57] [cursor=pointer]:
            - /url: /admin/coupons
            - img [ref=e58]
            - generic [ref=e60]: Coupons
          - link "Reviews" [ref=e61] [cursor=pointer]:
            - /url: /admin/reviews
            - img [ref=e62]
            - generic [ref=e64]: Reviews
          - link "Analytics" [ref=e65] [cursor=pointer]:
            - /url: /admin/analytics
            - img [ref=e66]
            - generic [ref=e67]: Analytics
          - link "Reports" [ref=e68] [cursor=pointer]:
            - /url: /admin/reports
            - img [ref=e69]
            - generic [ref=e72]: Reports
          - link "Media Library" [ref=e73] [cursor=pointer]:
            - /url: /admin/media
            - img [ref=e74]
            - generic [ref=e78]: Media Library
          - link "Users" [ref=e79] [cursor=pointer]:
            - /url: /admin/users
            - img [ref=e80]
            - generic [ref=e85]: Users
          - link "Settings" [ref=e86] [cursor=pointer]:
            - /url: /admin/settings
            - img [ref=e87]
            - generic [ref=e90]: Settings
          - link "Activity Logs" [ref=e91] [cursor=pointer]:
            - /url: /admin/activity-logs
            - img [ref=e92]
            - generic [ref=e94]: Activity Logs
        - generic [ref=e95]:
          - button "Logout" [ref=e96]:
            - img [ref=e97]
            - generic [ref=e100]: Logout
          - button "Collapse" [ref=e101]:
            - img [ref=e102]
            - generic [ref=e104]: Collapse
      - generic [ref=e105]:
        - banner [ref=e106]:
          - generic [ref=e108]:
            - link "Admin" [ref=e109] [cursor=pointer]:
              - /url: /admin/dashboard
            - generic [ref=e110]: /
            - generic [ref=e111]: Products
          - generic [ref=e112]:
            - generic [ref=e113] [cursor=pointer]:
              - img [ref=e114]
              - generic [ref=e117]: Quick search...
              - generic [ref=e118]: ⌘K
            - button [ref=e119]:
              - img [ref=e120]
            - button "Q QA Admin" [ref=e125]:
              - generic [ref=e126]: Q
              - generic [ref=e127]: QA Admin
              - img [ref=e128]
        - main [ref=e130]:
          - generic [ref=e131]:
            - generic [ref=e132]:
              - generic [ref=e133]:
                - heading "Products" [level=1] [ref=e134]
                - paragraph [ref=e135]: Manage your product catalog
              - generic [ref=e136]:
                - button "Export" [ref=e137]:
                  - img [ref=e138]
                  - text: Export
                - button "Import" [ref=e141]:
                  - img [ref=e142]
                  - text: Import
                - link "New Product" [ref=e145] [cursor=pointer]:
                  - /url: /admin/products/new
                  - img [ref=e146]
                  - text: New Product
            - generic [ref=e147]:
              - generic [ref=e149]:
                - generic [ref=e150]:
                  - img [ref=e151]
                  - textbox "Search products by name or SKU..." [ref=e154]
                - combobox [ref=e155]:
                  - option "All Categories" [selected]
                  - option "Bakery"
                  - option "Beverages"
                  - option "Dairy & Eggs"
                  - option "Fresh Produce"
                  - option "Frozen Foods"
                  - option "Meat & Seafood"
                  - option "QA Test Category"
                  - option "Snacks"
                - combobox [ref=e156]:
                  - option "All Status" [selected]
                  - option "Active"
                  - option "Draft"
                - button "Filter" [ref=e157]
              - table [ref=e159]:
                - rowgroup [ref=e160]:
                  - row "Product Status Inventory Variants Price Range" [ref=e161]:
                    - columnheader [ref=e162]:
                      - button [ref=e163]:
                        - img [ref=e164]
                    - columnheader "Product" [ref=e166]
                    - columnheader "Status" [ref=e167]
                    - columnheader "Inventory" [ref=e168]
                    - columnheader "Variants" [ref=e169]
                    - columnheader "Price Range" [ref=e170]
                    - columnheader [ref=e171]
                - rowgroup [ref=e172]:
                  - row "QA Test Product QA Test Category Active 100 in stock 1 variant(s) $9.99" [ref=e173]:
                    - cell [ref=e174]:
                      - button [ref=e175]:
                        - img [ref=e176]
                    - cell "QA Test Product QA Test Category" [ref=e178]:
                      - generic [ref=e179]:
                        - img [ref=e181]
                        - generic [ref=e185]:
                          - link "QA Test Product" [ref=e186] [cursor=pointer]:
                            - /url: /admin/products/cmr0tvkwl0004x1riy0nqucyj/edit
                          - paragraph [ref=e187]: QA Test Category
                    - cell "Active" [ref=e188]
                    - cell "100 in stock" [ref=e189]:
                      - generic [ref=e190]: 100 in stock
                    - cell "1 variant(s)" [ref=e191]
                    - cell "$9.99" [ref=e192]
                    - cell [ref=e193]:
                      - generic [ref=e194]:
                        - link [ref=e195] [cursor=pointer]:
                          - /url: /admin/products/cmr0tvkwl0004x1riy0nqucyj/edit
                          - img [ref=e196]
                        - button [ref=e198]:
                          - img [ref=e199]
                  - row "Chicken Breast Meat & Seafood Active 0 in stock 0 variant(s) —" [ref=e202]:
                    - cell [ref=e203]:
                      - button [ref=e204]:
                        - img [ref=e205]
                    - cell "Chicken Breast Meat & Seafood" [ref=e207]:
                      - generic [ref=e210]:
                        - link "Chicken Breast" [ref=e211] [cursor=pointer]:
                          - /url: /admin/products/cmqz3c3b6001ecvr2kcfi8uzk/edit
                        - paragraph [ref=e212]: Meat & Seafood
                    - cell "Active" [ref=e213]
                    - cell "0 in stock" [ref=e214]:
                      - generic [ref=e215]: 0 in stock
                    - cell "0 variant(s)" [ref=e216]
                    - cell "—" [ref=e217]
                    - cell [ref=e218]:
                      - generic [ref=e219]:
                        - link [ref=e220] [cursor=pointer]:
                          - /url: /admin/products/cmqz3c3b6001ecvr2kcfi8uzk/edit
                          - img [ref=e221]
                        - button [ref=e223]:
                          - img [ref=e224]
                  - row "Avocados (4 pack) Fresh Produce Active 0 in stock 0 variant(s) —" [ref=e227]:
                    - cell [ref=e228]:
                      - button [ref=e229]:
                        - img [ref=e230]
                    - cell "Avocados (4 pack) Fresh Produce" [ref=e232]:
                      - generic [ref=e235]:
                        - link "Avocados (4 pack)" [ref=e236] [cursor=pointer]:
                          - /url: /admin/products/cmqz3c2740019cvr29bicu5oj/edit
                        - paragraph [ref=e237]: Fresh Produce
                    - cell "Active" [ref=e238]
                    - cell "0 in stock" [ref=e239]:
                      - generic [ref=e240]: 0 in stock
                    - cell "0 variant(s)" [ref=e241]
                    - cell "—" [ref=e242]
                    - cell [ref=e243]:
                      - generic [ref=e244]:
                        - link [ref=e245] [cursor=pointer]:
                          - /url: /admin/products/cmqz3c2740019cvr29bicu5oj/edit
                          - img [ref=e246]
                        - button [ref=e248]:
                          - img [ref=e249]
                  - row "Greek Yogurt Dairy & Eggs Active 0 in stock 0 variant(s) —" [ref=e252]:
                    - cell [ref=e253]:
                      - button [ref=e254]:
                        - img [ref=e255]
                    - cell "Greek Yogurt Dairy & Eggs" [ref=e257]:
                      - generic [ref=e260]:
                        - link "Greek Yogurt" [ref=e261] [cursor=pointer]:
                          - /url: /admin/products/cmqz3c13g0014cvr2o1v7df3p/edit
                        - paragraph [ref=e262]: Dairy & Eggs
                    - cell "Active" [ref=e263]
                    - cell "0 in stock" [ref=e264]:
                      - generic [ref=e265]: 0 in stock
                    - cell "0 variant(s)" [ref=e266]
                    - cell "—" [ref=e267]
                    - cell [ref=e268]:
                      - generic [ref=e269]:
                        - link [ref=e270] [cursor=pointer]:
                          - /url: /admin/products/cmqz3c13g0014cvr2o1v7df3p/edit
                          - img [ref=e271]
                        - button [ref=e273]:
                          - img [ref=e274]
                  - row "Cherry Tomatoes Fresh Produce Active 0 in stock 0 variant(s) —" [ref=e277]:
                    - cell [ref=e278]:
                      - button [ref=e279]:
                        - img [ref=e280]
                    - cell "Cherry Tomatoes Fresh Produce" [ref=e282]:
                      - generic [ref=e285]:
                        - link "Cherry Tomatoes" [ref=e286] [cursor=pointer]:
                          - /url: /admin/products/cmqz3bzt8000zcvr2utqmhjpj/edit
                        - paragraph [ref=e287]: Fresh Produce
                    - cell "Active" [ref=e288]
                    - cell "0 in stock" [ref=e289]:
                      - generic [ref=e290]: 0 in stock
                    - cell "0 variant(s)" [ref=e291]
                    - cell "—" [ref=e292]
                    - cell [ref=e293]:
                      - generic [ref=e294]:
                        - link [ref=e295] [cursor=pointer]:
                          - /url: /admin/products/cmqz3bzt8000zcvr2utqmhjpj/edit
                          - img [ref=e296]
                        - button [ref=e298]:
                          - img [ref=e299]
                  - row "Free Range Eggs Dairy & Eggs Active 0 in stock 0 variant(s) —" [ref=e302]:
                    - cell [ref=e303]:
                      - button [ref=e304]:
                        - img [ref=e305]
                    - cell "Free Range Eggs Dairy & Eggs" [ref=e307]:
                      - generic [ref=e310]:
                        - link "Free Range Eggs" [ref=e311] [cursor=pointer]:
                          - /url: /admin/products/cmqz3bypy000ucvr293cfkzwx/edit
                        - paragraph [ref=e312]: Dairy & Eggs
                    - cell "Active" [ref=e313]
                    - cell "0 in stock" [ref=e314]:
                      - generic [ref=e315]: 0 in stock
                    - cell "0 variant(s)" [ref=e316]
                    - cell "—" [ref=e317]
                    - cell [ref=e318]:
                      - generic [ref=e319]:
                        - link [ref=e320] [cursor=pointer]:
                          - /url: /admin/products/cmqz3bypy000ucvr293cfkzwx/edit
                          - img [ref=e321]
                        - button [ref=e323]:
                          - img [ref=e324]
                  - row "Sourdough Bread Bakery Active 0 in stock 0 variant(s) —" [ref=e327]:
                    - cell [ref=e328]:
                      - button [ref=e329]:
                        - img [ref=e330]
                    - cell "Sourdough Bread Bakery" [ref=e332]:
                      - generic [ref=e335]:
                        - link "Sourdough Bread" [ref=e336] [cursor=pointer]:
                          - /url: /admin/products/cmqz3bxfz000pcvr2i6xzoda4/edit
                        - paragraph [ref=e337]: Bakery
                    - cell "Active" [ref=e338]
                    - cell "0 in stock" [ref=e339]:
                      - generic [ref=e340]: 0 in stock
                    - cell "0 variant(s)" [ref=e341]
                    - cell "—" [ref=e342]
                    - cell [ref=e343]:
                      - generic [ref=e344]:
                        - link [ref=e345] [cursor=pointer]:
                          - /url: /admin/products/cmqz3bxfz000pcvr2i6xzoda4/edit
                          - img [ref=e346]
                        - button [ref=e348]:
                          - img [ref=e349]
                  - row "Fresh Milk 1L Dairy & Eggs Active 0 in stock 0 variant(s) —" [ref=e352]:
                    - cell [ref=e353]:
                      - button [ref=e354]:
                        - img [ref=e355]
                    - cell "Fresh Milk 1L Dairy & Eggs" [ref=e357]:
                      - generic [ref=e360]:
                        - link "Fresh Milk 1L" [ref=e361] [cursor=pointer]:
                          - /url: /admin/products/cmqz3bwcp000kcvr2k7mvwyyu/edit
                        - paragraph [ref=e362]: Dairy & Eggs
                    - cell "Active" [ref=e363]
                    - cell "0 in stock" [ref=e364]:
                      - generic [ref=e365]: 0 in stock
                    - cell "0 variant(s)" [ref=e366]
                    - cell "—" [ref=e367]
                    - cell [ref=e368]:
                      - generic [ref=e369]:
                        - link [ref=e370] [cursor=pointer]:
                          - /url: /admin/products/cmqz3bwcp000kcvr2k7mvwyyu/edit
                          - img [ref=e371]
                        - button [ref=e373]:
                          - img [ref=e374]
                  - row "Organic Bananas Fresh Produce Active 0 in stock 0 variant(s) —" [ref=e377]:
                    - cell [ref=e378]:
                      - button [ref=e379]:
                        - img [ref=e380]
                    - cell "Organic Bananas Fresh Produce" [ref=e382]:
                      - generic [ref=e385]:
                        - link "Organic Bananas" [ref=e386] [cursor=pointer]:
                          - /url: /admin/products/cmqz3buca000fcvr2lmn6zg5m/edit
                        - paragraph [ref=e387]: Fresh Produce
                    - cell "Active" [ref=e388]
                    - cell "0 in stock" [ref=e389]:
                      - generic [ref=e390]: 0 in stock
                    - cell "0 variant(s)" [ref=e391]
                    - cell "—" [ref=e392]
                    - cell [ref=e393]:
                      - generic [ref=e394]:
                        - link [ref=e395] [cursor=pointer]:
                          - /url: /admin/products/cmqz3buca000fcvr2lmn6zg5m/edit
                          - img [ref=e396]
                        - button [ref=e398]:
                          - img [ref=e399]
    - region "Notifications alt+T"
  - region "Notifications alt+T"
  - alert [ref=e402]
```

# Test source

```ts
  1   | /**
  2   |  * E2E Test: Admin Functional Tests
  3   |  * Tests CRUD operations for Products, Categories, Coupons,
  4   |  * Inventory adjustments, Review moderation, and User management.
  5   |  */
  6   | import { test, expect, Page } from '@playwright/test';
  7   | 
  8   | const ADMIN_EMAIL = 'qa-admin@freshmart-test.com';
  9   | const ADMIN_PASS = 'AdminTest123!';
  10  | 
  11  | async function loginAsAdmin(page: Page) {
  12  |   await page.goto('/admin/login');
  13  |   await page.fill('input[type="email"]', ADMIN_EMAIL);
  14  |   await page.fill('input[type="password"]', ADMIN_PASS);
  15  |   await page.click('button[type="submit"]');
  16  |   await page.waitForURL('**/admin/dashboard', { timeout: 15000 });
  17  | }
  18  | 
  19  | test.describe('Product CRUD', () => {
  20  |   let createdProductId: string;
  21  | 
  22  |   test('Create Product', async ({ page }) => {
  23  |     await loginAsAdmin(page);
  24  |     await page.goto('/admin/products/new');
  25  |     await page.waitForLoadState('networkidle');
  26  | 
  27  |     await page.fill('input[name="name"]', 'E2E Test Product');
  28  |     await page.fill('input[name="slug"]', 'e2e-test-product');
  29  |     // Set category (first available)
  30  |     await page.selectOption('select[name="categoryId"]', { index: 1 });
  31  |     // Fill first variant price and stock
  32  |     const priceInputs = page.locator('input[type="number"]').first();
  33  |     await priceInputs.fill('19.99');
  34  | 
  35  |     await page.click('button[type="submit"], button:has-text("Save Product")');
  36  |     await page.waitForURL('**/admin/products', { timeout: 10000 });
  37  |     await expect(page.locator('text=E2E Test Product')).toBeVisible({ timeout: 5000 });
  38  |     console.log('✅ PASS: Product created');
  39  |   });
  40  | 
  41  |   test('Edit Product', async ({ page }) => {
  42  |     await loginAsAdmin(page);
  43  |     await page.goto('/admin/products');
> 44  |     await page.waitForLoadState('networkidle');
      |                ^ Error: page.waitForLoadState: Test timeout of 30000ms exceeded.
  45  | 
  46  |     // Find and click edit on our test product
  47  |     const row = page.locator('tr', { hasText: 'E2E Test Product' }).first();
  48  |     await row.locator('a[href*="/edit"]').first().click();
  49  |     await page.waitForLoadState('networkidle');
  50  | 
  51  |     // Update the name
  52  |     const nameInput = page.locator('input[name="name"]');
  53  |     await nameInput.fill('E2E Test Product (Updated)');
  54  |     await page.click('button:has-text("Save Product")');
  55  |     await page.waitForURL('**/admin/products', { timeout: 10000 });
  56  |     await expect(page.locator('text=Updated')).toBeVisible({ timeout: 5000 });
  57  |     console.log('✅ PASS: Product updated');
  58  |   });
  59  | 
  60  |   test('Delete Product', async ({ page }) => {
  61  |     await loginAsAdmin(page);
  62  |     await page.goto('/admin/products');
  63  |     await page.waitForLoadState('networkidle');
  64  | 
  65  |     // Find and click delete on the test product
  66  |     const row = page.locator('tr', { hasText: 'E2E Test Product' }).first();
  67  |     page.once('dialog', (dialog) => dialog.accept());
  68  |     await row.locator('button:has([data-lucide="trash-2"])').first().click();
  69  |     await page.waitForTimeout(2000);
  70  |     await expect(page.locator('text=E2E Test Product')).not.toBeVisible();
  71  |     console.log('✅ PASS: Product deleted');
  72  |   });
  73  | });
  74  | 
  75  | test.describe('Category CRUD', () => {
  76  |   test('Create Category', async ({ page }) => {
  77  |     await loginAsAdmin(page);
  78  |     await page.goto('/admin/categories');
  79  |     await page.waitForLoadState('networkidle');
  80  | 
  81  |     await page.click('button:has-text("Add Category"), button:has-text("New Category")');
  82  |     await page.waitForTimeout(500);
  83  | 
  84  |     const nameInput = page.locator('input[placeholder*="Category name"], input[name="name"]').first();
  85  |     await nameInput.fill('E2E Category');
  86  |     const slugInput = page.locator('input[placeholder*="slug"], input[name="slug"]').first();
  87  |     await slugInput.fill('e2e-category');
  88  | 
  89  |     await page.click('button:has-text("Save"), button[type="submit"]');
  90  |     await page.waitForTimeout(1000);
  91  |     await expect(page.locator('text=E2E Category')).toBeVisible({ timeout: 5000 });
  92  |     console.log('✅ PASS: Category created');
  93  |   });
  94  | 
  95  |   test('Delete Category', async ({ page }) => {
  96  |     await loginAsAdmin(page);
  97  |     await page.goto('/admin/categories');
  98  |     await page.waitForLoadState('networkidle');
  99  | 
  100 |     const row = page.locator('tr, [role="row"]', { hasText: 'E2E Category' }).first();
  101 |     page.once('dialog', (dialog) => dialog.accept());
  102 |     await row.locator('button:has([data-lucide="trash-2"])').first().click();
  103 |     await page.waitForTimeout(1000);
  104 |     console.log('✅ PASS: Category deleted');
  105 |   });
  106 | });
  107 | 
  108 | test.describe('Coupon CRUD', () => {
  109 |   test('Create Coupon', async ({ page }) => {
  110 |     await loginAsAdmin(page);
  111 |     await page.goto('/admin/coupons');
  112 |     await page.waitForLoadState('networkidle');
  113 | 
  114 |     await page.click('button:has-text("New Coupon"), button:has-text("Create Coupon"), button:has-text("Add Coupon")');
  115 |     await page.waitForTimeout(500);
  116 | 
  117 |     const codeInput = page.locator('input[placeholder*="Code"], input[name="code"]').first();
  118 |     await codeInput.fill('E2E-SAVE20');
  119 | 
  120 |     const valueInput = page.locator('input[placeholder*="value"], input[name="value"], input[type="number"]').first();
  121 |     await valueInput.fill('20');
  122 | 
  123 |     await page.click('button:has-text("Save"), button:has-text("Create"), button[type="submit"]');
  124 |     await page.waitForTimeout(1000);
  125 |     await expect(page.locator('text=E2E-SAVE20')).toBeVisible({ timeout: 5000 });
  126 |     console.log('✅ PASS: Coupon created');
  127 |   });
  128 | 
  129 |   test('Delete Coupon', async ({ page }) => {
  130 |     await loginAsAdmin(page);
  131 |     await page.goto('/admin/coupons');
  132 |     await page.waitForLoadState('networkidle');
  133 | 
  134 |     const row = page.locator('tr, [role="row"]', { hasText: 'E2E-SAVE20' }).first();
  135 |     page.once('dialog', (dialog) => dialog.accept());
  136 |     await row.locator('button:has([data-lucide="trash-2"])').first().click();
  137 |     await page.waitForTimeout(1000);
  138 |     console.log('✅ PASS: Coupon deleted');
  139 |   });
  140 | });
  141 | 
  142 | test.describe('Order Status Update', () => {
  143 |   test('Orders page loads and shows data', async ({ page }) => {
  144 |     await loginAsAdmin(page);
```