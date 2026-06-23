const axios = require('axios');

async function test() {
    try {
        const createRes = await axios.post('http://localhost:3000/orders', {
            restaurantId: "123",
            tableId: "table123",
            customerSessionId: "sess123",
            items: [{ itemId: "item1", quantity: 1 }]
        });
        const orderId = createRes.data.id;
        console.log("Created order:", orderId);

        const cancelRes = await axios.patch(`http://localhost:3000/orders/${orderId}/cancel`);
        console.log("Cancel successful:", cancelRes.data.status);
    } catch (e) {
        if (e.response) {
            console.error("Cancel failed with status:", e.response.status, e.response.data);
        } else {
            console.error("Cancel failed (no response):", e.message);
        }
    }
}

test();
