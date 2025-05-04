import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CatalogPage.css';

function CatalogPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    animalType: '',
    breed: '',
    age: '',
    productType: 'pet_food'
  });
  const [breeds, setBreeds] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/');
    }
    fetchCartCount();
    loadProducts();
  }, [navigate]);

  useEffect(() => {
    if (filters.animalType) {
      fetchBreeds();
    } else {
      setBreeds([]);
    }
  }, [filters.animalType, filters.productType]);

  const fetchCartCount = async () => {
    try {
      // Здесь будет запрос к API для получения количества товаров в корзине
      // Пока используем заглушку
      setCartCount(0);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const fetchBreeds = async () => {
    try {
      // Заглушка для запроса пород
      // В реальном приложении будет запрос к API:
      // const response = await fetch(`/api/breeds?animal_type=${filters.animalType}&product_type=${filters.productType}`);
      // const data = await response.json();
      // setBreeds(data);
      
      // Временные данные для демонстрации
      const demoBreeds = {
        'Кошка': ['Британская', 'Сиамская', 'Мейн-кун'],
        'Собака': ['Лабрадор', 'Овчарка', 'Бульдог'],
        'Птица': ['Волнистый попугай', 'Канарейка', 'Ара']
      };
      setBreeds(demoBreeds[filters.animalType] || []);
    } catch (error) {
      console.error('Error fetching breeds:', error);
      setBreeds([]);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      // Заглушка для запроса товаров
      // В реальном приложении будет запрос к API:
      // const params = new URLSearchParams();
      // params.append('type', filters.productType);
      // if (filters.animalType) params.append('animal_type', filters.animalType);
      // if (filters.breed) params.append('breed', filters.breed);
      // if (filters.age) params.append('age', filters.age);
      // const response = await fetch(`/api/products?${params.toString()}`);
      // const data = await response.json();
      // setProducts(data);
      
      // Временные данные для демонстрации
      const demoProducts = [
        {
          id: 1,
          name: 'Корм для кошек "Премиум"',
          breed: 'Британская',
          weight: 2,
          age_plus: '1',
          structure: 'Мясо, злаки, витамины',
          allergies: 'нет',
          price: 1200,
          type: 'pet_food'
        },
        {
          id: 2,
          name: 'Лекарство от блох',
          breed: 'Все породы',
          weight: 0.1,
          age_plus: '2',
          structure: 'Активные компоненты',
          allergies: 'нет',
          price: 450,
          type: 'pet_medicine'
        }
      ];
      setProducts(demoProducts.filter(p => p.type === filters.productType));
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    setLoading(true);
    try {
      // Заглушка для добавления в корзину
      // В реальном приложении будет запрос к API:
      // const response = await fetch('/api/cart', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     item_id: product.id,
      //     item_type: product.type,
      //     price: product.price,
      //     quantity: 1
      //   }),
      // });
      // const data = await response.json();
      
      setCartCount(prev => prev + 1);
      showToast('Товар добавлен в корзину');
    } catch (error) {
      console.error('Error adding to cart:', error);
      showToast('Ошибка при добавлении в корзину', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProductTypeChange = (type) => {
    setFilters(prev => ({
      ...prev,
      productType: type,
      breed: '' // Сбрасываем фильтр породы при смене типа товара
    }));
  };

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const getAgeText = (agePlus) => {
    const ageMap = {
      '1': 'Для молодых',
      '2': 'Для взрослых',
      '3': 'Для пожилых'
    };
    return ageMap[agePlus] || agePlus;
  };

  return (
    <div className="catalog-page">
      <header className="catalog-header">
        <h1>PetShop - Магазин товаров для питомцев</h1>
        <div className="header-controls">
          <div className="filter-group">
            <label htmlFor="animal-type-filter">Вид животного:</label>
            <select
              id="animal-type-filter"
              className="filter-select"
              value={filters.animalType}
              onChange={(e) => handleFilterChange('animalType', e.target.value)}
            >
              <option value="">Выберите вид животного</option>
              <option value="Кошка">Кошки</option>
              <option value="Собака">Собаки</option>
              <option value="Птица">Птицы</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="breed-filter">Порода:</label>
            <select
              id="breed-filter"
              className="filter-select"
              value={filters.breed}
              onChange={(e) => handleFilterChange('breed', e.target.value)}
              disabled={!filters.animalType || breeds.length === 0}
            >
              <option value="">{breeds.length ? 'Все породы' : 'Сначала выберите вид животного'}</option>
              {breeds.map(breed => (
                <option key={breed} value={breed}>{breed}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="age-filter">Возраст:</label>
            <select
              id="age-filter"
              className="filter-select"
              value={filters.age}
              onChange={(e) => handleFilterChange('age', e.target.value)}
            >
              <option value="">Все возраста</option>
              <option value="1">Для молодых</option>
              <option value="2">Для взрослых</option>
              <option value="3">Для пожилых</option>
            </select>
          </div>

          <button className="cart-link" onClick={() => navigate('/cart')}>
            <span className="cart-icon">🛒</span>
            Корзина (<span id="cart-count">{cartCount}</span>)
          </button>
        </div>
      </header>

      <div className="product-types">
        <button
          className={`product-type-btn ${filters.productType === 'pet_food' ? 'active' : ''}`}
          onClick={() => handleProductTypeChange('pet_food')}
        >
          Корма
        </button>
        <button
          className={`product-type-btn ${filters.productType === 'pet_medicine' ? 'active' : ''}`}
          onClick={() => handleProductTypeChange('pet_medicine')}
        >
          Лекарства и уход
        </button>
      </div>

      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="no-products-message">
          <p>Товары не найдены. Попробуйте изменить параметры фильтрации.</p>
        </div>
      )}

      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <div className="product-details">
              <p><strong>Порода:</strong> {product.breed}</p>
              <p><strong>Вес упаковки:</strong> {product.weight} кг</p>
              <p><strong>Возраст:</strong> {getAgeText(product.age_plus)}</p>
              <p><strong>Состав:</strong> {product.structure}</p>
              <p><strong>Аллергены:</strong> {product.allergies || 'нет'}</p>
              <p className="price"><strong>Цена:</strong> {product.price} руб.</p>
            </div>
            <button 
              className="add-to-cart-btn"
              onClick={() => addToCart(product)}
            >
              Добавить в корзину
            </button>
          </div>
        ))}
      </div>

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default CatalogPage;