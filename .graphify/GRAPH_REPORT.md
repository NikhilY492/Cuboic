# Graph Report - .  (2026-10-11)

## Corpus Check
- Large corpus: 443 files · ~11,98,197 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder, or use --no-semantic to run AST-only.

## Summary
- 1687 nodes · 1559 edges · 229 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output


## Input Scope
- Requested: auto
- Resolved: committed (source: default-auto)
- Included files: 443 · Candidates: 1734
- Excluded: 8 untracked · 154820 ignored · 4 sensitive · 0 missing committed
- Recommendation: Use --scope all or graphify.yaml inputs.corpus for a knowledge-base folder.

## Graph Freshness
- Built from Git commit: `eeb077c`
- Compare this hash to `git rev-parse HEAD` before trusting freshness-sensitive graph output.
## God Nodes (most connected - your core abstractions)
1. `OrdersService` - 22 edges
2. `OrdersController` - 19 edges
3. `InventoryService` - 14 edges
4. `PrintersService` - 14 edges
5. `UsersService` - 14 edges
6. `InventoryController` - 13 edges
7. `RobotWebRtcGateway` - 10 edges
8. `UsersController` - 10 edges
9. `MenuController` - 9 edges
10. `MenuService` - 9 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities

### Community 2 - "Community 2"
Cohesion: 0.13
Nodes (1): OrdersService

### Community 4 - "Community 4"
Cohesion: 0.1
Nodes (1): OrdersController

### Community 6 - "Community 6"
Cohesion: 0.13
Nodes (7): goToCheckout(), handleAuthSuccess(), handleCheckoutInit(), handleOrderTypeSelect(), handleTableSelect(), proceedWithAuth(), proceedWithTableMove()

### Community 8 - "Community 8"
Cohesion: 0.15
Nodes (16): cleanup_peer(), connect(), create_peer_connection(), disconnect(), get_player(), main(), on_answer(), on_auth_failed() (+8 more)

### Community 9 - "Community 9"
Cohesion: 0.13
Nodes (1): useSocket()

### Community 11 - "Community 11"
Cohesion: 0.17
Nodes (1): InventoryService

### Community 12 - "Community 12"
Cohesion: 0.21
Nodes (1): PrintersService

### Community 13 - "Community 13"
Cohesion: 0.18
Nodes (1): UsersService

### Community 14 - "Community 14"
Cohesion: 0.13
Nodes (1): cn()

### Community 16 - "Community 16"
Cohesion: 0.15
Nodes (2): pickImage(), uploadProfilePicture()

### Community 17 - "Community 17"
Cohesion: 0.14
Nodes (1): InventoryController

### Community 22 - "Community 22"
Cohesion: 0.18
Nodes (1): useMutationQueue()

### Community 23 - "Community 23"
Cohesion: 0.18
Nodes (1): RobotWebRtcGateway

### Community 24 - "Community 24"
Cohesion: 0.18
Nodes (1): UsersController

### Community 26 - "Community 26"
Cohesion: 0.29
Nodes (9): category_modifier(), generate(), _generate_for_menu(), generate_hidden_ground_truth(), lambda_universal(t): breakfast/lunch/evening/dinner bumps. Same for     every it, The correction term. This is the part a cold-start model has to     infer for a, Training data: only the KNOWN menu. paneer_tikka_wrap never appears., The truth we're NOT allowed to look at when building the cold-start     estimate (+1 more)

### Community 27 - "Community 27"
Cohesion: 0.33
Nodes (6): a(), c(), executePrintJob(), i(), o(), s()

### Community 28 - "Community 28"
Cohesion: 0.29
Nodes (1): MenuController

### Community 29 - "Community 29"
Cohesion: 0.2
Nodes (1): MenuService

### Community 30 - "Community 30"
Cohesion: 0.2
Nodes (1): PrintersController

### Community 31 - "Community 31"
Cohesion: 0.2
Nodes (1): App()

### Community 33 - "Community 33"
Cohesion: 0.22
Nodes (1): AdminService

### Community 34 - "Community 34"
Cohesion: 0.31
Nodes (2): getDateRange(), localDate()

### Community 37 - "Community 37"
Cohesion: 0.22
Nodes (1): RestaurantsController

### Community 38 - "Community 38"
Cohesion: 0.22
Nodes (1): RobotsService

### Community 39 - "Community 39"
Cohesion: 0.33
Nodes (5): fetchInventory(), handleAddItem(), handleAdjust(), handleDeleteItem(), handleStockIn()

