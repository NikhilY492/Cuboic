# Graph Report - .  (2026-05-23)

## Corpus Check
- Large corpus: 563 files · ~11,67,680 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder, or use --no-semantic to run AST-only.

## Summary
- 1308 nodes · 1145 edges · 197 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output


## Input Scope
- Requested: auto
- Resolved: committed (source: default-auto)
- Included files: 563 · Candidates: 1011
- Excluded: 563 untracked · 159438 ignored · 9 sensitive · 0 missing committed
- Recommendation: Use --scope all or graphify.yaml inputs.corpus for a knowledge-base folder.

## Graph Freshness
- Built from Git commit: `29b0837`
- Compare this hash to `git rev-parse HEAD` before trusting freshness-sensitive graph output.
## God Nodes (most connected - your core abstractions)
1. `OrdersService` - 17 edges
2. `OrdersController` - 16 edges
3. `InventoryService` - 13 edges
4. `InventoryController` - 12 edges
5. `UsersService` - 9 edges
6. `AdminService` - 8 edges
7. `MenuService` - 8 edges
8. `RestaurantsController` - 8 edges
9. `RobotsService` - 8 edges
10. `AdminController` - 7 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities

### Community 2 - "Community 2"
Cohesion: 0.12
Nodes (1): OrdersService

### Community 3 - "Community 3"
Cohesion: 0.14
Nodes (7): goToCheckout(), handleAuthSuccess(), handleCheckoutInit(), handleOrderTypeSelect(), handleTableSelect(), proceedWithAuth(), proceedWithTableMove()

### Community 5 - "Community 5"
Cohesion: 0.12
Nodes (1): OrdersController

### Community 8 - "Community 8"
Cohesion: 0.19
Nodes (1): InventoryService

### Community 10 - "Community 10"
Cohesion: 0.15
Nodes (1): InventoryController

### Community 16 - "Community 16"
Cohesion: 0.24
Nodes (2): getDateRange(), localDate()

### Community 18 - "Community 18"
Cohesion: 0.27
Nodes (1): UsersService

### Community 19 - "Community 19"
Cohesion: 0.22
Nodes (1): AdminService

### Community 20 - "Community 20"
Cohesion: 0.22
Nodes (1): useSocket()

### Community 21 - "Community 21"
Cohesion: 0.36
Nodes (5): a(), c(), i(), o(), s()

### Community 22 - "Community 22"
Cohesion: 0.22
Nodes (1): MenuService

### Community 23 - "Community 23"
Cohesion: 0.22
Nodes (1): App()

### Community 24 - "Community 24"
Cohesion: 0.22
Nodes (1): RestaurantsController

### Community 25 - "Community 25"
Cohesion: 0.22
Nodes (1): RobotsService

### Community 26 - "Community 26"
Cohesion: 0.25
Nodes (2): closeModal(), handleSave()

### Community 27 - "Community 27"
Cohesion: 0.25
Nodes (2): buildTableSummaries(), getTableNum()

### Community 28 - "Community 28"
Cohesion: 0.25
Nodes (2): pickImage(), uploadProfilePicture()

### Community 30 - "Community 30"
Cohesion: 0.25
Nodes (1): AdminController

### Community 32 - "Community 32"
Cohesion: 0.43
Nodes (7): adopt(), fulfilled(), generateSecretKey(), rejected(), seed(), step(), verb()

### Community 33 - "Community 33"
Cohesion: 0.25
Nodes (1): MenuController

### Community 34 - "Community 34"
Cohesion: 0.29
Nodes (2): getDateRange(), localDate()

### Community 35 - "Community 35"
Cohesion: 0.39
Nodes (5): fetchInventory(), handleAddItem(), handleAdjust(), handleDeleteItem(), handleStockIn()

### Community 36 - "Community 36"
Cohesion: 0.29
Nodes (1): RecipesController

