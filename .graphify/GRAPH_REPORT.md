# Graph Report - .  (2026-06-30)

## Corpus Check
- Corpus is ~44,321 words - fits in a single context window. You may not need a graph.

## Summary
- 1526 nodes · 1417 edges · 219 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output


## Input Scope
- Requested: auto
- Resolved: committed (source: default-auto)
- Included files: 24 · Candidates: 1710
- Excluded: 535 untracked · 151484 ignored · 0 sensitive · 536 missing committed
- Recommendation: Use --scope all or graphify.yaml inputs.corpus for a knowledge-base folder.

## Graph Freshness
- Built from Git commit: `078fbf2`
- Compare this hash to `git rev-parse HEAD` before trusting freshness-sensitive graph output.
## God Nodes (most connected - your core abstractions)
1. `OrdersService` - 22 edges
2. `OrdersController` - 19 edges
3. `InventoryService` - 14 edges
4. `UsersService` - 14 edges
5. `InventoryController` - 12 edges
6. `PrintersService` - 12 edges
7. `RobotWebRtcGateway` - 10 edges
8. `UsersController` - 10 edges
9. `MenuService` - 9 edges
10. `PrintersController` - 9 edges

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

### Community 9 - "Community 9"
Cohesion: 0.15
Nodes (16): cleanup_peer(), connect(), create_peer_connection(), disconnect(), get_player(), main(), on_answer(), on_auth_failed() (+8 more)

### Community 10 - "Community 10"
Cohesion: 0.17
Nodes (1): InventoryService

### Community 11 - "Community 11"
Cohesion: 0.18
Nodes (1): UsersService

### Community 12 - "Community 12"
Cohesion: 0.15
Nodes (2): pickImage(), uploadProfilePicture()

### Community 14 - "Community 14"
Cohesion: 0.15
Nodes (1): InventoryController

### Community 15 - "Community 15"
Cohesion: 0.23
Nodes (1): PrintersService

### Community 20 - "Community 20"
Cohesion: 0.18
Nodes (1): RobotWebRtcGateway

### Community 21 - "Community 21"
Cohesion: 0.18
Nodes (1): UsersController

### Community 23 - "Community 23"
Cohesion: 0.2
Nodes (1): useSocket()

### Community 24 - "Community 24"
Cohesion: 0.2
Nodes (1): useMutationQueue()

### Community 25 - "Community 25"
Cohesion: 0.2
Nodes (1): MenuService

### Community 26 - "Community 26"
Cohesion: 0.2
Nodes (1): PrintersController

### Community 28 - "Community 28"
Cohesion: 0.22
Nodes (1): AdminService

### Community 29 - "Community 29"
Cohesion: 0.31
Nodes (2): getDateRange(), localDate()

### Community 30 - "Community 30"
Cohesion: 0.36
Nodes (5): a(), c(), i(), o(), s()

### Community 32 - "Community 32"
Cohesion: 0.22
Nodes (1): MenuController

### Community 33 - "Community 33"
Cohesion: 0.22
Nodes (1): RestaurantsController

### Community 34 - "Community 34"
Cohesion: 0.22
Nodes (1): RobotsService

### Community 35 - "Community 35"
Cohesion: 0.22
Nodes (1): App()

### Community 36 - "Community 36"
Cohesion: 0.25
Nodes (2): getDateRange(), localDate()

### Community 37 - "Community 37"
Cohesion: 0.25
Nodes (2): closeModal(), handleSave()

### Community 38 - "Community 38"
Cohesion: 0.25
Nodes (2): buildTableSummaries(), getTableNum()

### Community 40 - "Community 40"
Cohesion: 0.25
Nodes (1): AdminController

### Community 42 - "Community 42"
Cohesion: 0.43
Nodes (7): adopt(), fulfilled(), generateSecretKey(), rejected(), seed(), step(), verb()

### Community 43 - "Community 43"
Cohesion: 0.29
Nodes (1): RecipesController

### Community 44 - "Community 44"
Cohesion: 0.29
Nodes (1): RestaurantsService

### Community 45 - "Community 45"
Cohesion: 0.25
Nodes (1): RobotRuntimeGateway

### Community 46 - "Community 46"
Cohesion: 0.39
Nodes (5): fetchInventory(), handleAddItem(), handleAdjust(), handleDeleteItem(), handleStockIn()