### Community 40 - "Community 40"
Cohesion: 0.25
Nodes (2): getDateRange(), localDate()

### Community 41 - "Community 41"
Cohesion: 0.25
Nodes (2): closeModal(), handleSave()

### Community 42 - "Community 42"
Cohesion: 0.25
Nodes (2): buildTableSummaries(), getTableNum()

### Community 44 - "Community 44"
Cohesion: 0.25
Nodes (1): AdminController

### Community 46 - "Community 46"
Cohesion: 0.43
Nodes (7): adopt(), fulfilled(), generateSecretKey(), rejected(), seed(), step(), verb()

### Community 47 - "Community 47"
Cohesion: 0.39
Nodes (7): cold_start_prediction(), item_feature_vector(), item_popularity_share(), known_item_hourly_shapes(), The actual test: we generated the hidden item ourselves, so we know     its true, similarity(), validate_cold_start()

### Community 48 - "Community 48"
Cohesion: 0.29
Nodes (1): RecipesController

### Community 49 - "Community 49"
Cohesion: 0.29
Nodes (1): RestaurantsService

### Community 50 - "Community 50"
Cohesion: 0.25
Nodes (1): RobotRuntimeGateway

### Community 51 - "Community 51"
Cohesion: 0.29
Nodes (2): handleSave(), loadOutlets()

### Community 53 - "Community 53"
Cohesion: 0.32
Nodes (3): FormControl(), FormDescription(), useFormField()

### Community 54 - "Community 54"
Cohesion: 0.29
Nodes (1): AuthController

### Community 55 - "Community 55"
Cohesion: 0.29
Nodes (2): CategoriesController, CreateCategoryDto

### Community 56 - "Community 56"
Cohesion: 0.38
Nodes (4): fetchUnpaid(), handleSettleAll(), getCustomer(), setCustomer()

### Community 58 - "Community 58"
Cohesion: 0.29
Nodes (1): DeliveriesController

### Community 59 - "Community 59"
Cohesion: 0.29
Nodes (1): DeliveriesService

### Community 60 - "Community 60"
Cohesion: 0.29
Nodes (1): OutletsController

### Community 61 - "Community 61"
Cohesion: 0.29
Nodes (1): OutletsService

### Community 62 - "Community 62"
Cohesion: 0.29
Nodes (1): PlatformFeesService

### Community 63 - "Community 63"
Cohesion: 0.29
Nodes (1): RecipesService

### Community 64 - "Community 64"
Cohesion: 0.29
Nodes (1): RobotRuntimeService

### Community 65 - "Community 65"
Cohesion: 0.29
Nodes (1): SettingsController

### Community 66 - "Community 66"
Cohesion: 0.33
Nodes (1): SettingsService

### Community 72 - "Community 72"
Cohesion: 0.33
Nodes (1): AnalyticsController

### Community 73 - "Community 73"
Cohesion: 0.33
Nodes (1): AnalyticsService

### Community 74 - "Community 74"
Cohesion: 0.4
Nodes (1): AuthService

### Community 75 - "Community 75"
Cohesion: 0.33
Nodes (1): CustomersController

### Community 76 - "Community 76"
Cohesion: 0.33
Nodes (1): CustomersService

### Community 77 - "Community 77"
Cohesion: 0.53
Nodes (4): invoke(), off(), on(), send()

### Community 78 - "Community 78"
Cohesion: 0.33
Nodes (1): PlatformFeesController

### Community 79 - "Community 79"
Cohesion: 0.33
Nodes (1): TelemetryService

### Community 80 - "Community 80"
Cohesion: 0.53
Nodes (4): handleRoleDelete(), handleRoleSave(), handleStaffSave(), loadData()

### Community 83 - "Community 83"
Cohesion: 0.4
Nodes (1): AuditService

### Community 84 - "Community 84"
Cohesion: 0.4
Nodes (1): CategoriesService

### Community 89 - "Community 89"
Cohesion: 0.4
Nodes (1): PaymentsController

### Community 90 - "Community 90"
Cohesion: 0.4
Nodes (1): PaymentsService

### Community 91 - "Community 91"
Cohesion: 0.4
Nodes (1): RobotsController

### Community 92 - "Community 92"
Cohesion: 0.4
Nodes (1): TablesController

### Community 93 - "Community 93"
Cohesion: 0.4
Nodes (1): TablesService

### Community 94 - "Community 94"
Cohesion: 0.4
Nodes (1): TelemetryController

### Community 95 - "Community 95"
Cohesion: 0.5
Nodes (2): CarouselNext(), useCarousel()