### Community 37 - "Community 37"
Cohesion: 0.29
Nodes (1): RestaurantsService

### Community 38 - "Community 38"
Cohesion: 0.25
Nodes (1): RobotRuntimeGateway

### Community 39 - "Community 39"
Cohesion: 0.32
Nodes (3): FormControl(), FormDescription(), useFormField()

### Community 40 - "Community 40"
Cohesion: 0.29
Nodes (1): AuthController

### Community 41 - "Community 41"
Cohesion: 0.29
Nodes (2): CategoriesController, CreateCategoryDto

### Community 42 - "Community 42"
Cohesion: 0.38
Nodes (4): fetchUnpaid(), handleSettleAll(), getCustomer(), setCustomer()

### Community 43 - "Community 43"
Cohesion: 0.29
Nodes (1): DeliveriesController

### Community 44 - "Community 44"
Cohesion: 0.29
Nodes (1): DeliveriesService

### Community 45 - "Community 45"
Cohesion: 0.29
Nodes (1): OutletsController

### Community 46 - "Community 46"
Cohesion: 0.29
Nodes (1): OutletsService

### Community 49 - "Community 49"
Cohesion: 0.29
Nodes (1): PlatformFeesService

### Community 50 - "Community 50"
Cohesion: 0.29
Nodes (1): RecipesService

### Community 51 - "Community 51"
Cohesion: 0.29
Nodes (1): RobotRuntimeService

### Community 52 - "Community 52"
Cohesion: 0.29
Nodes (1): UsersController

### Community 56 - "Community 56"
Cohesion: 0.33
Nodes (1): AnalyticsController

### Community 57 - "Community 57"
Cohesion: 0.33
Nodes (1): AnalyticsService

### Community 58 - "Community 58"
Cohesion: 0.4
Nodes (1): AuthService

### Community 60 - "Community 60"
Cohesion: 0.33
Nodes (1): CustomersController

### Community 61 - "Community 61"
Cohesion: 0.33
Nodes (1): CustomersService

### Community 62 - "Community 62"
Cohesion: 0.53
Nodes (4): invoke(), off(), on(), send()

### Community 63 - "Community 63"
Cohesion: 0.33
Nodes (1): PlatformFeesController

### Community 64 - "Community 64"
Cohesion: 0.33
Nodes (1): TelemetryService

### Community 66 - "Community 66"
Cohesion: 0.4
Nodes (1): CategoriesService

### Community 73 - "Community 73"
Cohesion: 0.4
Nodes (1): PaymentsController

### Community 74 - "Community 74"
Cohesion: 0.4
Nodes (1): PaymentsService

### Community 75 - "Community 75"
Cohesion: 0.4
Nodes (1): RobotsController

### Community 76 - "Community 76"
Cohesion: 0.4
Nodes (1): TablesController

### Community 77 - "Community 77"
Cohesion: 0.4
Nodes (1): TablesService

### Community 78 - "Community 78"
Cohesion: 0.4
Nodes (1): TelemetryController

### Community 80 - "Community 80"
Cohesion: 0.5
Nodes (2): CarouselNext(), useCarousel()

### Community 81 - "Community 81"
Cohesion: 0.5
Nodes (2): CategoriesController, CreateCategoryDto

### Community 82 - "Community 82"
Cohesion: 0.5
Nodes (1): DeliveriesController

### Community 83 - "Community 83"
Cohesion: 0.5
Nodes (1): DeliveriesService

### Community 84 - "Community 84"
Cohesion: 0.83
Nodes (3): convertName(), fixCase(), toTitleCase()

### Community 85 - "Community 85"
Cohesion: 0.67
Nodes (2): CreateDeliveryDto, DeliveryStopDto

### Community 86 - "Community 86"
Cohesion: 0.67
Nodes (2): CreateOrderDto, OrderItemDto

### Community 87 - "Community 87"
Cohesion: 0.67
Nodes (2): StockAdjustDto, StockInDto

