"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RobotSchema = exports.Robot = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
class Cabinet {
    id;
    status;
}
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Cabinet.prototype, "id", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['Free', 'Occupied'],
        default: 'Free',
    }),
    __metadata("design:type", String)
], Cabinet.prototype, "status", void 0);
let Robot = class Robot {
    restaurant_id;
    name;
    secretKey;
    status;
    mode;
    currentDeliveryId;
    isOnline;
    lastSeen;
    battery;
    location;
    cabinets;
};
exports.Robot = Robot;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'Restaurant',
        required: true,
        index: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Robot.prototype, "restaurant_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Robot.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, select: false }),
    __metadata("design:type", String)
], Robot.prototype, "secretKey", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: [
            'Idle',
            'Assigned',
            'Delivering',
            'Returning',
            'Charging',
            'Error',
        ],
        default: 'Idle',
    }),
    __metadata("design:type", String)
], Robot.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['Automatic', 'Manual', 'Stopped'],
        default: 'Automatic',
    }),
    __metadata("design:type", String)
], Robot.prototype, "mode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Delivery', default: null }),
    __metadata("design:type", Object)
], Robot.prototype, "currentDeliveryId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Robot.prototype, "isOnline", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Robot.prototype, "lastSeen", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 100 }),
    __metadata("design:type", Number)
], Robot.prototype, "battery", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            x: { type: Number, default: 0 },
            y: { type: Number, default: 0 },
        },
    }),
    __metadata("design:type", Object)
], Robot.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                id: { type: String, required: true },
                status: {
                    type: String,
                    enum: ['Free', 'Occupied'],
                    default: 'Free',
                },
            },
        ],
        default: [
            { id: 'C1', status: 'Free' },
            { id: 'C2', status: 'Free' },
            { id: 'C3', status: 'Free' },
        ],
    }),
    __metadata("design:type", Array)
], Robot.prototype, "cabinets", void 0);
exports.Robot = Robot = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Robot);
exports.RobotSchema = mongoose_1.SchemaFactory.createForClass(Robot);
//# sourceMappingURL=robot.schema.js.map