### Community 48 - "Community 48"
Cohesion: 0.32
Nodes (3): FormControl(), FormDescription(), useFormField()

### Community 49 - "Community 49"
Cohesion: 0.29
Nodes (1): AuthController

### Community 50 - "Community 50"
Cohesion: 0.29
Nodes (2): CategoriesController, CreateCategoryDto

### Community 51 - "Community 51"
Cohesion: 0.38
Nodes (4): fetchUnpaid(), handleSettleAll(), getCustomer(), setCustomer()

### Community 53 - "Community 53"
Cohesion: 0.29
Nodes (1): DeliveriesController

### Community 54 - "Community 54"
Cohesion: 0.29
Nodes (1): DeliveriesService

### Community 55 - "Community 55"
Cohesion: 0.29
Nodes (1): OutletsController

### Community 56 - "Community 56"
Cohesion: 0.29
Nodes (1): OutletsService

### Community 57 - "Community 57"
Cohesion: 0.29
Nodes (1): PlatformFeesService

### Community 58 - "Community 58"
Cohesion: 0.29
Nodes (1): RecipesService

### Community 59 - "Community 59"
Cohesion: 0.29
Nodes (1): RobotRuntimeService

### Community 60 - "Community 60"
Cohesion: 0.29
Nodes (1): SettingsController

### Community 61 - "Community 61"
Cohesion: 0.33
Nodes (1): SettingsService

### Community 62 - "Community 62"
Cohesion: 0.33
Nodes (2): handleSave(), loadOutlets()

### Community 68 - "Community 68"
Cohesion: 0.33
Nodes (1): AnalyticsController

### Community 69 - "Community 69"
Cohesion: 0.33
Nodes (1): AnalyticsService

### Community 70 - "Community 70"
Cohesion: 0.4
Nodes (1): AuthService

### Community 72 - "Community 72"
Cohesion: 0.33
Nodes (1): CustomersController

### Community 73 - "Community 73"
Cohesion: 0.33
Nodes (1): CustomersService

### Community 74 - "Community 74"
Cohesion: 0.53
Nodes (4): invoke(), off(), on(), send()

### Community 75 - "Community 75"
Cohesion: 0.33
Nodes (1): PlatformFeesController

### Community 76 - "Community 76"
Cohesion: 0.33
Nodes (1): TelemetryService

### Community 77 - "Community 77"
Cohesion: 0.53
Nodes (4): handleRoleDelete(), handleRoleSave(), handleStaffSave(), loadData()

### Community 80 - "Community 80"
Cohesion: 0.4
Nodes (1): AuditService

### Community 81 - "Community 81"
Cohesion: 0.4
Nodes (1): CategoriesService

### Community 85 - "Community 85"
Cohesion: 0.4
Nodes (1): PaymentsController

### Community 86 - "Community 86"
Cohesion: 0.4
Nodes (1): PaymentsService

### Community 87 - "Community 87"
Cohesion: 0.4
Nodes (1): RobotsController

### Community 88 - "Community 88"
Cohesion: 0.4
Nodes (1): TablesController

### Community 89 - "Community 89"
Cohesion: 0.4
Nodes (1): TablesService

### Community 90 - "Community 90"
Cohesion: 0.4
Nodes (1): TelemetryController

### Community 91 - "Community 91"
Cohesion: 0.5
Nodes (2): CarouselNext(), useCarousel()

### Community 92 - "Community 92"
Cohesion: 0.5
Nodes (1): AuditController

### Community 93 - "Community 93"
Cohesion: 0.5
Nodes (2): CategoriesController, CreateCategoryDto

### Community 94 - "Community 94"
Cohesion: 0.5
Nodes (1): DeliveriesController

### Community 95 - "Community 95"
Cohesion: 0.5
Nodes (1): DeliveriesService

### Community 96 - "Community 96"
Cohesion: 0.83
Nodes (3): convertName(), fixCase(), toTitleCase()

### Community 97 - "Community 97"
Cohesion: 0.67
Nodes (2): CreateDeliveryDto, DeliveryStopDto

### Community 98 - "Community 98"
Cohesion: 0.67
Nodes (2): CreateOrderDto, OrderItemDto