### Community 88 - "Community 88"
Cohesion: 0.67
Nodes (2): RecipeIngredientDto, UpsertRecipeDto

### Community 89 - "Community 89"
Cohesion: 0.5
Nodes (1): AllExceptionsFilter

### Community 90 - "Community 90"
Cohesion: 0.5
Nodes (1): RolesGuard

### Community 91 - "Community 91"
Cohesion: 0.5
Nodes (1): MenuController

### Community 92 - "Community 92"
Cohesion: 0.5
Nodes (1): MenuService

### Community 93 - "Community 93"
Cohesion: 0.5
Nodes (1): PrismaService

### Community 94 - "Community 94"
Cohesion: 0.5
Nodes (1): RobotsController

### Community 95 - "Community 95"
Cohesion: 0.5
Nodes (1): RobotsService

### Community 96 - "Community 96"
Cohesion: 0.5
Nodes (1): AppController

### Community 97 - "Community 97"
Cohesion: 0.67
Nodes (2): generateSecretKey(), seed()

### Community 98 - "Community 98"
Cohesion: 0.5
Nodes (1): JwtStrategy

### Community 99 - "Community 99"
Cohesion: 0.5
Nodes (1): LocalStrategy

### Community 100 - "Community 100"
Cohesion: 0.83
Nodes (3): convertName(), fixCase(), toTitleCase()

### Community 107 - "Community 107"
Cohesion: 0.67
Nodes (1): CategoriesService

### Community 108 - "Community 108"
Cohesion: 0.67
Nodes (1): Roles()

### Community 109 - "Community 109"
Cohesion: 0.67
Nodes (2): CreateDeliveryDto, DeliveryStopDto

### Community 110 - "Community 110"
Cohesion: 0.67
Nodes (1): CreateInventoryItemDto

### Community 111 - "Community 111"
Cohesion: 0.67
Nodes (1): CreateMenuItemDto

### Community 112 - "Community 112"
Cohesion: 0.67
Nodes (2): CreateOrderDto, OrderItemDto

### Community 113 - "Community 113"
Cohesion: 0.67
Nodes (1): CreateOutletDto

### Community 114 - "Community 114"
Cohesion: 0.67
Nodes (1): CreateUserDto

### Community 115 - "Community 115"
Cohesion: 0.67
Nodes (1): LoginDto

### Community 116 - "Community 116"
Cohesion: 0.67
Nodes (1): QueryMenuDto

### Community 117 - "Community 117"
Cohesion: 0.67
Nodes (1): QueryPaymentDto

### Community 118 - "Community 118"
Cohesion: 0.67
Nodes (2): StockAdjustDto, StockInDto

### Community 119 - "Community 119"
Cohesion: 0.67
Nodes (1): UpdateMenuItemDto

### Community 120 - "Community 120"
Cohesion: 0.67
Nodes (1): UpdateOrderStatusDto

### Community 121 - "Community 121"
Cohesion: 0.67
Nodes (1): UpdateUserDto

### Community 122 - "Community 122"
Cohesion: 0.67
Nodes (2): RecipeIngredientDto, UpsertRecipeDto

### Community 123 - "Community 123"
Cohesion: 0.67
Nodes (1): EventsGateway

### Community 124 - "Community 124"
Cohesion: 0.67
Nodes (1): HealthController

### Community 125 - "Community 125"
Cohesion: 0.67
Nodes (1): InventoryController

### Community 126 - "Community 126"
Cohesion: 0.67
Nodes (1): InventoryService

### Community 127 - "Community 127"
Cohesion: 0.67
Nodes (1): OutletsController

### Community 128 - "Community 128"
Cohesion: 0.67
Nodes (1): OutletsService

### Community 129 - "Community 129"
Cohesion: 0.67
Nodes (1): ParseObjectIdPipe

### Community 130 - "Community 130"
Cohesion: 0.67
Nodes (1): RobotRuntimeController

