# Graph Report - .  (2026-04-18)

## Corpus Check
- Large corpus: 341 files · ~11,22,480 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder, or use --no-semantic to run AST-only.

## Summary
- 895 nodes · 1159 edges · 51 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## God Nodes (most connected - your core abstractions)
1. `utils.ts` - 44 edges
2. `client.ts` - 39 edges
3. `MenuPage.tsx` - 28 edges
4. `AuthContext.tsx` - 28 edges
5. `app.module.ts` - 25 edges
6. `ThemeContext.tsx` - 23 edges
7. `App.tsx` - 21 edges
8. `prisma.service.ts` - 20 edges
9. `theme.ts` - 18 edges
10. `RootNavigator.tsx` - 17 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities

### Community 0 - "UI Component Library"
Cohesion: 0.02
Nodes (44): accordion.tsx, alert.tsx, alert-dialog.tsx, avatar.tsx, badge.tsx, breadcrumb.tsx, button.tsx, calendar.tsx (+36 more)

### Community 1 - "Mobile Analytics & Auth"
Cohesion: 0.05
Nodes (30): AnalyticsScreen.tsx, getDateRange(), localDate(), AuthContext.tsx, DashboardScreen.tsx, deliveries.ts, DeliveriesScreen.tsx, KanbanOrdersScreen.tsx (+22 more)

### Community 2 - "Customer Auth & Cart"
Cohesion: 0.04
Nodes (31): auth.ts, getCustomer(), setCustomer(), CartDrawer.tsx, CheckoutPage.tsx, ConfirmCancelModal.tsx, ConfirmTableMoveModal.tsx, CustomerAuthModal.tsx (+23 more)

### Community 3 - "Backend App & Health"
Cohesion: 0.04
Nodes (27): app.e2e-spec.ts, app.module.ts, AppModule, health.controller.ts, HealthController, health.module.ts, HealthModule, robot-runtime.controller.ts (+19 more)

### Community 4 - "Desktop POS & Admin"
Cohesion: 0.05
Nodes (21): analytics.ts, apiClient.ts, App.tsx, CustomersPage.tsx, DashboardPage.tsx, getDateRange(), localDate(), index.ts (+13 more)

### Community 5 - "Analytics API Layer"
Cohesion: 0.04
Nodes (26): analytics.controller.ts, AnalyticsController, analytics.controller.spec.ts, analytics.module.ts, AnalyticsModule, analytics.service.ts, AnalyticsService, analytics.service.spec.ts (+18 more)

### Community 6 - "Orders API & DTOs"
Cohesion: 0.04
Nodes (17): create-order.dto.ts, CreateOrderDto, OrderItemDto, orders.controller.ts, OrdersController, orders.module.ts, OrdersModule, orders.service.ts (+9 more)

### Community 7 - "DB Seed Scripts"
Cohesion: 0.05
Nodes (28): add_new_restaurant.ts, add_south_indian_restaurant.ts, check_db.ts, check_db_counts.ts, client.ts, create_outlet.ts, debug_auth.ts, find_id.ts (+20 more)

### Community 8 - "Categories API"
Cohesion: 0.05
Nodes (22): categories.controller.ts, CategoriesController, categories.module.ts, CategoriesModule, categories.service.ts, CategoriesService, customers.controller.ts, CustomersController (+14 more)

### Community 9 - "Auth Controller & JWT"
Cohesion: 0.06
Nodes (23): auth.controller.ts, AuthController, auth.module.ts, AuthModule, auth.service.ts, AuthService, create-user.dto.ts, CreateUserDto (+15 more)

### Community 10 - "Inventory & WebSockets"
Cohesion: 0.06
Nodes (15): create-inventory-item.dto.ts, CreateInventoryItemDto, events.gateway.ts, EventsGateway, events.module.ts, EventsModule, inventory.controller.ts, InventoryController (+7 more)

### Community 11 - "Admin API Controller"
Cohesion: 0.07
Nodes (14): admin.controller.ts, AdminController, admin.module.ts, AdminModule, admin.service.ts, AdminService, main.tsx, a() (+6 more)

