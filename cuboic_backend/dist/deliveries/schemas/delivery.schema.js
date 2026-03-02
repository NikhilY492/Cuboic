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
exports.DeliverySchema = exports.Delivery = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
class DeliveryStop {
    order_id;
    table_id;
    cabinets;
    sequence;
    status;
    delivered_at;
}
let Delivery = class Delivery {
    restaurant_id;
    robot_id;
    stops;
    status;
};
exports.Delivery = Delivery;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Restaurant', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Delivery.prototype, "restaurant_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Robot', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Delivery.prototype, "robot_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                order_id: { type: mongoose_2.Types.ObjectId, ref: 'Order' },
                table_id: { type: mongoose_2.Types.ObjectId, ref: 'Table' },
                cabinets: [String],
                sequence: Number,
                status: { type: String, enum: ['Pending', 'Delivered'], default: 'Pending' },
                delivered_at: Date,
            },
        ],
        required: true,
    }),
    __metadata("design:type", Array)
], Delivery.prototype, "stops", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['InTransit', 'Completed', 'Cancelled'],
        default: 'InTransit',
    }),
    __metadata("design:type", String)
], Delivery.prototype, "status", void 0);
exports.Delivery = Delivery = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Delivery);
exports.DeliverySchema = mongoose_1.SchemaFactory.createForClass(Delivery);
//# sourceMappingURL=delivery.schema.js.map