### Community 131 - "Community 131"
Cohesion: 0.67
Nodes (1): AppService

### Community 132 - "Community 132"
Cohesion: 0.67
Nodes (1): bootstrap()

### Community 133 - "Community 133"
Cohesion: 0.67
Nodes (1): TablesController

### Community 134 - "Community 134"
Cohesion: 0.67
Nodes (1): TablesService

### Community 135 - "Community 135"
Cohesion: 0.67
Nodes (1): TelemetryController

### Community 136 - "Community 136"
Cohesion: 0.67
Nodes (1): TelemetryService

### Community 137 - "Community 137"
Cohesion: 0.67
Nodes (1): UsersController

### Community 138 - "Community 138"
Cohesion: 0.67
Nodes (1): UsersService

### Community 139 - "Community 139"
Cohesion: 1
Nodes (2): restore(), toTitleCase()

### Community 140 - "Community 140"
Cohesion: 0.67
Nodes (1): UploadController

### Community 141 - "Community 141"
Cohesion: 0.67
Nodes (1): test()

### Community 142 - "Community 142"
Cohesion: 1
Nodes (2): processDirectory(), processFile()

### Community 151 - "Community 151"
Cohesion: 1
Nodes (1): AdminModule

### Community 152 - "Community 152"
Cohesion: 1
Nodes (1): AnalyticsController

### Community 153 - "Community 153"
Cohesion: 1
Nodes (1): AnalyticsModule

### Community 154 - "Community 154"
Cohesion: 1
Nodes (1): AnalyticsModule

### Community 155 - "Community 155"
Cohesion: 1
Nodes (1): AnalyticsService

### Community 156 - "Community 156"
Cohesion: 1
Nodes (1): AuthController

### Community 157 - "Community 157"
Cohesion: 1
Nodes (1): AuthModule

### Community 158 - "Community 158"
Cohesion: 1
Nodes (1): AuthModule

### Community 159 - "Community 159"
Cohesion: 1
Nodes (1): AuthService

### Community 160 - "Community 160"
Cohesion: 1
Nodes (1): CategoriesModule

### Community 161 - "Community 161"
Cohesion: 1
Nodes (1): CategoriesModule

### Community 162 - "Community 162"
Cohesion: 1
Nodes (1): CustomersController

### Community 163 - "Community 163"
Cohesion: 1
Nodes (1): CustomersModule

### Community 164 - "Community 164"
Cohesion: 1
Nodes (1): CustomersModule

### Community 165 - "Community 165"
Cohesion: 1
Nodes (1): CustomersService

### Community 166 - "Community 166"
Cohesion: 1
Nodes (1): DeliveriesModule

### Community 167 - "Community 167"
Cohesion: 1
Nodes (1): DeliveriesModule

### Community 183 - "Community 183"
Cohesion: 1
Nodes (1): CreateInventoryItemDto

### Community 184 - "Community 184"
Cohesion: 1
Nodes (1): CreateMenuItemDto

### Community 185 - "Community 185"
Cohesion: 1
Nodes (1): CreateOutletDto

### Community 186 - "Community 186"
Cohesion: 1
Nodes (1): CreateUserDto

### Community 187 - "Community 187"
Cohesion: 1
Nodes (1): LoginDto

### Community 188 - "Community 188"
Cohesion: 1
Nodes (1): QueryMenuDto

### Community 189 - "Community 189"
Cohesion: 1
Nodes (1): QueryPaymentDto

### Community 190 - "Community 190"
Cohesion: 1
Nodes (1): UpdateMenuItemDto

### Community 191 - "Community 191"
Cohesion: 1
Nodes (1): UpdateOrderStatusDto

### Community 192 - "Community 192"
Cohesion: 1
Nodes (1): UpdateUserDto

### Community 194 - "Community 194"
Cohesion: 1
Nodes (1): EventsGateway