### Community 96 - "Community 96"
Cohesion: 0.5
Nodes (1): AuditController

### Community 97 - "Community 97"
Cohesion: 0.5
Nodes (2): CategoriesController, CreateCategoryDto

### Community 98 - "Community 98"
Cohesion: 0.67
Nodes (2): add_cyclical(), build_daily_table()

### Community 99 - "Community 99"
Cohesion: 0.5
Nodes (1): DeliveriesController

### Community 100 - "Community 100"
Cohesion: 0.5
Nodes (1): DeliveriesService

### Community 101 - "Community 101"
Cohesion: 0.83
Nodes (3): convertName(), fixCase(), toTitleCase()

### Community 102 - "Community 102"
Cohesion: 0.67
Nodes (2): CreateDeliveryDto, DeliveryStopDto

### Community 103 - "Community 103"
Cohesion: 0.67
Nodes (2): CreateOrderDto, OrderItemDto

### Community 104 - "Community 104"
Cohesion: 0.67
Nodes (2): StockAdjustDto, StockInDto

### Community 105 - "Community 105"
Cohesion: 0.67
Nodes (2): RecipeIngredientDto, UpsertRecipeDto

### Community 106 - "Community 106"
Cohesion: 0.5
Nodes (1): AllExceptionsFilter

### Community 107 - "Community 107"
Cohesion: 0.5
Nodes (1): RolesGuard

### Community 108 - "Community 108"
Cohesion: 0.5
Nodes (1): InventoryForecastService

### Community 109 - "Community 109"
Cohesion: 0.5
Nodes (1): MenuController

### Community 110 - "Community 110"
Cohesion: 0.5
Nodes (1): MenuService

### Community 112 - "Community 112"
Cohesion: 0.5
Nodes (1): RestaurantsService

### Community 113 - "Community 113"
Cohesion: 0.5
Nodes (1): RobotsController

### Community 114 - "Community 114"
Cohesion: 0.5
Nodes (1): RobotsService

### Community 115 - "Community 115"
Cohesion: 0.67
Nodes (2): generateSecretKey(), seed()

### Community 116 - "Community 116"
Cohesion: 0.83
Nodes (3): convertName(), fixCase(), toTitleCase()

### Community 117 - "Community 117"
Cohesion: 0.83
Nodes (3): convertName(), fixCase(), toTitleCase()

### Community 118 - "Community 118"
Cohesion: 0.83
Nodes (3): fetchWikiImage(), getSearchTerm(), main()

### Community 119 - "Community 119"
Cohesion: 0.5
Nodes (1): AppController

### Community 120 - "Community 120"
Cohesion: 0.5
Nodes (1): JwtStrategy

### Community 121 - "Community 121"
Cohesion: 0.5
Nodes (1): LocalStrategy

### Community 122 - "Community 122"
Cohesion: 0.5
Nodes (1): PrismaService

### Community 129 - "Community 129"
Cohesion: 1
Nodes (2): makeAtHour(), makeOrder()

### Community 130 - "Community 130"
Cohesion: 0.67
Nodes (1): CategoriesService

### Community 131 - "Community 131"
Cohesion: 1
Nodes (2): main(), make_plots()

### Community 132 - "Community 132"
Cohesion: 0.67
Nodes (1): Roles()

### Community 133 - "Community 133"
Cohesion: 0.67
Nodes (2): CreateDeliveryDto, DeliveryStopDto

### Community 134 - "Community 134"
Cohesion: 0.67
Nodes (1): CreateInventoryItemDto

### Community 135 - "Community 135"
Cohesion: 0.67
Nodes (1): CreateMenuItemDto

### Community 136 - "Community 136"
Cohesion: 0.67
Nodes (2): CreateOrderDto, OrderItemDto

### Community 137 - "Community 137"
Cohesion: 0.67
Nodes (1): CreateOutletDto

### Community 138 - "Community 138"
Cohesion: 0.67
Nodes (1): CreateUserDto

### Community 139 - "Community 139"
Cohesion: 0.67
Nodes (1): LoginDto

### Community 140 - "Community 140"
Cohesion: 0.67
Nodes (1): QueryMenuDto

### Community 141 - "Community 141"
Cohesion: 0.67
Nodes (1): QueryPaymentDto

### Community 142 - "Community 142"
Cohesion: 0.67
Nodes (2): StockAdjustDto, StockInDto

### Community 143 - "Community 143"
Cohesion: 0.67
Nodes (1): UpdateMenuItemDto

### Community 144 - "Community 144"
Cohesion: 0.67
Nodes (1): UpdateOrderStatusDto

