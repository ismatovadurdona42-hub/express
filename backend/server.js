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