### Community 99 - "Community 99"
Cohesion: 0.67
Nodes (2): StockAdjustDto, StockInDto

### Community 100 - "Community 100"
Cohesion: 0.67
Nodes (2): RecipeIngredientDto, UpsertRecipeDto

### Community 101 - "Community 101"
Cohesion: 0.5
Nodes (1): AllExceptionsFilter

### Community 102 - "Community 102"
Cohesion: 0.5
Nodes (1): RolesGuard

### Community 103 - "Community 103"
Cohesion: 0.5
Nodes (1): MenuController

### Community 104 - "Community 104"
Cohesion: 0.5
Nodes (1): MenuService

### Community 105 - "Community 105"
Cohesion: 0.5
Nodes (1): RestaurantsService

### Community 106 - "Community 106"
Cohesion: 0.5
Nodes (1): RobotsController

### Community 107 - "Community 107"
Cohesion: 0.5
Nodes (1): RobotsService

### Community 108 - "Community 108"
Cohesion: 0.67
Nodes (2): generateSecretKey(), seed()

### Community 109 - "Community 109"
Cohesion: 0.83
Nodes (3): convertName(), fixCase(), toTitleCase()

### Community 110 - "Community 110"
Cohesion: 0.83
Nodes (3): fetchWikiImage(), getSearchTerm(), main()

### Community 111 - "Community 111"
Cohesion: 0.5
Nodes (1): AppController

### Community 112 - "Community 112"
Cohesion: 0.5
Nodes (1): JwtStrategy

### Community 113 - "Community 113"
Cohesion: 0.5
Nodes (1): LocalStrategy

### Community 114 - "Community 114"
Cohesion: 0.5
Nodes (1): PrismaService

### Community 121 - "Community 121"
Cohesion: 0.67
Nodes (1): CategoriesService

### Community 122 - "Community 122"
Cohesion: 0.67
Nodes (1): Roles()

### Community 123 - "Community 123"
Cohesion: 0.67
Nodes (2): CreateDeliveryDto, DeliveryStopDto

### Community 124 - "Community 124"
Cohesion: 0.67
Nodes (1): CreateInventoryItemDto

### Community 125 - "Community 125"
Cohesion: 0.67
Nodes (1): CreateMenuItemDto

### Community 126 - "Community 126"
Cohesion: 0.67
Nodes (2): CreateOrderDto, OrderItemDto

### Community 127 - "Community 127"
Cohesion: 0.67
Nodes (1): CreateOutletDto

### Community 128 - "Community 128"
Cohesion: 0.67
Nodes (1): CreateUserDto

### Community 129 - "Community 129"
Cohesion: 0.67
Nodes (1): LoginDto

### Community 130 - "Community 130"
Cohesion: 0.67
Nodes (1): QueryMenuDto

### Community 131 - "Community 131"
Cohesion: 0.67
Nodes (1): QueryPaymentDto

### Community 132 - "Community 132"
Cohesion: 0.67
Nodes (2): StockAdjustDto, StockInDto

### Community 133 - "Community 133"
Cohesion: 0.67
Nodes (1): UpdateMenuItemDto

### Community 134 - "Community 134"
Cohesion: 0.67
Nodes (1): UpdateOrderStatusDto

### Community 135 - "Community 135"
Cohesion: 0.67
Nodes (1): UpdateUserDto

### Community 136 - "Community 136"
Cohesion: 0.67
Nodes (2): RecipeIngredientDto, UpsertRecipeDto

### Community 137 - "Community 137"
Cohesion: 0.67
Nodes (1): EventsGateway

### Community 138 - "Community 138"
Cohesion: 0.67
Nodes (1): OptionalJwtAuthGuard

### Community 139 - "Community 139"
Cohesion: 0.67
Nodes (1): HealthController

### Community 140 - "Community 140"
Cohesion: 0.67
Nodes (1): InventoryConsumptionService

### Community 141 - "Community 141"
Cohesion: 0.67
Nodes (1): InventoryController

### Community 142 - "Community 142"
Cohesion: 0.67
Nodes (1): InventoryService

### Community 143 - "Community 143"
Cohesion: 0.67
Nodes (1): bootstrap()

### Community 144 - "Community 144"
Cohesion: 0.67
Nodes (1): OutletsController