### Community 145 - "Community 145"
Cohesion: 0.67
Nodes (1): UpdateUserDto

### Community 146 - "Community 146"
Cohesion: 0.67
Nodes (2): RecipeIngredientDto, UpsertRecipeDto

### Community 148 - "Community 148"
Cohesion: 0.67
Nodes (1): EventsGateway

### Community 149 - "Community 149"
Cohesion: 0.67
Nodes (1): OptionalJwtAuthGuard

### Community 150 - "Community 150"
Cohesion: 0.67
Nodes (1): HealthController

### Community 151 - "Community 151"
Cohesion: 0.67
Nodes (1): InventoryConsumptionService

### Community 152 - "Community 152"
Cohesion: 0.67
Nodes (1): InventoryController

### Community 153 - "Community 153"
Cohesion: 0.67
Nodes (1): InventoryService

### Community 156 - "Community 156"
Cohesion: 0.67
Nodes (1): bootstrap()

### Community 157 - "Community 157"
Cohesion: 0.67
Nodes (1): OutletsController

### Community 158 - "Community 158"
Cohesion: 0.67
Nodes (1): OutletsService

### Community 159 - "Community 159"
Cohesion: 0.67
Nodes (1): TablesController

### Community 160 - "Community 160"
Cohesion: 0.67
Nodes (1): TablesService

### Community 161 - "Community 161"
Cohesion: 0.67
Nodes (1): TelemetryController

### Community 162 - "Community 162"
Cohesion: 0.67
Nodes (1): TelemetryService

### Community 163 - "Community 163"
Cohesion: 0.67
Nodes (1): UsersController

### Community 164 - "Community 164"
Cohesion: 0.67
Nodes (1): UsersService

### Community 165 - "Community 165"
Cohesion: 1
Nodes (2): restore(), toTitleCase()

### Community 166 - "Community 166"
Cohesion: 1
Nodes (2): main(), toTitleCase()

### Community 167 - "Community 167"
Cohesion: 1
Nodes (2): restore(), toTitleCase()

### Community 168 - "Community 168"
Cohesion: 0.67
Nodes (1): test()

### Community 169 - "Community 169"
Cohesion: 0.67
Nodes (1): AppService

### Community 170 - "Community 170"
Cohesion: 0.67
Nodes (1): ParseObjectIdPipe

### Community 173 - "Community 173"
Cohesion: 0.67
Nodes (1): RobotRuntimeController

### Community 174 - "Community 174"
Cohesion: 0.67
Nodes (1): UploadController

### Community 175 - "Community 175"
Cohesion: 0.67
Nodes (1): test()

### Community 176 - "Community 176"
Cohesion: 1
Nodes (2): processDirectory(), processFile()

### Community 184 - "Community 184"
Cohesion: 1
Nodes (1): AdminModule

### Community 185 - "Community 185"
Cohesion: 1
Nodes (1): AnalyticsController

### Community 186 - "Community 186"
Cohesion: 1
Nodes (1): AnalyticsModule

### Community 187 - "Community 187"
Cohesion: 1
Nodes (1): AnalyticsModule

### Community 188 - "Community 188"
Cohesion: 1
Nodes (1): AnalyticsService

### Community 189 - "Community 189"
Cohesion: 1
Nodes (1): AuditModule

### Community 190 - "Community 190"
Cohesion: 1
Nodes (1): AuthController

### Community 191 - "Community 191"
Cohesion: 1
Nodes (1): AuthModule

### Community 192 - "Community 192"
Cohesion: 1
Nodes (1): AuthModule

### Community 193 - "Community 193"
Cohesion: 1
Nodes (1): AuthService

### Community 194 - "Community 194"
Cohesion: 1
Nodes (1): CategoriesModule

### Community 195 - "Community 195"
Cohesion: 1
Nodes (1): CategoriesModule

### Community 196 - "Community 196"
Cohesion: 1
Nodes (1): CustomersController

### Community 197 - "Community 197"
Cohesion: 1
Nodes (1): CustomersModule

### Community 198 - "Community 198"
Cohesion: 1
Nodes (1): CustomersModule

### Community 199 - "Community 199"
Cohesion: 1
Nodes (1): CustomersService

### Community 200 - "Community 200"
Cohesion: 1
Nodes (1): DeliveriesModule

### Community 201 - "Community 201"
Cohesion: 1
Nodes (1): DeliveriesModule

### Community 217 - "Community 217"
Cohesion: 1
Nodes (1): CreateInventoryItemDto

### Community 218 - "Community 218"
Cohesion: 1
Nodes (1): CreateMenuItemDto

