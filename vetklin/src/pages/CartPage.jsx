import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/CartPage.css';

function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [cartItems]);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      // Заглушка для API цымбик внимание обрати!!!!!
      // const response = await fetch('/api/cart');
      // const data = await response.json();
      // setCartItems(data.items);
      
      // Временные данные для демонстрации
      const demoItems = [
        {
          id: 1,
          item_id: 101,
          item_type: 'pet_food',
          price: 1200,
          quantity: 2
        },
        {
          id: 2,
          item_id: 202,
          item_type: 'pet_medicine',
          price: 450,
          quantity: 1
        }
      ];
      setCartItems(demoItems);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      showToast('Ошибка загрузки корзины', 'error');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotalPrice(total);
  };

  const updateQuantity = async (itemId, change) => {
    const item = cartItems.find(item => item.id === itemId);
    const newQuantity = item.quantity + change;

    if (newQuantity < 1) {
      removeCartItem(itemId);
      return;
    }

    try {
      setLoading(true);
      // Заглушка для API
      // Цымбик вот такая темка +- должна быть тут
      // const response = await fetch(`/api/cart/${itemId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ quantity: newQuantity })
      // });
      // const data = await response.json();
      
      setCartItems(cartItems.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
      showToast('Количество обновлено');
    } catch (error) {
      console.error('Error updating quantity:', error);
      showToast('Ошибка при обновлении количества', 'error');
    } finally {
      setLoading(false);
    }
  };

  const removeCartItem = async (itemId) => {
    if (!window.confirm('Удалить товар из корзины?')) return;

    try {
      setLoading(true);
      // Заглушка для API
      // ВНИМАНИЕ ОБРПАТИ ЦЫМБИК
      // const response = await fetch(`/api/cart/${itemId}`, { method: 'DELETE' });
      // const data = await response.json();
      
      setCartItems(cartItems.filter(item => item.id !== itemId));
      showToast('Товар удалён из корзины');
    } catch (error) {
      console.error('Error removing item:', error);
      showToast('Ошибка при удалении товара', 'error');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!window.confirm('Вы уверены, что хотите очистить корзину?')) return;

    try {
      setLoading(true);
      // Заглушка для API
      // ОБРАТИ ВНИМАНИЕ ЦЫМБИК
      // const response = await fetch('/api/cart', { method: 'DELETE' });
      // const data = await response.json();
      
      setCartItems([]);
      showToast('Корзина очищена');
    } catch (error) {
      console.error('Error clearing cart:', error);
      showToast('Ошибка при очистке корзины', 'error');
    } finally {
      setLoading(false);
    }
  };

  const checkout = async () => {
    try {
      setLoading(true);
      // Заглушка для API
      // ВНИМАНИЕ ОБРАТИ ЦЫБИК
      // const response = await fetch('/api/checkout', { method: 'POST' });
      // const data = await response.json();
      
      showToast('Заказ успешно оформлен');
      setTimeout(() => navigate('/catalog'), 2000);
    } catch (error) {
      console.error('Error during checkout:', error);
      showToast('Ошибка при оформлении заказа', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (loading && cartItems.length === 0) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <header className="cart-header">
        <h1>Ваша корзина</h1>
        <Link to="/catalog" className="back-link">← Вернуться в магазин</Link>
      </header>

      {cartItems.length > 0 && (
        <div className="cart-actions">
          <button className="clear-cart-btn" onClick={clearCart}>
            <span className="material-icons">delete_sweep</span> Очистить корзину
          </button>
        </div>
      )}

      <div className="cart-items">
        {cartItems.length === 0 ? (
          <div className="empty-cart-message">
            <p>Ваша корзина пуста</p>
            <Link to="/catalog" className="shop-link">Перейти в магазин</Link>
          </div>
        ) : (
          cartItems.map(item => (
            <div key={item.id} className="cart-item" data-item-id={item.id}>
              <div className="item-info">
                <h3>{item.item_type === 'pet_food' ? 'Корм' : 'Лекарство'} #{item.item_id}</h3>
                <p className="item-price">{item.price} руб. × <span className="item-quantity">{item.quantity}</span></p>
                <p className="item-total">Итого: <span>{(item.price * item.quantity).toFixed(2)}</span> руб.</p>
              </div>
              <div className="item-actions">
                <button className="quantity-btn minus" onClick={() => updateQuantity(item.id, -1)}>
                  <span className="material-icons">remove</span>
                </button>
                <button className="quantity-btn plus" onClick={() => updateQuantity(item.id, 1)}>
                  <span className="material-icons">add</span>
                </button>
                <button className="remove-btn" onClick={() => removeCartItem(item.id)}>
                  <span className="material-icons">delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="cart-total">
          <h3>Итого: <span id="grand-total">{totalPrice.toFixed(2)}</span> руб.</h3>
          <button className="checkout-btn" onClick={checkout}>
            <span className="material-icons">shopping_cart_checkout</span> Оформить заказ
          </button>
        </div>
      )}

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default CartPage;