### Community 145 - "Community 145"
Cohesion: 0.67
Nodes (1): OutletsService

### Community 146 - "Community 146"
Cohesion: 0.67
Nodes (1): TablesController

### Community 147 - "Community 147"
Cohesion: 0.67
Nodes (1): TablesService

### Community 148 - "Community 148"
Cohesion: 0.67
Nodes (1): TelemetryController

### Community 149 - "Community 149"
Cohesion: 0.67
Nodes (1): TelemetryService

### Community 150 - "Community 150"
Cohesion: 0.67
Nodes (1): UsersController

### Community 151 - "Community 151"
Cohesion: 0.67
Nodes (1): UsersService

### Community 152 - "Community 152"
Cohesion: 1
Nodes (2): restore(), toTitleCase()

### Community 153 - "Community 153"
Cohesion: 1
Nodes (2): main(), toTitleCase()

### Community 154 - "Community 154"
Cohesion: 0.67
Nodes (1): AppService

### Community 155 - "Community 155"
Cohesion: 0.67
Nodes (1): ParseObjectIdPipe

### Community 156 - "Community 156"
Cohesion: 0.67
Nodes (1): RobotRuntimeController

### Community 157 - "Community 157"
Cohesion: 0.67
Nodes (1): UploadController

### Community 158 - "Community 158"
Cohesion: 0.67
Nodes (1): test()

### Community 159 - "Community 159"
Cohesion: 1
Nodes (2): processDirectory(), processFile()

### Community 167 - "Community 167"
Cohesion: 1
Nodes (1): AdminModule

### Community 168 - "Community 168"
Cohesion: 1
Nodes (1): AnalyticsController

### Community 169 - "Community 169"
Cohesion: 1
Nodes (1): AnalyticsModule

### Community 170 - "Community 170"
Cohesion: 1
Nodes (1): AnalyticsModule

### Community 171 - "Community 171"
Cohesion: 1
Nodes (1): AnalyticsService

### Community 172 - "Community 172"
Cohesion: 1
Nodes (1): AuditModule

### Community 173 - "Community 173"
Cohesion: 1
Nodes (1): AuthController

### Community 174 - "Community 174"
Cohesion: 1
Nodes (1): AuthModule

### Community 175 - "Community 175"
Cohesion: 1
Nodes (1): AuthModule

### Community 176 - "Community 176"
Cohesion: 1
Nodes (1): AuthService

### Community 177 - "Community 177"
Cohesion: 1
Nodes (1): CategoriesModule

### Community 178 - "Community 178"
Cohesion: 1
Nodes (1): CategoriesModule

### Community 179 - "Community 179"
Cohesion: 1
Nodes (1): CustomersController

### Community 180 - "Community 180"
Cohesion: 1
Nodes (1): CustomersModule

### Community 181 - "Community 181"
Cohesion: 1
Nodes (1): CustomersModule

### Community 182 - "Community 182"
Cohesion: 1
Nodes (1): CustomersService

### Community 183 - "Community 183"
Cohesion: 1
Nodes (1): DeliveriesModule

### Community 184 - "Community 184"
Cohesion: 1
Nodes (1): DeliveriesModule

### Community 200 - "Community 200"
Cohesion: 1
Nodes (1): CreateInventoryItemDto

### Community 201 - "Community 201"
Cohesion: 1
Nodes (1): CreateMenuItemDto

### Community 202 - "Community 202"
Cohesion: 1
Nodes (1): CreateOutletDto

### Community 203 - "Community 203"
Cohesion: 1
Nodes (1): CreatePrinterDto

### Community 204 - "Community 204"
Cohesion: 1
Nodes (1): CreateUserDto

### Community 205 - "Community 205"
Cohesion: 1
Nodes (1): LoginDto

### Community 206 - "Community 206"
Cohesion: 1
Nodes (1): QueryMenuDto

### Community 207 - "Community 207"
Cohesion: 1
Nodes (1): QueryPaymentDto

### Community 208 - "Community 208"
Cohesion: 1
Nodes (1): UpdateMenuItemDto

### Community 209 - "Community 209"
Cohesion: 1
Nodes (1): UpdateOrderStatusDto

### Community 210 - "Community 210"
Cohesion: 1
Nodes (1): UpdatePrinterDto

### Community 211 - "Community 211"
Cohesion: 1
Nodes (1): UpdateSettingsDto

