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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemetryService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const robot_telemetry_schema_1 = require("./schemas/robot-telemetry.schema");
let TelemetryService = class TelemetryService {
    telemetryModel;
    constructor(telemetryModel) {
        this.telemetryModel = telemetryModel;
    }
    getLatest(robotId) {
        return this.telemetryModel
            .findOne({ robot_id: new mongoose_2.Types.ObjectId(robotId) })
            .sort({ recorded_at: -1 });
    }
    getHistory(robotId, limit = 50) {
        return this.telemetryModel
            .find({ robot_id: new mongoose_2.Types.ObjectId(robotId) })
            .sort({ recorded_at: -1 })
            .limit(limit);
    }
    async recordTelemetry(data) {
        return this.telemetryModel.create({
            robot_id: data.robotId,
            battery_level: data.battery,
            position: {
                x: data.location.x,
                y: data.location.y,
                z: 0,
            },
            status: data.status ?? 'Idle',
            speed: data.speed ?? 0,
            recorded_at: new Date(),
        });
    }
};
exports.TelemetryService = TelemetryService;
exports.TelemetryService = TelemetryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(robot_telemetry_schema_1.RobotTelemetry.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TelemetryService);
//# sourceMappingURL=telemetry.service.js.map