### Community 219 - "Community 219"
Cohesion: 1
Nodes (1): CreateOutletDto

### Community 220 - "Community 220"
Cohesion: 1
Nodes (1): CreatePrinterDto

### Community 221 - "Community 221"
Cohesion: 1
Nodes (1): CreateUserDto

### Community 222 - "Community 222"
Cohesion: 1
Nodes (1): LoginDto

### Community 223 - "Community 223"
Cohesion: 1
Nodes (1): QueryMenuDto

### Community 224 - "Community 224"
Cohesion: 1
Nodes (1): QueryPaymentDto

### Community 225 - "Community 225"
Cohesion: 1
Nodes (1): UpdateMenuItemDto

### Community 226 - "Community 226"
Cohesion: 1
Nodes (1): UpdateOrderStatusDto

### Community 227 - "Community 227"
Cohesion: 1
Nodes (1): UpdatePrinterDto

### Community 228 - "Community 228"
Cohesion: 1
Nodes (1): UpdateSettingsDto

### Community 229 - "Community 229"
Cohesion: 1
Nodes (1): UpdateUserDto

### Community 230 - "Community 230"
Cohesion: 1
Nodes (1): EventsGateway

### Community 231 - "Community 231"
Cohesion: 1
Nodes (1): EventsModule

### Community 232 - "Community 232"
Cohesion: 1
Nodes (1): EventsModule

### Community 235 - "Community 235"
Cohesion: 1
Nodes (1): JwtAuthGuard

### Community 236 - "Community 236"
Cohesion: 1
Nodes (1): JwtAuthGuard

### Community 237 - "Community 237"
Cohesion: 1
Nodes (1): LocalAuthGuard

### Community 238 - "Community 238"
Cohesion: 1
Nodes (1): LocalAuthGuard

### Community 239 - "Community 239"
Cohesion: 1
Nodes (1): RolesGuard

### Community 240 - "Community 240"
Cohesion: 1
Nodes (1): HealthController

### Community 241 - "Community 241"
Cohesion: 1
Nodes (1): HealthModule

### Community 242 - "Community 242"
Cohesion: 1
Nodes (1): HealthModule

### Community 243 - "Community 243"
Cohesion: 1
Nodes (1): InventoryModule

### Community 244 - "Community 244"
Cohesion: 1
Nodes (1): InventoryModule

### Community 246 - "Community 246"
Cohesion: 1
Nodes (1): MenuModule

### Community 247 - "Community 247"
Cohesion: 1
Nodes (1): MenuModule

### Community 256 - "Community 256"
Cohesion: 1
Nodes (1): AppController

### Community 257 - "Community 257"
Cohesion: 1
Nodes (1): AppModule

### Community 258 - "Community 258"
Cohesion: 1
Nodes (1): AppService

### Community 259 - "Community 259"
Cohesion: 1
Nodes (1): JwtStrategy

### Community 260 - "Community 260"
Cohesion: 1
Nodes (1): LocalStrategy

### Community 261 - "Community 261"
Cohesion: 1
Nodes (1): ParseObjectIdPipe

### Community 262 - "Community 262"
Cohesion: 1
Nodes (1): OrdersController

### Community 263 - "Community 263"
Cohesion: 1
Nodes (1): OrdersModule

### Community 264 - "Community 264"
Cohesion: 1
Nodes (1): OrdersService

### Community 265 - "Community 265"
Cohesion: 1
Nodes (1): OutletsModule

### Community 266 - "Community 266"
Cohesion: 1
Nodes (1): PaymentsController

### Community 267 - "Community 267"
Cohesion: 1
Nodes (1): PaymentsModule

### Community 268 - "Community 268"
Cohesion: 1
Nodes (1): PaymentsService

### Community 269 - "Community 269"
Cohesion: 1
Nodes (1): PlatformFeesController

### Community 270 - "Community 270"
Cohesion: 1
Nodes (1): PlatformFeesModule

### Community 271 - "Community 271"
Cohesion: 1
Nodes (1): PlatformFeesService

### Community 272 - "Community 272"
Cohesion: 1
Nodes (1): PrismaModule

### Community 273 - "Community 273"
Cohesion: 1
Nodes (1): PrismaService

### Community 274 - "Community 274"
Cohesion: 1
Nodes (1): RecipesController

### Community 275 - "Community 275"
Cohesion: 1
Nodes (1): RecipesModule

### Community 276 - "Community 276"
Cohesion: 1
Nodes (1): RecipesService

### Community 277 - "Community 277"
Cohesion: 1
Nodes (1): RestaurantsController

