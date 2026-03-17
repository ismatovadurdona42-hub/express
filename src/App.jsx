import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, useParams, Navigate } from "react-router-dom";
import "./style.css";

// Mahsulotlar ro'yxati
const products = [
  { id: 1, name: "Blinchik go'shtli", price: 6000, category: "nonushta", image: "https://images.unsplash.com/photo-1517701604599-bb29b56509d1?w=400", desc: "Sifatli mol go'shtidan tayyorlangan mazali blinchik." },
  { id: 2, name: "Tuxum va Sosiska", price: 15000, category: "nonushta", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400", desc: "Klassik tonggi nonushta." },
  { id: 3, name: "Sho'rva", price: 22000, category: "ovqatlar", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400", desc: "Issiq va to'yimli go'shtli sho'rva." },
  { id: 4, name: "Gamburger", price: 25000, category: "fast-food", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400", desc: "Maxsus sousli va yangi sabzavotli burger." },
  { id: 5, name: "Lavash", price: 28000, category: "fast-food", image: "https://images.unsplash.com/photo-1623156346149-d5bc8bd27094?w=400", desc: "Mol go'shtidan tayyorlangan issiq lavash." },
  { id: 6, name: "Osh (Palov)", price: 30000, category: "tushlik", image: "https://images.unsplash.com/photo-1512058560366-cd2427ff5961?w=400", desc: "Zirvakli, mayizli haqiqiy o'zbek oshi." },
  { id: 7, name: "Steyk", price: 75000, category: "kechki-ovqat", image: "https://images.unsplash.com/photo-1546241072-48010ad28c2c?w=400", desc: "Olovda pishirilgan yumshoq mol go'shti." },
  { id: 8, name: "Coca-Cola 0.5L", price: 8000, category: "ichimliklar", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400", desc: "Muzdek tetiklashtiruvchi ichimlik." },
  { id: 10, name: "Medoviy tort", price: 15000, category: "shirinliklar", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400", desc: "Asalli va mayin kremdan tayyorlangan tort." },
];

const categories = [
  { id: "all", label: "🏠 Hammasi" },
  { id: "ovqatlar", label: "🍲 Ovqatlar" },
  { id: "nonushta", label: "🍳 Nonushta" },
  { id: "fast-food", label: "🍔 Fast-food" },
  { id: "ichimliklar", label: "🥤 Ichimliklar" },
];

function ProductGrid({ addToCart, setSelectedProduct }) {
  const { categoryId } = useParams();
  const filtered = categoryId === "all" || !categoryId
    ? products
    : products.filter(p => p.category === categoryId);

  return (
    <div className="product-list">
      {filtered.map((p) => (
        <div key={p.id} className="product-card" onClick={() => setSelectedProduct(p)}>
          <img src={p.image} alt={p.name} className="product-img" />
          <div className="p-details">
            <b className="p-name">{p.name}</b>
            <span className="p-price">{p.price.toLocaleString()} so'm</span>
          </div>
          <button className="add-btn" onClick={(e) => { e.stopPropagation(); addToCart(p); }}>+</button>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [cart, setCart] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState("cart");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Form statelari
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [deliveryType, setDeliveryType] = useState("delivery");
  const [requestedTime, setRequestedTime] = useState("Tezroq");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(cart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const decreaseQty = (id) => {
    setCart(cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 } : item
    ));
  };

  const removeFromCart = (id) => setCart(cart.filter((item) => item.id !== id));

  // BUYURTMA YUBORISH (TO'G'RIDAN-TO'G'RI TELEGRAMGA)
  const sendOrder = async () => {
    if (!name || !phone) {
      alert("Iltimos, ism va telefon raqamingizni kiriting!");
      return;
    }

    const TOKEN = "8058186832:AAGoD8b9Z0gsmJBszefcfEhiQ6RJYOOT8lY";
    const CHAT_ID = "7326034201";

    let cartText = "";
    cart.forEach((item, idx) => {
      cartText += `${idx + 1}. 🍱 <b>${item.name}</b> x ${item.quantity} = ${(item.price * item.quantity).toLocaleString()} so'm\n`;
    });

    const message = `
<b>🔥 YANGI BUYURTMA!</b>
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
👤 <b>Mijoz:</b> ${name}
📞 <b>Tel:</b> ${phone}
📍 <b>Manzil:</b> ${deliveryType === "delivery" ? address : "Olib ketish"}
🕒 <b>Vaqt:</b> ${requestedTime}
📦 <b>Tur:</b> ${deliveryType === 'delivery' ? '🚚 Yetkazib berish' : '🏃 Olib ketish'}
💬 <b>Izoh:</b> ${comment || "Izoh yo'q"}
💳 <b>To'lov:</b> ${paymentMethod.toUpperCase()}
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
🛒 <b>Savatda:</b>
${cartText}
💰 <b>JAMI:</b> <u>${total.toLocaleString()} so'm</u>
`;

    try {
      const response = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: "HTML"
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Buyurtmangiz muvaffaqiyatli yuborildi! ✅");
        setCart([]);
        setShowModal(false);
        setName(""); setPhone(""); setAddress(""); setComment("");
      } else {
        alert(`Xatolik: ${result.description} ❌`);
      }
    } catch (error) {
      console.error("Xato:", error);
      alert("Internet bilan ulanishda xatolik! ❌");
    }
  };

  return (
    <Router>
      <div className="app-container">
        <header>
          <h1 className="logo">Diet Bistro</h1>
          <nav className="category-scroll">
            {categories.map((cat) => (
              <NavLink key={cat.id} to={`/category/${cat.id}`} className={({ isActive }) => isActive ? "nav-pill active" : "nav-pill"}>
                {cat.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/category/all" />} />
            <Route path="/category/:categoryId" element={<ProductGrid addToCart={addToCart} setSelectedProduct={setSelectedProduct} />} />
          </Routes>
        </main>

        {cart.length > 0 && (
          <button className="order-btn-float" onClick={() => { setShowModal(true); setStep("cart"); }}>
            <span>🛒 Savatcha</span>
            <span>{total.toLocaleString()} so'm</span>
          </button>
        )}

        {/* Mahsulot detali modali */}
        {selectedProduct && (
          <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
              <img src={selectedProduct.image} style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '30px 30px 0 0' }} alt="" />
              <div style={{ padding: '25px' }}>
                <h2>{selectedProduct.name}</h2>
                <p style={{ color: '#94a3b8', margin: '15px 0' }}>{selectedProduct.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '22px', fontWeight: '800', color: '#ff007a' }}>{selectedProduct.price.toLocaleString()} so'm</span>
                  <button className="add-btn" style={{ width: 'auto', padding: '0 20px' }} onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}>Qo'shish</button>
                </div>
              </div>
              <button className="close-top" onClick={() => setSelectedProduct(null)}>✕</button>
            </div>
          </div>
        )}

        {/* Savatcha va Yakunlash modali */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <div className="modal-header">
                <h3>{step === "cart" ? "Savatcha" : "Yakunlash"}</h3>
                <span style={{ cursor: 'pointer', fontSize: '24px' }} onClick={() => setShowModal(false)}>✕</span>
              </div>

              {step === "cart" ? (
                <div style={{ padding: '0 20px 20px 20px' }}>
                  <div className="cart-list" style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '15px' }}>
                    {cart.map((item) => (
                      <div key={item.id} className="cart-row">
                        <div className="item-meta">
                          <b>{item.name}</b>
                          <small>{(item.price * item.quantity).toLocaleString()} so'm</small>
                        </div>
                        <div className="cart-actions">
                          <button onClick={() => decreaseQty(item.id)}>−</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => addToCart(item)}>+</button>
                          <button onClick={() => removeFromCart(item.id)} style={{ border: 'none', background: 'none' }}>🗑</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="toggle-group">
                    <button className={deliveryType === "delivery" ? "active" : ""} onClick={() => setDeliveryType("delivery")}>🚚 Kuryer</button>
                    <button className={deliveryType === "pickup" ? "active" : ""} onClick={() => setDeliveryType("pickup")}>🏃 Olib ketish</button>
                  </div>
                  <button className="action-primary-btn" onClick={() => setStep("checkout")}>Keyingi qadam</button>
                </div>
              ) : (
                <div style={{ padding: '0 20px 20px 20px' }}>
                  <div className="toggle-group" style={{ flexDirection: 'column', gap: '5px', marginBottom: '15px' }}>
                    <label style={{ fontSize: '14px', color: '#94a3b8' }}>Yetkazish vaqti:</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input type="time" className="modern-input" style={{ margin: 0, flex: 1 }} value={requestedTime === "Tezroq" ? "" : requestedTime} onChange={(e) => setRequestedTime(e.target.value)} />
                      <button className={`nav-pill ${requestedTime === "Tezroq" ? "active" : ""}`} style={{ borderRadius: '16px', margin: 0 }} onClick={() => setRequestedTime("Tezroq")}>Hozir</button>
                    </div>
                  </div>
                  <input className="modern-input" placeholder="Ismingiz" value={name} onChange={(e) => setName(e.target.value)} />
                  <input className="modern-input" placeholder="Telefon raqam" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  {deliveryType === "delivery" && <input className="modern-input" placeholder="Manzil" value={address} onChange={(e) => setAddress(e.target.value)} />}
                  <textarea className="modern-input" placeholder="Izoh..." value={comment} onChange={(e) => setComment(e.target.value)} />
                  <div className="payment-grid">
                    <button className={paymentMethod === "cash" ? "active" : ""} onClick={() => setPaymentMethod("cash")}>💵 Naqd</button>
                    <button className={paymentMethod === "payme" ? "active" : ""} onClick={() => setPaymentMethod("payme")}>💳 Payme</button>
                  </div>
                  <button className="action-primary-btn" onClick={sendOrder}>Buyurtma berish</button>
                  <button onClick={() => setStep("cart")} style={{ width: '100%', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', marginTop: '10px' }}>← Orqaga</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}