### Community 195 - "Community 195"
Cohesion: 1
Nodes (1): EventsModule

### Community 196 - "Community 196"
Cohesion: 1
Nodes (1): EventsModule

### Community 199 - "Community 199"
Cohesion: 1
Nodes (1): JwtAuthGuard

### Community 200 - "Community 200"
Cohesion: 1
Nodes (1): JwtAuthGuard

### Community 201 - "Community 201"
Cohesion: 1
Nodes (1): LocalAuthGuard

### Community 202 - "Community 202"
Cohesion: 1
Nodes (1): LocalAuthGuard

### Community 203 - "Community 203"
Cohesion: 1
Nodes (1): RolesGuard

### Community 204 - "Community 204"
Cohesion: 1
Nodes (1): HealthController

### Community 205 - "Community 205"
Cohesion: 1
Nodes (1): HealthModule

### Community 206 - "Community 206"
Cohesion: 1
Nodes (1): HealthModule

### Community 207 - "Community 207"
Cohesion: 1
Nodes (1): InventoryModule

### Community 208 - "Community 208"
Cohesion: 1
Nodes (1): InventoryModule

### Community 209 - "Community 209"
Cohesion: 1
Nodes (1): MenuModule

### Community 210 - "Community 210"
Cohesion: 1
Nodes (1): MenuModule

### Community 211 - "Community 211"
Cohesion: 1
Nodes (1): OrdersController

### Community 212 - "Community 212"
Cohesion: 1
Nodes (1): OrdersModule

### Community 213 - "Community 213"
Cohesion: 1
Nodes (1): OrdersModule

### Community 214 - "Community 214"
Cohesion: 1
Nodes (1): OrdersService

### Community 215 - "Community 215"
Cohesion: 1
Nodes (1): OutletsModule

### Community 216 - "Community 216"
Cohesion: 1
Nodes (1): OutletsModule

### Community 217 - "Community 217"
Cohesion: 1
Nodes (1): PaymentsController

### Community 218 - "Community 218"
Cohesion: 1
Nodes (1): PaymentsModule

### Community 219 - "Community 219"
Cohesion: 1
Nodes (1): PaymentsModule

### Community 220 - "Community 220"
Cohesion: 1
Nodes (1): PaymentsService

### Community 221 - "Community 221"
Cohesion: 1
Nodes (1): ParseObjectIdPipe

### Community 222 - "Community 222"
Cohesion: 1
Nodes (1): PlatformFeesController

### Community 223 - "Community 223"
Cohesion: 1
Nodes (1): PlatformFeesModule

### Community 224 - "Community 224"
Cohesion: 1
Nodes (1): PlatformFeesModule

### Community 225 - "Community 225"
Cohesion: 1
Nodes (1): PlatformFeesService

### Community 226 - "Community 226"
Cohesion: 1
Nodes (1): PrismaModule

### Community 227 - "Community 227"
Cohesion: 1
Nodes (1): PrismaModule

### Community 228 - "Community 228"
Cohesion: 1
Nodes (1): PrismaService

### Community 232 - "Community 232"
Cohesion: 1
Nodes (1): RecipesController

### Community 233 - "Community 233"
Cohesion: 1
Nodes (1): RecipesModule

### Community 234 - "Community 234"
Cohesion: 1
Nodes (1): RecipesModule

### Community 235 - "Community 235"
Cohesion: 1
Nodes (1): RecipesService

### Community 237 - "Community 237"
Cohesion: 1
Nodes (1): RestaurantsController

### Community 238 - "Community 238"
Cohesion: 1
Nodes (1): RestaurantsModule

### Community 239 - "Community 239"
Cohesion: 1
Nodes (1): RestaurantsModule

### Community 240 - "Community 240"
Cohesion: 1
Nodes (1): RestaurantsService

### Community 241 - "Community 241"
Cohesion: 1
Nodes (1): RobotRuntimeController

