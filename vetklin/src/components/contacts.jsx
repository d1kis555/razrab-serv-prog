import React from "react";
import "../styles/contacts.css";

const Contacts = () => {
  return (
    <div className="contacts-container">
      <h2 className="contacts-title">Контакты</h2>
      
      <div className="contacts-content">
        
        <div className="map-container">
         
          <div className="info-plate">
            
          <div className="working-hours">
                <p className='header-text'>Режим работы:</p>
                <div className="hours-grid">
                  <span style={{color: '#18AEA5'}}>Пн-Пт:</span>
                  <span style={{color: '#3A65BF'}}>Сб-Вс:</span>
                  <span>8:00-20:00</span>
                  <span>8:00-17:00</span>
                </div>
              </div>
            
            <div className="addresses">
              <div className="address">
                <h4 className="header-text">Новосибирск</h4>
                <p>ул. Пулеметская 51</p>
                <p>+7 (999) 999-99-99</p>
              </div>
              
              <div className="address">
                <h4 className="header-text">Новосибирск</h4>
                <p>ул. Ленина 3</p>
                <p>+7 (999) 999-99-99</p>
              </div>
            </div>
          </div>
          
       
          <div className="map-iframe-container">
          

          <script type="text/javascript" charset="utf-8" async src="https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3Aa6a73bc8c98684b7b8515b178fac43cdd40874ccae5e03e18cb09bd37578ee24&amp;width=900&amp;height=400&amp;lang=ru_RU&amp;scroll=true"></script>
          </div>
        </div>
        
    
        <div className="feedback-form">
          <h3>Напишите нам</h3>
          <form>
            <div className="form-group">
            
              <input type="text" id="name" placeholder="Ваше имя" />
            </div>
            
            <div className="form-group">
         
              <input type="tel" id="phone" placeholder="+7 (___) ___-__-__" />
            </div>
            
            <div className="form-group">
   
              <input type="text" id="topic" placeholder="Тема сообщения" />
            </div>
            
            <div className="form-group">

              <textarea id="message" placeholder="Напишите сообщение"></textarea>
            </div>
            
            <button type="submit">Отправить</button>
            
            <p className="consent-text">
              Нажимая на кнопку, Вы даете согласие на обработку персональных данных.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contacts;