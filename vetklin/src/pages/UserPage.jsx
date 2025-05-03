import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
const UserContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const WelcomeMessage = styled.h1`
  color: #3A65BF;
`;

function UserPage() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  useEffect(() => {

    if (!localStorage.getItem('token')) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <UserContainer>
      <WelcomeMessage>Добро пожаловать, {username}!</WelcomeMessage>
      <p>Это ваша личная страница.</p>
    </UserContainer>
  );
}

export default UserPage;