### Community 242 - "Community 242"
Cohesion: 1
Nodes (1): RobotRuntimeGateway

### Community 243 - "Community 243"
Cohesion: 1
Nodes (1): RobotRuntimeModule

### Community 244 - "Community 244"
Cohesion: 1
Nodes (1): RobotRuntimeModule

### Community 245 - "Community 245"
Cohesion: 1
Nodes (1): RobotRuntimeService

### Community 246 - "Community 246"
Cohesion: 1
Nodes (1): RobotsModule

### Community 247 - "Community 247"
Cohesion: 1
Nodes (1): RobotsModule

### Community 248 - "Community 248"
Cohesion: 1
Nodes (1): AppController

### Community 249 - "Community 249"
Cohesion: 1
Nodes (1): AppModule

### Community 250 - "Community 250"
Cohesion: 1
Nodes (1): AppModule

### Community 251 - "Community 251"
Cohesion: 1
Nodes (1): AppService

### Community 252 - "Community 252"
Cohesion: 1
Nodes (1): JwtStrategy

### Community 253 - "Community 253"
Cohesion: 1
Nodes (1): LocalStrategy

### Community 254 - "Community 254"
Cohesion: 1
Nodes (1): TablesModule

### Community 255 - "Community 255"
Cohesion: 1
Nodes (1): TablesModule

### Community 256 - "Community 256"
Cohesion: 1
Nodes (1): TelemetryModule

### Community 257 - "Community 257"
Cohesion: 1
Nodes (1): TelemetryModule

### Community 265 - "Community 265"
Cohesion: 1
Nodes (1): UsersModule

### Community 278 - "Community 278"
Cohesion: 1
Nodes (1): UploadModule

### Community 279 - "Community 279"
Cohesion: 1
Nodes (1): UsersModule

