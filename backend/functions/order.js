import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import { sendToTelegram } from "../telegram.js"; // Yo'lni tekshiring

const app = express();
app.use(cors());
app.use(express.json());

// Diqqat: Yo'l /order emas, funksiya nomi bilan bir xil bo'lishi kerak
app.post("/.netlify/functions/order", async (req, res) => {
    try {
        const orderData = req.body;
        await sendToTelegram(orderData);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Xatolik:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

export const handler = serverless(app);