### Community 12 - "Menu API & DTOs"
Cohesion: 0.09
Nodes (12): create-menu-item.dto.ts, CreateMenuItemDto, menu.controller.ts, MenuController, menu.module.ts, MenuModule, menu.service.ts, MenuService (+4 more)

### Community 13 - "Recipes API"
Cohesion: 0.12
Nodes (9): recipes.controller.ts, RecipesController, recipes.module.ts, RecipesModule, recipes.service.ts, RecipesService, upsert-recipe.dto.ts, RecipeIngredientDto (+1 more)

### Community 14 - "Outlets API"
Cohesion: 0.12
Nodes (8): create-outlet.dto.ts, CreateOutletDto, outlets.controller.ts, OutletsController, outlets.module.ts, OutletsModule, outlets.service.ts, OutletsService

### Community 15 - "Restaurants API"
Cohesion: 0.12
Nodes (6): restaurants.controller.ts, RestaurantsController, restaurants.module.ts, RestaurantsModule, restaurants.service.ts, RestaurantsService

### Community 16 - "Dropdown Menu UI"
Cohesion: 0.18
Nodes (1): dropdown-menu.tsx

### Community 17 - "Users Service"
Cohesion: 0.31
Nodes (1): UsersService

### Community 18 - "Public Landing Page"
Cohesion: 0.22
Nodes (6): Footer.tsx, Home.tsx, ImageWithFallback.tsx, Navbar.tsx, Root.tsx, routes.tsx

### Community 19 - "Menubar UI"
Cohesion: 0.22
Nodes (1): menubar.tsx

### Community 20 - "Database Seeder"
Cohesion: 0.43
Nodes (8): seed.ts, adopt(), fulfilled(), generateSecretKey(), rejected(), seed(), step(), verb()

### Community 21 - "App Bootstrap"
Cohesion: 0.29
Nodes (5): app.controller.ts, AppController, app.controller.spec.ts, app.service.ts, AppService

### Community 22 - "Form Components"
Cohesion: 0.32
Nodes (5): form.tsx, FormControl(), FormDescription(), useFormField(), label.tsx

### Community 23 - "Select UI"
Cohesion: 0.29
Nodes (1): select.tsx

### Community 24 - "Robot E2E Tests"
Cohesion: 0.4
Nodes (1): robot-test.py

### Community 25 - "Electron Preload"
Cohesion: 0.4
Nodes (1): preload.ts

### Community 26 - "ObjectId Pipe"
Cohesion: 0.67
Nodes (2): parse-object-id.pipe.ts, ParseObjectIdPipe

### Community 27 - "Style Refactor Scripts"
Cohesion: 1
Nodes (3): refactor_styles.js, processDirectory(), processFile()

### Community 28 - "Collapsible UI"
Cohesion: 0.67
Nodes (1): collapsible.tsx

### Community 29 - "Color Fix Script"
Cohesion: 1
Nodes (1): fix_colors.js

### Community 30 - "Key Fix Script"
Cohesion: 1
Nodes (1): fix_keys.js

### Community 31 - "DOCX Reader"
Cohesion: 1
Nodes (1): read_docx.py

### Community 32 - "Rebrand Script"
Cohesion: 1
Nodes (1): rebrand.js

### Community 33 - "Rename Keys Script"
Cohesion: 1
Nodes (1): rename_keys.js

### Community 34 - "Backend Key Fix"
Cohesion: 1
Nodes (1): fix_backend_keys.js

### Community 35 - "URL Getter Script"
Cohesion: 1
Nodes (1): getUrls.js

### Community 36 - "Login DTO"
Cohesion: 1
Nodes (2): login.dto.ts, LoginDto

### Community 37 - "Payment Query DTO"
Cohesion: 1
Nodes (2): query-payment.dto.ts, QueryPaymentDto

### Community 38 - "Old Order Test"
Cohesion: 1
Nodes (1): test-old-order.js

### Community 39 - "Table Test Script"
Cohesion: 1
Nodes (1): test-tables.js

### Community 40 - "Live API Test"
Cohesion: 1
Nodes (1): test_live_api.ts

### Community 41 - "Total Rebrand Script"
Cohesion: 1
Nodes (1): total_rebrand.js