## Knowledge Gaps
- **97 isolated node(s):** `AnalyticsController`, `AnalyticsModule`, `AnalyticsService`, `AppController`, `AppModule` (+92 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 2`** (1 nodes): `OrdersService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 5`** (1 nodes): `OrdersController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 8`** (1 nodes): `InventoryService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (1 nodes): `InventoryController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (2 nodes): `getDateRange()`, `localDate()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (1 nodes): `UsersService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (1 nodes): `AdminService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (1 nodes): `useSocket()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (1 nodes): `MenuService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (1 nodes): `App()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (1 nodes): `RestaurantsController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (1 nodes): `RobotsService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (2 nodes): `closeModal()`, `handleSave()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (2 nodes): `buildTableSummaries()`, `getTableNum()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (2 nodes): `pickImage()`, `uploadProfilePicture()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (1 nodes): `AdminController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 33`** (1 nodes): `MenuController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 34`** (2 nodes): `getDateRange()`, `localDate()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 36`** (1 nodes): `RecipesController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (1 nodes): `RestaurantsService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 38`** (1 nodes): `RobotRuntimeGateway`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 40`** (1 nodes): `AuthController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 41`** (2 nodes): `CategoriesController`, `CreateCategoryDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 43`** (1 nodes): `DeliveriesController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 44`** (1 nodes): `DeliveriesService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 45`** (1 nodes): `OutletsController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 46`** (1 nodes): `OutletsService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 49`** (1 nodes): `PlatformFeesService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 50`** (1 nodes): `RecipesService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 51`** (1 nodes): `RobotRuntimeService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 52`** (1 nodes): `UsersController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 56`** (1 nodes): `AnalyticsController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 57`** (1 nodes): `AnalyticsService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 58`** (1 nodes): `AuthService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 60`** (1 nodes): `CustomersController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 61`** (1 nodes): `CustomersService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 63`** (1 nodes): `PlatformFeesController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 64`** (1 nodes): `TelemetryService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 66`** (1 nodes): `CategoriesService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 73`** (1 nodes): `PaymentsController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 74`** (1 nodes): `PaymentsService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 75`** (1 nodes): `RobotsController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 76`** (1 nodes): `TablesController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 77`** (1 nodes): `TablesService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 78`** (1 nodes): `TelemetryController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 80`** (2 nodes): `CarouselNext()`, `useCarousel()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 81`** (2 nodes): `CategoriesController`, `CreateCategoryDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 82`** (1 nodes): `DeliveriesController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 83`** (1 nodes): `DeliveriesService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 85`** (2 nodes): `CreateDeliveryDto`, `DeliveryStopDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 86`** (2 nodes): `CreateOrderDto`, `OrderItemDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 87`** (2 nodes): `StockAdjustDto`, `StockInDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 88`** (2 nodes): `RecipeIngredientDto`, `UpsertRecipeDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 89`** (1 nodes): `AllExceptionsFilter`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 90`** (1 nodes): `RolesGuard`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 91`** (1 nodes): `MenuController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 92`** (1 nodes): `MenuService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 93`** (1 nodes): `PrismaService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 94`** (1 nodes): `RobotsController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 95`** (1 nodes): `RobotsService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 96`** (1 nodes): `AppController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 97`** (2 nodes): `generateSecretKey()`, `seed()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 98`** (1 nodes): `JwtStrategy`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 99`** (1 nodes): `LocalStrategy`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 107`** (1 nodes): `CategoriesService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 108`** (1 nodes): `Roles()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 109`** (2 nodes): `CreateDeliveryDto`, `DeliveryStopDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 110`** (1 nodes): `CreateInventoryItemDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 111`** (1 nodes): `CreateMenuItemDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 112`** (2 nodes): `CreateOrderDto`, `OrderItemDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 113`** (1 nodes): `CreateOutletDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 114`** (1 nodes): `CreateUserDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 115`** (1 nodes): `LoginDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 116`** (1 nodes): `QueryMenuDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 117`** (1 nodes): `QueryPaymentDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 118`** (2 nodes): `StockAdjustDto`, `StockInDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 119`** (1 nodes): `UpdateMenuItemDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 120`** (1 nodes): `UpdateOrderStatusDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 121`** (1 nodes): `UpdateUserDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 122`** (2 nodes): `RecipeIngredientDto`, `UpsertRecipeDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 123`** (1 nodes): `EventsGateway`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 124`** (1 nodes): `HealthController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 125`** (1 nodes): `InventoryController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 126`** (1 nodes): `InventoryService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 127`** (1 nodes): `OutletsController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 128`** (1 nodes): `OutletsService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 129`** (1 nodes): `ParseObjectIdPipe`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 130`** (1 nodes): `RobotRuntimeController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 131`** (1 nodes): `AppService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 132`** (1 nodes): `bootstrap()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 133`** (1 nodes): `TablesController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 134`** (1 nodes): `TablesService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 135`** (1 nodes): `TelemetryController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 136`** (1 nodes): `TelemetryService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 137`** (1 nodes): `UsersController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 138`** (1 nodes): `UsersService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 139`** (2 nodes): `restore()`, `toTitleCase()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 140`** (1 nodes): `UploadController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 141`** (1 nodes): `test()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 142`** (2 nodes): `processDirectory()`, `processFile()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 151`** (1 nodes): `AdminModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 152`** (1 nodes): `AnalyticsController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 153`** (1 nodes): `AnalyticsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 154`** (1 nodes): `AnalyticsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 155`** (1 nodes): `AnalyticsService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 156`** (1 nodes): `AuthController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 157`** (1 nodes): `AuthModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 158`** (1 nodes): `AuthModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 159`** (1 nodes): `AuthService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 160`** (1 nodes): `CategoriesModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 161`** (1 nodes): `CategoriesModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 162`** (1 nodes): `CustomersController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 163`** (1 nodes): `CustomersModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 164`** (1 nodes): `CustomersModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 165`** (1 nodes): `CustomersService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 166`** (1 nodes): `DeliveriesModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 167`** (1 nodes): `DeliveriesModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 183`** (1 nodes): `CreateInventoryItemDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 184`** (1 nodes): `CreateMenuItemDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 185`** (1 nodes): `CreateOutletDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 186`** (1 nodes): `CreateUserDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 187`** (1 nodes): `LoginDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 188`** (1 nodes): `QueryMenuDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 189`** (1 nodes): `QueryPaymentDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 190`** (1 nodes): `UpdateMenuItemDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 191`** (1 nodes): `UpdateOrderStatusDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 192`** (1 nodes): `UpdateUserDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 194`** (1 nodes): `EventsGateway`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 195`** (1 nodes): `EventsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 196`** (1 nodes): `EventsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 199`** (1 nodes): `JwtAuthGuard`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 200`** (1 nodes): `JwtAuthGuard`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 201`** (1 nodes): `LocalAuthGuard`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 202`** (1 nodes): `LocalAuthGuard`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 203`** (1 nodes): `RolesGuard`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 204`** (1 nodes): `HealthController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 205`** (1 nodes): `HealthModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 206`** (1 nodes): `HealthModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 207`** (1 nodes): `InventoryModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 208`** (1 nodes): `InventoryModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 209`** (1 nodes): `MenuModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 210`** (1 nodes): `MenuModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 211`** (1 nodes): `OrdersController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 212`** (1 nodes): `OrdersModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 213`** (1 nodes): `OrdersModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 214`** (1 nodes): `OrdersService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 215`** (1 nodes): `OutletsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 216`** (1 nodes): `OutletsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 217`** (1 nodes): `PaymentsController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 218`** (1 nodes): `PaymentsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 219`** (1 nodes): `PaymentsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 220`** (1 nodes): `PaymentsService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 221`** (1 nodes): `ParseObjectIdPipe`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 222`** (1 nodes): `PlatformFeesController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 223`** (1 nodes): `PlatformFeesModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 224`** (1 nodes): `PlatformFeesModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 225`** (1 nodes): `PlatformFeesService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 226`** (1 nodes): `PrismaModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 227`** (1 nodes): `PrismaModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 228`** (1 nodes): `PrismaService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 232`** (1 nodes): `RecipesController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 233`** (1 nodes): `RecipesModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 234`** (1 nodes): `RecipesModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 235`** (1 nodes): `RecipesService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 237`** (1 nodes): `RestaurantsController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 238`** (1 nodes): `RestaurantsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 239`** (1 nodes): `RestaurantsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 240`** (1 nodes): `RestaurantsService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 241`** (1 nodes): `RobotRuntimeController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 242`** (1 nodes): `RobotRuntimeGateway`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 243`** (1 nodes): `RobotRuntimeModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 244`** (1 nodes): `RobotRuntimeModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 245`** (1 nodes): `RobotRuntimeService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 246`** (1 nodes): `RobotsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 247`** (1 nodes): `RobotsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 248`** (1 nodes): `AppController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 249`** (1 nodes): `AppModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 250`** (1 nodes): `AppModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 251`** (1 nodes): `AppService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 252`** (1 nodes): `JwtStrategy`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 253`** (1 nodes): `LocalStrategy`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 254`** (1 nodes): `TablesModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 255`** (1 nodes): `TablesModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 256`** (1 nodes): `TelemetryModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 257`** (1 nodes): `TelemetryModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 265`** (1 nodes): `UsersModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 278`** (1 nodes): `UploadModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 279`** (1 nodes): `UsersModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `AnalyticsController`, `AnalyticsModule`, `AnalyticsService` to the rest of the system?**
  _97 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.14 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._
- **Should `Community 5` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._
- **Should `Community 9` be split into smaller, more focused modules?**
  _Cohesion score 0.14 - nodes in this community are weakly interconnected._