### Community 278 - "Community 278"
Cohesion: 1
Nodes (1): RestaurantsModule

### Community 279 - "Community 279"
Cohesion: 1
Nodes (1): RobotRuntimeController

### Community 280 - "Community 280"
Cohesion: 1
Nodes (1): RobotRuntimeGateway

### Community 281 - "Community 281"
Cohesion: 1
Nodes (1): RobotRuntimeModule

### Community 282 - "Community 282"
Cohesion: 1
Nodes (1): RobotRuntimeService

### Community 283 - "Community 283"
Cohesion: 1
Nodes (1): RobotsModule

### Community 284 - "Community 284"
Cohesion: 1
Nodes (1): TablesModule

### Community 285 - "Community 285"
Cohesion: 1
Nodes (1): TelemetryModule

### Community 286 - "Community 286"
Cohesion: 1
Nodes (1): UsersModule

### Community 334 - "Community 334"
Cohesion: 1
Nodes (1): AppModule

### Community 335 - "Community 335"
Cohesion: 1
Nodes (1): OrdersModule

### Community 336 - "Community 336"
Cohesion: 1
Nodes (1): OutletsModule

### Community 337 - "Community 337"
Cohesion: 1
Nodes (1): PaymentsModule

### Community 338 - "Community 338"
Cohesion: 1
Nodes (1): PlatformFeesModule

### Community 339 - "Community 339"
Cohesion: 1
Nodes (1): PrintersModule

### Community 340 - "Community 340"
Cohesion: 1
Nodes (1): PrismaModule

### Community 341 - "Community 341"
Cohesion: 1
Nodes (1): RecipesModule

### Community 342 - "Community 342"
Cohesion: 1
Nodes (1): RestaurantsModule

### Community 343 - "Community 343"
Cohesion: 1
Nodes (1): RobotRuntimeModule

### Community 344 - "Community 344"
Cohesion: 1
Nodes (1): RobotWebRtcModule

### Community 345 - "Community 345"
Cohesion: 1
Nodes (1): RobotsModule

### Community 346 - "Community 346"
Cohesion: 1
Nodes (1): SettingsModule

### Community 347 - "Community 347"
Cohesion: 1
Nodes (1): TablesModule

### Community 348 - "Community 348"
Cohesion: 1
Nodes (1): TelemetryModule

### Community 349 - "Community 349"
Cohesion: 1
Nodes (1): UploadModule

### Community 350 - "Community 350"
Cohesion: 1
Nodes (1): UsersModule