### Community 42 - "Sonner Toast"
Cohesion: 1
Nodes (1): sonner.tsx

### Community 43 - "Auth Decorator"
Cohesion: 1
Nodes (1): current-user.decorator.ts

### Community 44 - "ESLint Config"
Cohesion: 1
Nodes (1): eslint.config.js

### Community 45 - "Vite Config"
Cohesion: 1
Nodes (1): vite.config.ts

### Community 46 - "Vite Env Types"
Cohesion: 1
Nodes (1): vite-env.d.ts

### Community 47 - "Metro Config"
Cohesion: 1
Nodes (1): metro.config.js

### Community 48 - "Delivery Screen"
Cohesion: 1
Nodes (1): CreateDeliveryScreen.tsx

### Community 49 - "Order Detail Screen"
Cohesion: 1
Nodes (1): OrderDetailScreen.tsx

### Community 50 - "Aspect Ratio UI"
Cohesion: 1
Nodes (1): aspect-ratio.tsx

## Knowledge Gaps
- **75 isolated node(s):** `fix_colors.js`, `fix_keys.js`, `read_docx.py`, `rebrand.js`, `rename_keys.js` (+70 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Color Fix Script`** (2 nodes): `fix_colors.js`, `replaceInDir()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Key Fix Script`** (2 nodes): `fix_keys.js`, `processDirectory()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `DOCX Reader`** (2 nodes): `read_docx.py`, `extract_text_from_docx()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Rebrand Script`** (2 nodes): `rebrand.js`, `replaceInDir()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Rename Keys Script`** (2 nodes): `rename_keys.js`, `processDirectory()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Backend Key Fix`** (2 nodes): `fix_backend_keys.js`, `walk()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `URL Getter Script`** (2 nodes): `getUrls.js`, `run()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Login DTO`** (2 nodes): `login.dto.ts`, `LoginDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Payment Query DTO`** (2 nodes): `query-payment.dto.ts`, `QueryPaymentDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Old Order Test`** (2 nodes): `test-old-order.js`, `main()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Table Test Script`** (2 nodes): `test-tables.js`, `main()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Live API Test`** (2 nodes): `test_live_api.ts`, `test()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Total Rebrand Script`** (2 nodes): `total_rebrand.js`, `walkAndReplace()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Sonner Toast`** (1 nodes): `sonner.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Auth Decorator`** (1 nodes): `current-user.decorator.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `ESLint Config`** (1 nodes): `eslint.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Vite Config`** (1 nodes): `vite.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Vite Env Types`** (1 nodes): `vite-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Metro Config`** (1 nodes): `metro.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Delivery Screen`** (1 nodes): `CreateDeliveryScreen.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Order Detail Screen`** (1 nodes): `OrderDetailScreen.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Aspect Ratio UI`** (1 nodes): `aspect-ratio.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `client.ts` connect `DB Seed Scripts` to `Analytics API Layer`, `Orders API & DTOs`, `Categories API`, `Database Seeder`, `Backend App & Health`, `Auth Controller & JWT`, `Customer Auth & Cart`, `Admin API Controller`, `Desktop POS & Admin`, `Mobile Analytics & Auth`?**
  _High betweenness centrality (0.317) - this node is a cross-community bridge._
- **Why does `AuthContext.tsx` connect `Mobile Analytics & Auth` to `Desktop POS & Admin`, `UI Component Library`, `Admin API Controller`, `Customer Auth & Cart`?**
  _High betweenness centrality (0.304) - this node is a cross-community bridge._
- **Why does `sidebar.tsx` connect `UI Component Library` to `Mobile Analytics & Auth`, `Desktop POS & Admin`?**
  _High betweenness centrality (0.269) - this node is a cross-community bridge._
- **What connects `fix_colors.js`, `fix_keys.js`, `read_docx.py` to the rest of the system?**
  _75 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UI Component Library` be split into smaller, more focused modules?**
  _Cohesion score 0.02 - nodes in this community are weakly interconnected._
- **Should `Mobile Analytics & Auth` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Customer Auth & Cart` be split into smaller, more focused modules?**
  _Cohesion score 0.04 - nodes in this community are weakly interconnected._