### Community 212 - "Community 212"
Cohesion: 1
Nodes (1): UpdateUserDto

### Community 214 - "Community 214"
Cohesion: 1
Nodes (1): EventsGateway

### Community 215 - "Community 215"
Cohesion: 1
Nodes (1): EventsModule

### Community 216 - "Community 216"
Cohesion: 1
Nodes (1): EventsModule

### Community 219 - "Community 219"
Cohesion: 1
Nodes (1): JwtAuthGuard

### Community 220 - "Community 220"
Cohesion: 1
Nodes (1): JwtAuthGuard

### Community 221 - "Community 221"
Cohesion: 1
Nodes (1): LocalAuthGuard

### Community 222 - "Community 222"
Cohesion: 1
Nodes (1): LocalAuthGuard

### Community 223 - "Community 223"
Cohesion: 1
Nodes (1): RolesGuard

### Community 224 - "Community 224"
Cohesion: 1
Nodes (1): HealthController

### Community 225 - "Community 225"
Cohesion: 1
Nodes (1): HealthModule

### Community 226 - "Community 226"
Cohesion: 1
Nodes (1): HealthModule

### Community 227 - "Community 227"
Cohesion: 1
Nodes (1): InventoryModule

### Community 228 - "Community 228"
Cohesion: 1
Nodes (1): InventoryModule

### Community 229 - "Community 229"
Cohesion: 1
Nodes (1): MenuModule

### Community 230 - "Community 230"
Cohesion: 1
Nodes (1): MenuModule

### Community 239 - "Community 239"
Cohesion: 1
Nodes (1): AppController

### Community 240 - "Community 240"
Cohesion: 1
Nodes (1): AppModule

### Community 241 - "Community 241"
Cohesion: 1
Nodes (1): AppService

### Community 242 - "Community 242"
Cohesion: 1
Nodes (1): JwtStrategy

### Community 243 - "Community 243"
Cohesion: 1
Nodes (1): LocalStrategy

### Community 244 - "Community 244"
Cohesion: 1
Nodes (1): ParseObjectIdPipe

### Community 245 - "Community 245"
Cohesion: 1
Nodes (1): OrdersController

### Community 246 - "Community 246"
Cohesion: 1
Nodes (1): OrdersModule

### Community 247 - "Community 247"
Cohesion: 1
Nodes (1): OrdersService

### Community 248 - "Community 248"
Cohesion: 1
Nodes (1): OutletsModule

### Community 249 - "Community 249"
Cohesion: 1
Nodes (1): PaymentsController

### Community 250 - "Community 250"
Cohesion: 1
Nodes (1): PaymentsModule

### Community 251 - "Community 251"
Cohesion: 1
Nodes (1): PaymentsService

### Community 252 - "Community 252"
Cohesion: 1
Nodes (1): PlatformFeesController

### Community 253 - "Community 253"
Cohesion: 1
Nodes (1): PlatformFeesModule

### Community 254 - "Community 254"
Cohesion: 1
Nodes (1): PlatformFeesService

### Community 255 - "Community 255"
Cohesion: 1
Nodes (1): PrismaModule

### Community 256 - "Community 256"
Cohesion: 1
Nodes (1): PrismaService

### Community 257 - "Community 257"
Cohesion: 1
Nodes (1): RecipesController

### Community 258 - "Community 258"
Cohesion: 1
Nodes (1): RecipesModule

### Community 259 - "Community 259"
Cohesion: 1
Nodes (1): RecipesService

### Community 260 - "Community 260"
Cohesion: 1
Nodes (1): RestaurantsController

### Community 261 - "Community 261"
Cohesion: 1
Nodes (1): RestaurantsModule

### Community 262 - "Community 262"
Cohesion: 1
Nodes (1): RobotRuntimeController

### Community 263 - "Community 263"
Cohesion: 1
Nodes (1): RobotRuntimeGateway

### Community 264 - "Community 264"
Cohesion: 1
Nodes (1): RobotRuntimeModule

### Community 265 - "Community 265"
Cohesion: 1
Nodes (1): RobotRuntimeService

### Community 266 - "Community 266"
Cohesion: 1
Nodes (1): RobotsModule

### Community 267 - "Community 267"
Cohesion: 1
Nodes (1): TablesModule

