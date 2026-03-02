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
exports.RobotTelemetrySchema = exports.RobotTelemetry = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let RobotTelemetry = class RobotTelemetry {
    robot_id;
    battery_level;
    position;
    status;
    speed;
    recorded_at;
};
exports.RobotTelemetry = RobotTelemetry;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Robot', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], RobotTelemetry.prototype, "robot_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], RobotTelemetry.prototype, "battery_level", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: { x: Number, y: Number, z: Number }, default: { x: 0, y: 0, z: 0 } }),
    __metadata("design:type", Object)
], RobotTelemetry.prototype, "position", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ['Idle', 'Delivering', 'Charging', 'Offline'] }),
    __metadata("design:type", String)
], RobotTelemetry.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], RobotTelemetry.prototype, "speed", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], RobotTelemetry.prototype, "recorded_at", void 0);
exports.RobotTelemetry = RobotTelemetry = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], RobotTelemetry);
exports.RobotTelemetrySchema = mongoose_1.SchemaFactory.createForClass(RobotTelemetry);
//# sourceMappingURL=robot-telemetry.schema.js.map