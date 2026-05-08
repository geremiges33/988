import { useParams, useNavigate, Link } from "react-router";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
import { useFavorites } from "../context/FavoritesContext";
import {
  ShoppingCart,
  Heart,
  ArrowLeft,
  Star,
  Package,
  Shield,
  AlertCircle,
  Recycle,
} from "lucide-react";
import { useState } from "react";
import { ProductCard } from "../components/ProductCard";
import { useLanguage } from "../context/LanguageContext";
import React from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

  .pd-root {
    min-height: 100vh;
    background: #ffffff;
    font-family: 'DM Sans', sans-serif;
    color: #1a2e1a;
  }

  .pd-root * {
    box-sizing: border-box;
  }

  .pd-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 400;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #3d7a3d;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: color 0.2s;
  }
  .pd-back-btn:hover { color: #1a2e1a; }

  .pd-container {
    max-width: 1160px;
    margin: 0 auto;
    padding: 0 32px;
  }

  .pd-top-bar {
    padding: 40px 0 32px;
  }

  .pd-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 56px;
    align-items: start;
  }

  @media (max-width: 768px) {
    .pd-grid { grid-template-columns: 1fr; gap: 32px; }
  }

  /* Image */
  .pd-image-wrap {
    border-radius: 4px;
    overflow: hidden;
    background: #f2f7f2;
    border: 1px solid #e0ece0;
  }
  .pd-image-wrap img {
    width: 100%;
    aspect-ratio: 1/1;
    object-fit: cover;
    display: block;
  }

  /* Info card */
  .pd-info {
    padding: 0;
  }

  .pd-category {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #3d7a3d;
    margin-bottom: 12px;
  }

  .pd-title {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(28px, 4vw, 42px);
    font-weight: 400;
    line-height: 1.1;
    color: #1a2e1a;
    margin: 0 0 20px;
  }

  /* Divider */
  .pd-divider {
    height: 1px;
    background: #e0ece0;
    margin: 20px 0;
  }

  /* Rating */
  .pd-rating {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
  }
  .pd-stars { display: flex; gap: 2px; }
  .pd-star { width: 14px; height: 14px; color: #3d7a3d; fill: #3d7a3d; }
  .pd-reviews { font-size: 13px; color: #7aaa7a; }

  /* Price */
  .pd-price-row {
    display: flex;
    align-items: baseline;
    gap: 14px;
    margin-bottom: 20px;
  }
  .pd-price {
    font-family: 'DM Serif Display', serif;
    font-size: 38px;
    color: #1a2e1a;
    letter-spacing: -0.01em;
  }
  .pd-original-price {
    font-size: 20px;
    color: #b0c8b0;
    text-decoration: line-through;
  }
  .pd-save-badge {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #ffffff;
    background: #3d7a3d;
    padding: 4px 10px;
    border-radius: 2px;
  }

  /* Description */
  .pd-description {
    font-size: 14px;
    font-weight: 300;
    line-height: 1.75;
    color: #5a7a5a;
    margin-bottom: 24px;
  }

  /* Details grid */
  .pd-details-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 24px;
  }
  .pd-detail-box {
    background: #f2f7f2;
    border-radius: 3px;
    padding: 14px 16px;
    border: 1px solid #e0ece0;
  }
  .pd-detail-label {
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #3d7a3d;
    margin-bottom: 4px;
  }
  .pd-detail-value {
    font-size: 14px;
    font-weight: 500;
    color: #1a2e1a;
  }

  /* Quantity */
  .pd-qty-label {
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #3d7a3d;
    margin-bottom: 12px;
  }
  .pd-qty-row {
    display: flex;
    align-items: center;
    gap: 0;
    margin-bottom: 28px;
    width: fit-content;
    border: 1px solid #c8dcc8;
    border-radius: 3px;
    overflow: hidden;
  }
  .pd-qty-btn {
    width: 42px;
    height: 42px;
    background: #f2f7f2;
    border: none;
    color: #3d7a3d;
    font-size: 18px;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .pd-qty-btn:hover { background: #e0ece0; color: #1a2e1a; }
  .pd-qty-num {
    width: 52px;
    text-align: center;
    font-size: 16px;
    font-weight: 500;
    color: #1a2e1a;
    background: #ffffff;
    border-left: 1px solid #c8dcc8;
    border-right: 1px solid #c8dcc8;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Buttons */
  .pd-actions {
    display: flex;
    gap: 10px;
    margin-bottom: 28px;
  }
  .pd-add-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 0 24px;
    height: 52px;
    border: none;
    border-radius: 3px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.25s;
  }
  .pd-add-btn.normal {
    background: #1a4d1a;
    color: #ffffff;
  }
  .pd-add-btn.normal:hover { background: #3d7a3d; }
  .pd-add-btn.added {
    background: #f2f7f2;
    color: #3d7a3d;
    border: 1px solid #3d7a3d;
  }

  .pd-fav-btn {
    width: 52px;
    height: 52px;
    background: #f2f7f2;
    border: 1px solid #c8dcc8;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
  }
  .pd-fav-btn:hover { background: #e0ece0; }
  .pd-fav-btn.active { border-color: #1a4d1a; background: #f2f7f2; }
  .pd-fav-icon { width: 18px; height: 18px; color: #7aaa7a; }
  .pd-fav-btn.active .pd-fav-icon { color: #1a4d1a; fill: #1a4d1a; }

  /* Features strip */
  .pd-features {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0;
    border: 1px solid #c8dcc8;
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 16px;
  }
  .pd-feature {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 16px 8px;
    background: #f2f7f2;
    font-size: 11px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #3d7a3d;
  }
  .pd-feature + .pd-feature {
    border-left: 1px solid #c8dcc8;
  }
  .pd-feature svg { width: 15px; height: 15px; }
  .pd-feature.warn { color: #b85c3a; background: #fff8f6; }
  .pd-feature.eco { color: #3d7a3d; }

  /* No-returns notice */
  .pd-notice {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    background: #fff8f6;
    border: 1px solid #f0d0c0;
    border-radius: 3px;
    padding: 14px 16px;
  }
  .pd-notice svg { width: 14px; height: 14px; color: #b85c3a; flex-shrink: 0; margin-top: 1px; }
  .pd-notice p {
    font-size: 12px;
    line-height: 1.6;
    color: #b85c3a;
    margin: 0;
  }
  .pd-notice strong { color: #8b3a20; }

  /* Related — full-width dark green section */
  .pd-related {
    margin-top: 80px;
    background: #0a1a0b;
    width: 100vw;
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
    padding: 0 0 64px;
  }
  .pd-related::before {
    content: '';
    display: block;
    height: 4px;
    background: linear-gradient(90deg, #1a4d1a, #3d7a3d, #7aaa7a, #3d7a3d, #1a4d1a);
  }
  .pd-related-inner {
    padding: 0 48px;
  }
  .pd-related-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding: 48px 0 36px;
  }
  .pd-related-title {
    font-family: 'DM Serif Display', serif;
    font-size: 36px;
    font-weight: 400;
    color: #f0ede8;
    margin: 0;
    line-height: 1.1;
  }
  .pd-related-subtitle {
    font-size: 11px;
    color: #5a9e5a;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    margin: 0 0 10px;
  }
  .pd-related-count {
    font-size: 13px;
    color: #3d7a3d;
    letter-spacing: 0.04em;
    padding-bottom: 6px;
  }
  .pd-related-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
  @media (max-width: 900px) {
    .pd-related-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 480px) {
    .pd-related-grid { grid-template-columns: 1fr; }
  }

  /* Dark-theme product card */
  .pd-rcard {
    background: #0f2410;
    border: 1px solid #1e3820;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    transition: border-color 0.2s, transform 0.2s;
    display: flex;
    flex-direction: column;
  }
  .pd-rcard:hover {
    border-color: #3d7a3d;
    transform: translateY(-4px);
  }
  .pd-rcard-img {
    width: 100%;
    aspect-ratio: 4/3;
    object-fit: cover;
    display: block;
    filter: brightness(0.92);
    transition: filter 0.2s;
  }
  .pd-rcard:hover .pd-rcard-img { filter: brightness(1); }
  .pd-rcard-body {
    padding: 20px 22px 22px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .pd-rcard-cat {
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #5a9e5a;
  }
  .pd-rcard-name {
    font-family: 'DM Serif Display', serif;
    font-size: 20px;
    font-weight: 400;
    color: #e8e4de;
    line-height: 1.25;
    margin: 0;
    flex: 1;
  }
  .pd-rcard-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 14px;
  }
  .pd-rcard-price {
    font-size: 22px;
    font-weight: 500;
    color: #f0ede8;
    font-family: 'DM Serif Display', serif;
  }
  .pd-rcard-orig {
    font-size: 14px;
    color: #3d5c3d;
    text-decoration: line-through;
    margin-left: 8px;
  }
  .pd-rcard-badge {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #0a1a0b;
    background: #5a9e5a;
    padding: 3px 8px;
    border-radius: 2px;
  }
  .pd-rcard-add {
    width: 40px;
    height: 40px;
    background: #1e3820;
    border: 1px solid #2e5230;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
    color: #7aaa7a;
  }
  .pd-rcard-add:hover { background: #3d7a3d; border-color: #3d7a3d; color: #fff; }
  .pd-rcard-add svg { width: 16px; height: 16px; }

  /* 404 */
  .pd-404 {
    min-height: 100vh;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    color: #1a2e1a;
    text-align: center;
  }
  .pd-404 a { color: #3d7a3d; text-decoration: none; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; }
  .pd-404 a:hover { text-decoration: underline; }
`;

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products } = useProducts();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { t } = useLanguage();
  const p = t.product;
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const product = products.find((prod) => prod.id === id);

  if (!product) {
    return (
      <div>
        <style>{styles}</style>
        <div className="pd-404">
          <div>
            <h2
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontWeight: 400,
                marginBottom: 20,
                color: "#1a2e1a",
              }}
            >
              Product not found
            </h2>
            <Link to="/shop">Return to shop</Link>
          </div>
        </div>
      </div>
    );
  }

  const relatedProducts = products
    .filter(
      (prod) => prod.category === product.category && prod.id !== product.id,
    )
    .slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  const fav = isFavorite(product.id);

  return (
    <>
      <style>{styles}</style>
      <div className="pd-root">
        <div className="pd-container">
          {/* Back */}
          <div className="pd-top-bar">
            <button className="pd-back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft style={{ width: 14, height: 14 }} />
              {p.backToShop}
            </button>
          </div>

          {/* Main grid */}
          <div className="pd-grid">
            {/* Image */}
            <div className="pd-image-wrap">
              <img src={product.imageUrl} alt={product.name} />
            </div>

            {/* Info */}
            <div className="pd-info">
              <div className="pd-category">{product.category}</div>
              <h1 className="pd-title">{product.name}</h1>

              {/* Rating */}
              <div className="pd-rating">
                <div className="pd-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="pd-star" />
                  ))}
                </div>
                <span className="pd-reviews">47 reviews</span>
              </div>

              <div className="pd-divider" />

              {/* Price */}
              <div className="pd-price-row">
                <span className="pd-price">₮{product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <>
                    <span className="pd-original-price">
                      ₮{product.originalPrice.toFixed(2)}
                    </span>
                    <span className="pd-save-badge">
                      −₮{ (product.originalPrice - product.price).toFixed(2) }
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="pd-description">{product.description}</p>

              {/* Details */}
              <div className="pd-details-grid">
                <div className="pd-detail-box">
                  <div className="pd-detail-label">Condition</div>
                  <div className="pd-detail-value">{product.condition}</div>
                </div>
                {product.size && (
                  <div className="pd-detail-box">
                    <div className="pd-detail-label">Size</div>
                    <div className="pd-detail-value">{product.size}</div>
                  </div>
                )}
              </div>

              {/* Quantity */}
              <div className="pd-qty-label">Quantity</div>
              <div className="pd-qty-row">
                <button
                  className="pd-qty-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  −
                </button>
                <div className="pd-qty-num">{quantity}</div>
                <button
                  className="pd-qty-btn"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>

              {/* Actions */}
              <div className="pd-actions">
                <button
                  className={`pd-add-btn ${justAdded ? "added" : "normal"}`}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart style={{ width: 16, height: 16 }} />
                  {justAdded ? p.addedToCart : p.addToCart}
                </button>
                <button
                  className={`pd-fav-btn ${fav ? "active" : ""}`}
                  onClick={() =>
                    fav
                      ? removeFromFavorites(product.id)
                      : addToFavorites(product)
                  }
                >
                  <Heart
                    className={`pd-fav-icon`}
                    style={fav ? { fill: "#7aaa7a" } : {}}
                  />
                </button>
              </div>

              {/* Feature strip */}
              <div className="pd-features">
                <div className="pd-feature eco">
                  <Package />
                  {p.inStock}
                </div>
                <div className="pd-feature warn">
                  <AlertCircle />
                  No Returns
                </div>
                <div className="pd-feature eco">
                  <Recycle />
                  {p.sustainableNote}
                </div>
              </div>

              {/* Notice */}
              <div className="pd-notice">
                <AlertCircle />
                <p>
                  <strong>❗️ БУЦААЛТ болон СОЛИЛТ БАЙХГҮЙ</strong> — All sales
                  final. No returns or exchanges accepted.
                </p>
              </div>
            </div>
          </div>

          {/* Related */}
          {relatedProducts.length > 0 && (
            <div className="pd-related">
              <div className="pd-related-inner">
                <div className="pd-related-header">
                  <div>
                    <p className="pd-related-subtitle">You may also like</p>
                    <h2 className="pd-related-title">{p.relatedTitle}</h2>
                  </div>
                  <span className="pd-related-count">
                    {relatedProducts.length} items
                  </span>
                </div>
                <div className="pd-related-grid">
                  {relatedProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="pd-rcard"
                      onClick={() => navigate("/product/" + prod.id)}
                    >
                      <img
                        className="pd-rcard-img"
                        src={prod.imageUrl}
                        alt={prod.name}
                      />
                      <div className="pd-rcard-body">
                        <span className="pd-rcard-cat">{prod.category}</span>
                        <p className="pd-rcard-name">{prod.name}</p>
                        <div className="pd-rcard-footer">
                          <div
                            style={{
                              display: "flex",
                              alignItems: "baseline",
                              gap: 6,
                            }}
                          >
                            <span className="pd-rcard-price">
                              ₮{prod.price}
                            </span>
                            {prod.originalPrice && (
                              <span className="pd-rcard-orig">
                                ₮{prod.originalPrice}
                              </span>
                            )}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            {prod.originalPrice && (
                              <span className="pd-rcard-badge">
                                −₮{prod.originalPrice - prod.price}
                              </span>
                            )}
                            <button
                              className="pd-rcard-add"
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(prod);
                              }}
                              title="Add to cart"
                            >
                              <ShoppingCart />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}