### Community 268 - "Community 268"
Cohesion: 1
Nodes (1): TelemetryModule

### Community 269 - "Community 269"
Cohesion: 1
Nodes (1): UsersModule

### Community 289 - "Community 289"
Cohesion: 1
Nodes (1): AppModule

### Community 290 - "Community 290"
Cohesion: 1
Nodes (1): OrdersModule

### Community 291 - "Community 291"
Cohesion: 1
Nodes (1): OutletsModule

### Community 292 - "Community 292"
Cohesion: 1
Nodes (1): PaymentsModule

### Community 293 - "Community 293"
Cohesion: 1
Nodes (1): PlatformFeesModule

### Community 294 - "Community 294"
Cohesion: 1
Nodes (1): PrintersModule

### Community 295 - "Community 295"
Cohesion: 1
Nodes (1): PrismaModule

### Community 296 - "Community 296"
Cohesion: 1
Nodes (1): RecipesModule

### Community 297 - "Community 297"
Cohesion: 1
Nodes (1): RestaurantsModule

### Community 298 - "Community 298"
Cohesion: 1
Nodes (1): RobotRuntimeModule

### Community 299 - "Community 299"
Cohesion: 1
Nodes (1): RobotWebRtcModule

### Community 300 - "Community 300"
Cohesion: 1
Nodes (1): RobotsModule

### Community 301 - "Community 301"
Cohesion: 1
Nodes (1): SettingsModule

### Community 302 - "Community 302"
Cohesion: 1
Nodes (1): TablesModule

### Community 303 - "Community 303"
Cohesion: 1
Nodes (1): TelemetryModule

### Community 304 - "Community 304"
Cohesion: 1
Nodes (1): UploadModule

### Community 305 - "Community 305"
Cohesion: 1
Nodes (1): UsersModule

