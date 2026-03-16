import TelegramBot from "node-telegram-bot-api";


const TOKEN = "8058186832:AAGoD8b9Z0gsmJBszefcfEhiQ6RJYOOT8lY";
const CHAT_ID = "7326034201";

const bot = new TelegramBot(TOKEN, { polling: false });

export async function sendToTelegram(order) {
    let cartText = "";
    order.cart.forEach((item, idx) => {
        cartText += `${idx + 1}. 🍱 ${item.name} x ${item.quantity} = ${(item.price * item.quantity).toLocaleString()} so'm\n`;
    });

    const message = `
🔥 **YANGI BUYURTMA!**
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
👤 **Mijoz:** ${order.name}
📞 **Tel:** ${order.phone}
📍 **Manzil:** ${order.address}
⏰ **Buyurtma berildi:** ${order.orderCreatedAt}
🕒 **Yetkazish vaqti:** ${order.clientRequestedTime}
📦 **Tur:** ${order.deliveryType === 'delivery' ? '🚚 Yetkazib berish' : '🏃 Olib ketish'}
💬 <b>Izoh:</b> ${order.comment || "Izoh qoldirilmagan"} 
...
💳 **To'lov:** ${order.paymentMethod.toUpperCase()}
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🛒 **Savatda:**
${cartText}
💰 **JAMI:** ${order.total.toLocaleString()} so'm
`;

    return bot.sendMessage(CHAT_ID, message, { parse_mode: "Markdown" });
}