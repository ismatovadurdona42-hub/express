import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, useParams, Navigate } from "react-router-dom";
import "./style.css";

// 1. Mahsulotlar bazasi (Har bir mahsulot o'z kategoriyasiga ega)
const products = [
  // Nonushta
  { id: 1, name: "Blinchik go'shtli", price: 6000, category: "nonushta", image: "https://images.unsplash.com/photo-1517701604599-bb29b56509d1?w=400", desc: "Sifatli mol go'shtidan tayyorlangan mazali blinchik." },
  { id: 2, name: "Tuxum va Sosiska", price: 15000, category: "nonushta", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400", desc: "Klassik tonggi nonushta." },

  // Ovqatlar (Umumiy)
  { id: 3, name: "Sho'rva", price: 22000, category: "ovqatlar", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400", desc: "Issiq va to'yimli go'shtli sho'rva." },

  // Fast-food
  { id: 4, name: "Gamburger", price: 25000, category: "fast-food", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400", desc: "Maxsus sousli va yangi sabzavotli burger." },
  { id: 5, name: "Lavash", price: 28000, category: "fast-food", image: "https://images.unsplash.com/photo-1623156346149-d5bc8bd27094?w=400", desc: "Mol go'shtidan tayyorlangan issiq lavash." },

  // Tushlik
  { id: 6, name: "Osh (Palov)", price: 30000, category: "tushlik", image: "https://images.unsplash.com/photo-1512058560366-cd2427ff5961?w=400", desc: "Zirvakli, mayizli haqiqiy o'zbek oshi." },

  // Kechki ovqat
  { id: 7, name: "Steyk", price: 75000, category: "kechki-ovqat", image: "https://images.unsplash.com/photo-1546241072-48010ad28c2c?w=400", desc: "Olovda pishirilgan yumshoq mol go'shti." },

  // Ichimliklar
  { id: 8, name: "Coca-Cola 0.5L", price: 8000, category: "ichimliklar", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400", desc: "Muzdek tetiklashtiruvchi ichimlik." },
  { id: 9, name: "Kofe Americano", price: 12000, category: "ichimliklar", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400", desc: "Yangi maydalangan kofe donachalaridan." },

  // Shirinliklar
  { id: 10, name: "Medoviy tort", price: 15000, category: "shirinliklar", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400", desc: "Asalli va mayin kremdan tayyorlangan tort." },
];

// 2. Kategoriya navigatsiyasi uchun ro'yxat
const categories = [
  { id: "ovqatlar", label: "🍲 Ovqatlar" },
  { id: "nonushta", label: "🍳 Nonushta" },
  { id: "fast-food", label: "🍔 Fast-food" },
  { id: "tushlik", label: "🍱 Tushlik" },
  { id: "kechki-ovqat", label: "🌙 Kechki ovqat" },
  { id: "ichimliklar", label: "🥤 Ichimliklar" },
  { id: "shirinliklar", label: "🍰 Shirinliklar" },
];

// 3. Mahsulotlar Ro'yxati Komponenti
function ProductGrid({ addToCart, setSelectedProduct }) {
  const { categoryId } = useParams();
  const filtered = products.filter(p => p.category === categoryId);

  return (
    <div className="product-list">
      {filtered.length > 0 ? filtered.map((p) => (
        <div key={p.id} className="product" onClick={() => setSelectedProduct(p)}>
          <img src={p.image} alt={p.name} className="product-img" />
          <div className="p-details">
            <b>{p.name}</b>
            <span>{p.price.toLocaleString()} so'm</span>
          </div>
          <button className="add-btn" onClick={(e) => { e.stopPropagation(); addToCart(p); }}>+</button>
        </div>
      )) : <div className="empty-msg">Bu bo'limda mahsulotlar hozircha yo'q.</div>}
    </div>
  );
}

export default function App() {
  const [cart, setCart] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState("cart");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Form states
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

  const handleOrderSubmit = async () => {
    if (!name || !phone || (deliveryType === "delivery" && !address)) {
      return alert("Iltimos, barcha maydonlarni to'ldiring!");
    }

    const orderData = {
      name, phone, comment, paymentMethod, deliveryType, cart, total,
      address: deliveryType === "pickup" ? "Do'kondan olib ketish" : address,
      orderCreatedAt: new Date().toLocaleTimeString(),
      clientRequestedTime: requestedTime
    };

    try {
      const response = await fetch("http://localhost:5000/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        alert("Rahmat! Buyurtmangiz qabul qilindi.");
        setCart([]); setShowModal(false); setStep("cart");
      }
    } catch (e) {
      alert("Backend xatoligi!");
    }
  };

  return (
    <Router>
      <div className="app">
        <div className="header">Diet Bistro</div>

        {/* 4. Gorizontal suriluvchi menyu */}
        <div className="category-scroll">
          {categories.map((cat) => (
            <NavLink
              key={cat.id}
              to={`/category/${cat.id}`}
              className={({ isActive }) => isActive ? "nav-pill active" : "nav-pill"}
            >
              {cat.label}
            </NavLink>
          ))}
        </div>

        {/* 5. Yo'nalishlar */}
        <Routes>
          <Route path="/" element={<Navigate to="/category/ovqatlar" />} />
          <Route
            path="/category/:categoryId"
            element={<ProductGrid addToCart={addToCart} setSelectedProduct={setSelectedProduct} />}
          />
        </Routes>

        {/* 6. Savatcha tugmasi */}
        {cart.length > 0 && (
          <button className="order-btn-float" onClick={() => { setShowModal(true); setStep("cart"); }}>
            🛒 Savatcha — {total.toLocaleString()} so'm
          </button>
        )}

        {/* 7. MAHSULOT HAQIDA MA'LUMOT MODALI */}
        {selectedProduct && (
          <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
            <div className="modal modern detail-modal" onClick={e => e.stopPropagation()}>
              <img src={selectedProduct.image} className="detail-img" alt="" />
              <h2>{selectedProduct.name}</h2>
              <p className="detail-desc">{selectedProduct.desc}</p>
              <div className="detail-footer">
                <span className="detail-price">{selectedProduct.price.toLocaleString()} so'm</span>
                <button className="final-btn" onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}>
                  Savatga qo'shish
                </button>
              </div>
              <button className="back-link" onClick={() => setSelectedProduct(null)}>Yopish</button>
            </div>
          </div>
        )}

        {/* 8. BUYURTMA BERISH VA SAVATCHA MODALI */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal modern">
              <div className="modal-header">
                <h3>{step === "cart" ? "Savatcha" : "Yakunlash"}</h3>
                <span className="close" onClick={() => setShowModal(false)}>✕</span>
              </div>

              {step === "cart" ? (
                <div className="cart-content">
                  <div className="items-list">
                    {cart.map((item) => (
                      <div key={item.id} className="cart-item">
                        <div className="item-info">
                          <b>{item.name}</b>
                          <small>{(item.price * item.quantity).toLocaleString()} so'm</small>
                        </div>
                        <div className="cart-controls">
                          <button onClick={() => decreaseQty(item.id)}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => addToCart(item)}>+</button>
                          <button className="del-btn" onClick={() => removeFromCart(item.id)}>🗑</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="delivery-selection">
                    <p>Yetkazib berish usuli:</p>
                    <div className="delivery-toggle">
                      <button className={deliveryType === "delivery" ? "active" : ""} onClick={() => setDeliveryType("delivery")}>🚚 Kuryer</button>
                      <button className={deliveryType === "pickup" ? "active" : ""} onClick={() => setDeliveryType("pickup")}>🏃 Olib ketish</button>
                    </div>
                  </div>
                  <button className="next-btn" onClick={() => setStep("checkout")}>Keyingi qadam</button>
                </div>
              ) : (
                <div className="checkout-form">
                  <div className="input-group">
                    <div className="time-picker-box">
                      <label>Vaqtni tanlang:</label>
                      <div className="time-input-container">
                        <input type="time" className="custom-time-input"
                          value={requestedTime === "Tezroq" ? "" : requestedTime}
                          onChange={(e) => setRequestedTime(e.target.value)} />
                        <button type="button" className={`fast-btn ${requestedTime === "Tezroq" ? "active" : ""}`}
                          onClick={() => setRequestedTime("Tezroq")}>Hozir</button>
                      </div>
                    </div>
                    <input placeholder="Ismingiz" value={name} onChange={(e) => setName(e.target.value)} />
                    <input placeholder="Telefon" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    {deliveryType === "delivery" && (
                      <input placeholder="Manzil" value={address} onChange={(e) => setAddress(e.target.value)} />
                    )}
                    <textarea placeholder="Izoh (podyezd, uy...)" value={comment} onChange={(e) => setComment(e.target.value)} />
                  </div>
                  <div className="payment-options">
                    <button className={paymentMethod === "cash" ? "active" : ""} onClick={() => setPaymentMethod("cash")}>💵 Naqd</button>
                    <button className={paymentMethod === "payme" ? "active" : ""} onClick={() => setPaymentMethod("payme")}>💳 Payme</button>
                  </div>
                  <button className="final-btn" onClick={handleOrderSubmit}>Buyurtma berish</button>
                  <button className="back-link" onClick={() => setStep("cart")}>← Orqaga</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}