## Knowledge Gaps
- **108 isolated node(s):** `Return a shared MediaPlayer for the camera.`, `Create and register a new RTCPeerConnection for a viewer.`, `A viewer has joined our room — initiate the offer.`, `Browser answered our offer — set the remote description.`, `ICE candidate from browser — forward to the correct peer connection.` (+103 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 2`** (1 nodes): `OrdersService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 4`** (1 nodes): `OrdersController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (1 nodes): `InventoryService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (1 nodes): `UsersService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (2 nodes): `pickImage()`, `uploadProfilePicture()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (1 nodes): `InventoryController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (1 nodes): `PrintersService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (1 nodes): `RobotWebRtcGateway`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (1 nodes): `UsersController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (1 nodes): `useSocket()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (1 nodes): `useMutationQueue()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (1 nodes): `MenuService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (1 nodes): `PrintersController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (1 nodes): `AdminService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (2 nodes): `getDateRange()`, `localDate()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (1 nodes): `MenuController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 33`** (1 nodes): `RestaurantsController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 34`** (1 nodes): `RobotsService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 35`** (1 nodes): `App()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 36`** (2 nodes): `getDateRange()`, `localDate()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (2 nodes): `closeModal()`, `handleSave()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 38`** (2 nodes): `buildTableSummaries()`, `getTableNum()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 40`** (1 nodes): `AdminController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 43`** (1 nodes): `RecipesController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 44`** (1 nodes): `RestaurantsService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 45`** (1 nodes): `RobotRuntimeGateway`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 49`** (1 nodes): `AuthController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 50`** (2 nodes): `CategoriesController`, `CreateCategoryDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 53`** (1 nodes): `DeliveriesController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 54`** (1 nodes): `DeliveriesService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 55`** (1 nodes): `OutletsController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 56`** (1 nodes): `OutletsService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 57`** (1 nodes): `PlatformFeesService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 58`** (1 nodes): `RecipesService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 59`** (1 nodes): `RobotRuntimeService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 60`** (1 nodes): `SettingsController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 61`** (1 nodes): `SettingsService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 62`** (2 nodes): `handleSave()`, `loadOutlets()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 68`** (1 nodes): `AnalyticsController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 69`** (1 nodes): `AnalyticsService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 70`** (1 nodes): `AuthService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 72`** (1 nodes): `CustomersController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 73`** (1 nodes): `CustomersService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 75`** (1 nodes): `PlatformFeesController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 76`** (1 nodes): `TelemetryService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 80`** (1 nodes): `AuditService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 81`** (1 nodes): `CategoriesService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 85`** (1 nodes): `PaymentsController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 86`** (1 nodes): `PaymentsService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 87`** (1 nodes): `RobotsController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 88`** (1 nodes): `TablesController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 89`** (1 nodes): `TablesService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 90`** (1 nodes): `TelemetryController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 91`** (2 nodes): `CarouselNext()`, `useCarousel()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 92`** (1 nodes): `AuditController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 93`** (2 nodes): `CategoriesController`, `CreateCategoryDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 94`** (1 nodes): `DeliveriesController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 95`** (1 nodes): `DeliveriesService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 97`** (2 nodes): `CreateDeliveryDto`, `DeliveryStopDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 98`** (2 nodes): `CreateOrderDto`, `OrderItemDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 99`** (2 nodes): `StockAdjustDto`, `StockInDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 100`** (2 nodes): `RecipeIngredientDto`, `UpsertRecipeDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 101`** (1 nodes): `AllExceptionsFilter`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 102`** (1 nodes): `RolesGuard`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 103`** (1 nodes): `MenuController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 104`** (1 nodes): `MenuService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 105`** (1 nodes): `RestaurantsService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 106`** (1 nodes): `RobotsController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 107`** (1 nodes): `RobotsService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 108`** (2 nodes): `generateSecretKey()`, `seed()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 111`** (1 nodes): `AppController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 112`** (1 nodes): `JwtStrategy`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 113`** (1 nodes): `LocalStrategy`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 114`** (1 nodes): `PrismaService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 121`** (1 nodes): `CategoriesService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 122`** (1 nodes): `Roles()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 123`** (2 nodes): `CreateDeliveryDto`, `DeliveryStopDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 124`** (1 nodes): `CreateInventoryItemDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 125`** (1 nodes): `CreateMenuItemDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 126`** (2 nodes): `CreateOrderDto`, `OrderItemDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 127`** (1 nodes): `CreateOutletDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 128`** (1 nodes): `CreateUserDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 129`** (1 nodes): `LoginDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 130`** (1 nodes): `QueryMenuDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 131`** (1 nodes): `QueryPaymentDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 132`** (2 nodes): `StockAdjustDto`, `StockInDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 133`** (1 nodes): `UpdateMenuItemDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 134`** (1 nodes): `UpdateOrderStatusDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 135`** (1 nodes): `UpdateUserDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 136`** (2 nodes): `RecipeIngredientDto`, `UpsertRecipeDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 137`** (1 nodes): `EventsGateway`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 138`** (1 nodes): `OptionalJwtAuthGuard`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 139`** (1 nodes): `HealthController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 140`** (1 nodes): `InventoryConsumptionService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 141`** (1 nodes): `InventoryController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 142`** (1 nodes): `InventoryService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 143`** (1 nodes): `bootstrap()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 144`** (1 nodes): `OutletsController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 145`** (1 nodes): `OutletsService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 146`** (1 nodes): `TablesController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 147`** (1 nodes): `TablesService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 148`** (1 nodes): `TelemetryController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 149`** (1 nodes): `TelemetryService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 150`** (1 nodes): `UsersController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 151`** (1 nodes): `UsersService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 152`** (2 nodes): `restore()`, `toTitleCase()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 153`** (2 nodes): `main()`, `toTitleCase()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 154`** (1 nodes): `AppService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 155`** (1 nodes): `ParseObjectIdPipe`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 156`** (1 nodes): `RobotRuntimeController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 157`** (1 nodes): `UploadController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 158`** (1 nodes): `test()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 159`** (2 nodes): `processDirectory()`, `processFile()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 167`** (1 nodes): `AdminModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 168`** (1 nodes): `AnalyticsController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 169`** (1 nodes): `AnalyticsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 170`** (1 nodes): `AnalyticsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 171`** (1 nodes): `AnalyticsService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 172`** (1 nodes): `AuditModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 173`** (1 nodes): `AuthController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 174`** (1 nodes): `AuthModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 175`** (1 nodes): `AuthModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 176`** (1 nodes): `AuthService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 177`** (1 nodes): `CategoriesModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 178`** (1 nodes): `CategoriesModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 179`** (1 nodes): `CustomersController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 180`** (1 nodes): `CustomersModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 181`** (1 nodes): `CustomersModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 182`** (1 nodes): `CustomersService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 183`** (1 nodes): `DeliveriesModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 184`** (1 nodes): `DeliveriesModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 200`** (1 nodes): `CreateInventoryItemDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 201`** (1 nodes): `CreateMenuItemDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 202`** (1 nodes): `CreateOutletDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 203`** (1 nodes): `CreatePrinterDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 204`** (1 nodes): `CreateUserDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 205`** (1 nodes): `LoginDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 206`** (1 nodes): `QueryMenuDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 207`** (1 nodes): `QueryPaymentDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 208`** (1 nodes): `UpdateMenuItemDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 209`** (1 nodes): `UpdateOrderStatusDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 210`** (1 nodes): `UpdatePrinterDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 211`** (1 nodes): `UpdateSettingsDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 212`** (1 nodes): `UpdateUserDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 214`** (1 nodes): `EventsGateway`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 215`** (1 nodes): `EventsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 216`** (1 nodes): `EventsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 219`** (1 nodes): `JwtAuthGuard`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 220`** (1 nodes): `JwtAuthGuard`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 221`** (1 nodes): `LocalAuthGuard`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 222`** (1 nodes): `LocalAuthGuard`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 223`** (1 nodes): `RolesGuard`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 224`** (1 nodes): `HealthController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 225`** (1 nodes): `HealthModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 226`** (1 nodes): `HealthModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 227`** (1 nodes): `InventoryModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 228`** (1 nodes): `InventoryModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 229`** (1 nodes): `MenuModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 230`** (1 nodes): `MenuModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 239`** (1 nodes): `AppController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 240`** (1 nodes): `AppModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 241`** (1 nodes): `AppService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 242`** (1 nodes): `JwtStrategy`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 243`** (1 nodes): `LocalStrategy`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 244`** (1 nodes): `ParseObjectIdPipe`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 245`** (1 nodes): `OrdersController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 246`** (1 nodes): `OrdersModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 247`** (1 nodes): `OrdersService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 248`** (1 nodes): `OutletsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 249`** (1 nodes): `PaymentsController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 250`** (1 nodes): `PaymentsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 251`** (1 nodes): `PaymentsService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 252`** (1 nodes): `PlatformFeesController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 253`** (1 nodes): `PlatformFeesModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 254`** (1 nodes): `PlatformFeesService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 255`** (1 nodes): `PrismaModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 256`** (1 nodes): `PrismaService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 257`** (1 nodes): `RecipesController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 258`** (1 nodes): `RecipesModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 259`** (1 nodes): `RecipesService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 260`** (1 nodes): `RestaurantsController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 261`** (1 nodes): `RestaurantsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 262`** (1 nodes): `RobotRuntimeController`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 263`** (1 nodes): `RobotRuntimeGateway`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 264`** (1 nodes): `RobotRuntimeModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 265`** (1 nodes): `RobotRuntimeService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 266`** (1 nodes): `RobotsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 267`** (1 nodes): `TablesModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 268`** (1 nodes): `TelemetryModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 269`** (1 nodes): `UsersModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 289`** (1 nodes): `AppModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 290`** (1 nodes): `OrdersModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 291`** (1 nodes): `OutletsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 292`** (1 nodes): `PaymentsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 293`** (1 nodes): `PlatformFeesModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 294`** (1 nodes): `PrintersModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 295`** (1 nodes): `PrismaModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 296`** (1 nodes): `RecipesModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 297`** (1 nodes): `RestaurantsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 298`** (1 nodes): `RobotRuntimeModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 299`** (1 nodes): `RobotWebRtcModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 300`** (1 nodes): `RobotsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 301`** (1 nodes): `SettingsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 302`** (1 nodes): `TablesModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 303`** (1 nodes): `TelemetryModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 304`** (1 nodes): `UploadModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 305`** (1 nodes): `UsersModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useMutationQueue()` connect `Community 24` to `Community 7`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **What connects `Return a shared MediaPlayer for the camera.`, `Create and register a new RTCPeerConnection for a viewer.`, `A viewer has joined our room — initiate the offer.` to the rest of the system?**
  _108 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._