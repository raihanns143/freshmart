# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-functional.spec.ts >> Product CRUD >> Create Product
- Location: e2e\admin-functional.spec.ts:22:7

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
            - generic [ref=e111]: New Product
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
                - link [ref=e134] [cursor=pointer]:
                  - /url: /admin/products
                  - img [ref=e135]
                - generic [ref=e137]:
                  - heading "New Product" [level=1] [ref=e138]
                  - paragraph [ref=e139]: Add a new product to your catalog
              - generic [ref=e140]:
                - link "Cancel" [ref=e141] [cursor=pointer]:
                  - /url: /admin/products
                - button "Save Product" [ref=e142]:
                  - img [ref=e143]
                  - text: Save Product
            - generic [ref=e147]:
              - generic [ref=e148]:
                - generic [ref=e149]:
                  - heading "Basic Information" [level=2] [ref=e150]
                  - generic [ref=e151]:
                    - generic [ref=e152]:
                      - generic [ref=e153]: Product Name *
                      - textbox [ref=e154]
                    - generic [ref=e155]:
                      - generic [ref=e156]:
                        - generic [ref=e157]: Slug *
                        - button "Generate from name" [ref=e158]
                      - textbox [ref=e159]
                    - generic [ref=e160]:
                      - generic [ref=e161]: Short Description
                      - textbox [ref=e162]
                    - generic [ref=e163]:
                      - generic [ref=e164]: Full Description
                      - textbox [ref=e165]
                - generic [ref=e166]:
                  - generic [ref=e167]:
                    - heading "Variants & Pricing" [level=2] [ref=e168]
                    - button "Add Variant" [ref=e169]:
                      - img [ref=e170]
                      - text: Add Variant
                  - generic [ref=e172]:
                    - button [ref=e174]:
                      - img [ref=e175]
                    - generic [ref=e178]:
                      - generic [ref=e179]:
                        - generic [ref=e180]: Size / Option Name
                        - textbox "e.g. 1kg, Large" [ref=e181]
                      - generic [ref=e182]:
                        - generic [ref=e183]: Color
                        - textbox "e.g. Red" [ref=e184]
                      - generic [ref=e185]:
                        - generic [ref=e186]: SKU
                        - textbox "SKU-123" [ref=e187]
                      - generic [ref=e188]:
                        - generic [ref=e189]: Barcode
                        - textbox "UPC/EAN" [ref=e190]
                    - generic [ref=e191]:
                      - generic [ref=e192]:
                        - generic [ref=e193]: Price ($) *
                        - spinbutton [ref=e194]: "0"
                      - generic [ref=e195]:
                        - generic [ref=e196]: Sale Price ($)
                        - spinbutton [ref=e197]
                      - generic [ref=e198]:
                        - generic [ref=e199]: Stock *
                        - spinbutton [ref=e200]: "0"
                      - generic [ref=e201]:
                        - generic [ref=e202]: Image URL
                        - textbox "https://..." [ref=e203]
              - generic [ref=e204]:
                - generic [ref=e205]:
                  - heading "Organization" [level=2] [ref=e206]
                  - generic [ref=e207]:
                    - generic [ref=e208]:
                      - generic [ref=e209]: Status
                      - combobox [ref=e210]:
                        - option "Active" [selected]
                        - option "Draft / Hidden"
                    - generic [ref=e211]:
                      - generic [ref=e212]: Category *
                      - combobox [ref=e213]:
                        - option "Select category..." [selected]
                        - option "Bakery"
                        - option "Beverages"
                        - option "Dairy & Eggs"
                        - option "Fresh Produce"
                        - option "Frozen Foods"
                        - option "Meat & Seafood"
                        - option "QA Test Category"
                        - option "Snacks"
                    - generic [ref=e214]:
                      - generic [ref=e215]: Brand
                      - combobox [ref=e216]:
                        - option "No Brand" [selected]
                        - option "Happy Cows Dairy"
                        - option "Local Farms"
                    - generic [ref=e217]:
                      - generic [ref=e218]: Tags (comma separated)
                      - textbox [ref=e219]
                    - generic [ref=e220]:
                      - checkbox "Featured Product" [ref=e221]
                      - generic [ref=e222]: Featured Product
                - generic [ref=e223]:
                  - heading "SEO" [level=2] [ref=e224]
                  - generic [ref=e225]:
                    - generic [ref=e226]:
                      - generic [ref=e227]: Meta Title
                      - textbox [ref=e228]
                    - generic [ref=e229]:
                      - generic [ref=e230]: Meta Description
                      - textbox [ref=e231]
    - region "Notifications alt+T"
  - region "Notifications alt+T"
  - alert [ref=e232]
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
  8   | const ADMIN_EMAIL = 'freshmart-test.com';
  9   | const ADMIN_PASS = '724426';
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
> 25  |     await page.waitForLoadState('networkidle');
      |                ^ Error: page.waitForLoadState: Test timeout of 30000ms exceeded.
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
  44  |     await page.waitForLoadState('networkidle');
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
```