## Knowledge Gaps
- **113 isolated node(s):** `AdminModule`, `AnalyticsModule`, `AppModule`, `AuditModule`, `AuthModule` (+108 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 2`** (1 nodes): `OrdersService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 4`** (1 nodes): `OrdersController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (1 nodes): `useSocket()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (1 nodes): `InventoryService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (1 nodes): `PrintersService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (1 nodes): `UsersService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (1 nodes): `cn()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (2 nodes): `pickImage()`, `uploadProfilePicture()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (1 nodes): `InventoryController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (1 nodes): `useMutationQueue()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (1 nodes): `RobotWebRtcGateway`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (1 nodes): `UsersController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (1 nodes): `MenuController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (1 nodes): `MenuService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (1 nodes): `PrintersController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (1 nodes): `App()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 33`** (1 nodes): `AdminService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 34`** (2 nodes): `getDateRange()`, `localDate()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (1 nodes): `RestaurantsController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 38`** (1 nodes): `RobotsService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 40`** (2 nodes): `getDateRange()`, `localDate()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 41`** (2 nodes): `closeModal()`, `handleSave()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 42`** (2 nodes): `buildTableSummaries()`, `getTableNum()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 44`** (1 nodes): `AdminController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 48`** (1 nodes): `RecipesController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 49`** (1 nodes): `RestaurantsService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 50`** (1 nodes): `RobotRuntimeGateway`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 51`** (2 nodes): `handleSave()`, `loadOutlets()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 54`** (1 nodes): `AuthController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 55`** (2 nodes): `CategoriesController`, `CreateCategoryDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 58`** (1 nodes): `DeliveriesController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 59`** (1 nodes): `DeliveriesService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 60`** (1 nodes): `OutletsController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 61`** (1 nodes): `OutletsService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 62`** (1 nodes): `PlatformFeesService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 63`** (1 nodes): `RecipesService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 64`** (1 nodes): `RobotRuntimeService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 65`** (1 nodes): `SettingsController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 66`** (1 nodes): `SettingsService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 72`** (1 nodes): `AnalyticsController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 73`** (1 nodes): `AnalyticsService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 74`** (1 nodes): `AuthService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 75`** (1 nodes): `CustomersController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 76`** (1 nodes): `CustomersService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 78`** (1 nodes): `PlatformFeesController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 79`** (1 nodes): `TelemetryService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 83`** (1 nodes): `AuditService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 84`** (1 nodes): `CategoriesService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 89`** (1 nodes): `PaymentsController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 90`** (1 nodes): `PaymentsService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 91`** (1 nodes): `RobotsController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 92`** (1 nodes): `TablesController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 93`** (1 nodes): `TablesService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 94`** (1 nodes): `TelemetryController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 95`** (2 nodes): `CarouselNext()`, `useCarousel()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 96`** (1 nodes): `AuditController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 97`** (2 nodes): `CategoriesController`, `CreateCategoryDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 98`** (2 nodes): `add_cyclical()`, `build_daily_table()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 99`** (1 nodes): `DeliveriesController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 100`** (1 nodes): `DeliveriesService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 102`** (2 nodes): `CreateDeliveryDto`, `DeliveryStopDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 103`** (2 nodes): `CreateOrderDto`, `OrderItemDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 104`** (2 nodes): `StockAdjustDto`, `StockInDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 105`** (2 nodes): `RecipeIngredientDto`, `UpsertRecipeDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 106`** (1 nodes): `AllExceptionsFilter`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 107`** (1 nodes): `RolesGuard`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 108`** (1 nodes): `InventoryForecastService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 109`** (1 nodes): `MenuController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 110`** (1 nodes): `MenuService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 112`** (1 nodes): `RestaurantsService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 113`** (1 nodes): `RobotsController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 114`** (1 nodes): `RobotsService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 115`** (2 nodes): `generateSecretKey()`, `seed()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 119`** (1 nodes): `AppController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 120`** (1 nodes): `JwtStrategy`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 121`** (1 nodes): `LocalStrategy`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 122`** (1 nodes): `PrismaService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 129`** (2 nodes): `makeAtHour()`, `makeOrder()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 130`** (1 nodes): `CategoriesService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 131`** (2 nodes): `main()`, `make_plots()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 132`** (1 nodes): `Roles()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 133`** (2 nodes): `CreateDeliveryDto`, `DeliveryStopDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 134`** (1 nodes): `CreateInventoryItemDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 135`** (1 nodes): `CreateMenuItemDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 136`** (2 nodes): `CreateOrderDto`, `OrderItemDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 137`** (1 nodes): `CreateOutletDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 138`** (1 nodes): `CreateUserDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 139`** (1 nodes): `LoginDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 140`** (1 nodes): `QueryMenuDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 141`** (1 nodes): `QueryPaymentDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 142`** (2 nodes): `StockAdjustDto`, `StockInDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 143`** (1 nodes): `UpdateMenuItemDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 144`** (1 nodes): `UpdateOrderStatusDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 145`** (1 nodes): `UpdateUserDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 146`** (2 nodes): `RecipeIngredientDto`, `UpsertRecipeDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 148`** (1 nodes): `EventsGateway`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 149`** (1 nodes): `OptionalJwtAuthGuard`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 150`** (1 nodes): `HealthController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 151`** (1 nodes): `InventoryConsumptionService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 152`** (1 nodes): `InventoryController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 153`** (1 nodes): `InventoryService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 156`** (1 nodes): `bootstrap()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 157`** (1 nodes): `OutletsController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 158`** (1 nodes): `OutletsService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 159`** (1 nodes): `TablesController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 160`** (1 nodes): `TablesService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 161`** (1 nodes): `TelemetryController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 162`** (1 nodes): `TelemetryService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 163`** (1 nodes): `UsersController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 164`** (1 nodes): `UsersService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 165`** (2 nodes): `restore()`, `toTitleCase()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 166`** (2 nodes): `main()`, `toTitleCase()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 167`** (2 nodes): `restore()`, `toTitleCase()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 168`** (1 nodes): `test()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 169`** (1 nodes): `AppService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 170`** (1 nodes): `ParseObjectIdPipe`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 173`** (1 nodes): `RobotRuntimeController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 174`** (1 nodes): `UploadController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 175`** (1 nodes): `test()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 176`** (2 nodes): `processDirectory()`, `processFile()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 184`** (1 nodes): `AdminModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 185`** (1 nodes): `AnalyticsController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 186`** (1 nodes): `AnalyticsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 187`** (1 nodes): `AnalyticsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 188`** (1 nodes): `AnalyticsService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 189`** (1 nodes): `AuditModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 190`** (1 nodes): `AuthController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 191`** (1 nodes): `AuthModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 192`** (1 nodes): `AuthModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 193`** (1 nodes): `AuthService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 194`** (1 nodes): `CategoriesModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 195`** (1 nodes): `CategoriesModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 196`** (1 nodes): `CustomersController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 197`** (1 nodes): `CustomersModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 198`** (1 nodes): `CustomersModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 199`** (1 nodes): `CustomersService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 200`** (1 nodes): `DeliveriesModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 201`** (1 nodes): `DeliveriesModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 217`** (1 nodes): `CreateInventoryItemDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 218`** (1 nodes): `CreateMenuItemDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 219`** (1 nodes): `CreateOutletDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 220`** (1 nodes): `CreatePrinterDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 221`** (1 nodes): `CreateUserDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 222`** (1 nodes): `LoginDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 223`** (1 nodes): `QueryMenuDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 224`** (1 nodes): `QueryPaymentDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 225`** (1 nodes): `UpdateMenuItemDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 226`** (1 nodes): `UpdateOrderStatusDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 227`** (1 nodes): `UpdatePrinterDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 228`** (1 nodes): `UpdateSettingsDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 229`** (1 nodes): `UpdateUserDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 230`** (1 nodes): `EventsGateway`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 231`** (1 nodes): `EventsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 232`** (1 nodes): `EventsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 235`** (1 nodes): `JwtAuthGuard`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 236`** (1 nodes): `JwtAuthGuard`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 237`** (1 nodes): `LocalAuthGuard`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 238`** (1 nodes): `LocalAuthGuard`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 239`** (1 nodes): `RolesGuard`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 240`** (1 nodes): `HealthController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 241`** (1 nodes): `HealthModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 242`** (1 nodes): `HealthModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 243`** (1 nodes): `InventoryModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 244`** (1 nodes): `InventoryModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 246`** (1 nodes): `MenuModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 247`** (1 nodes): `MenuModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 256`** (1 nodes): `AppController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 257`** (1 nodes): `AppModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 258`** (1 nodes): `AppService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 259`** (1 nodes): `JwtStrategy`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 260`** (1 nodes): `LocalStrategy`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 261`** (1 nodes): `ParseObjectIdPipe`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 262`** (1 nodes): `OrdersController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 263`** (1 nodes): `OrdersModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 264`** (1 nodes): `OrdersService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 265`** (1 nodes): `OutletsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 266`** (1 nodes): `PaymentsController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 267`** (1 nodes): `PaymentsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 268`** (1 nodes): `PaymentsService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 269`** (1 nodes): `PlatformFeesController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 270`** (1 nodes): `PlatformFeesModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 271`** (1 nodes): `PlatformFeesService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 272`** (1 nodes): `PrismaModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 273`** (1 nodes): `PrismaService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 274`** (1 nodes): `RecipesController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 275`** (1 nodes): `RecipesModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 276`** (1 nodes): `RecipesService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 277`** (1 nodes): `RestaurantsController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 278`** (1 nodes): `RestaurantsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 279`** (1 nodes): `RobotRuntimeController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 280`** (1 nodes): `RobotRuntimeGateway`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 281`** (1 nodes): `RobotRuntimeModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 282`** (1 nodes): `RobotRuntimeService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 283`** (1 nodes): `RobotsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 284`** (1 nodes): `TablesModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 285`** (1 nodes): `TelemetryModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 286`** (1 nodes): `UsersModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 334`** (1 nodes): `AppModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 335`** (1 nodes): `OrdersModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 336`** (1 nodes): `OutletsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 337`** (1 nodes): `PaymentsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 338`** (1 nodes): `PlatformFeesModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 339`** (1 nodes): `PrintersModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 340`** (1 nodes): `PrismaModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 341`** (1 nodes): `RecipesModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 342`** (1 nodes): `RestaurantsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 343`** (1 nodes): `RobotRuntimeModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 344`** (1 nodes): `RobotWebRtcModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 345`** (1 nodes): `RobotsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 346`** (1 nodes): `SettingsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 347`** (1 nodes): `TablesModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 348`** (1 nodes): `TelemetryModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 349`** (1 nodes): `UploadModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 350`** (1 nodes): `UsersModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useMutationQueue()` connect `Community 22` to `Community 3`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **What connects `AdminModule`, `AnalyticsModule`, `AppModule` to the rest of the system?**
  _113 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._