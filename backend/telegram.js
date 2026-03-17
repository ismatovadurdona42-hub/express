import express from "express";

import cors from "cors";

import dotenv from "dotenv";

import { sendToTelegram } from "./telegram.js";



dotenv.config();



const app = express();

app.use(cors());

app.use(express.json());



app.post("/order", async (req, res) => {

    try {

        const orderData = req.body;



        // Telegramga yuborish

        await sendToTelegram(orderData);



        res.status(200).json({ success: true });

    } catch (error) {

        console.error("Xatolik:", error);

        res.status(500).json({ success: false, message: error.message });

    }

});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`✅ Backend running on http://localhost:${PORT}`);

});

server.js

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