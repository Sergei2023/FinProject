// src/App.jsx
import React, { useState, useEffect } from 'react';
import TransactionForm from './components/TransactionForm/TransactionForm';
import './App.css';

function App() {
  // Используем ленивую инициализацию чтобы избежать useEffect для загрузки
  const [transactions, setTransactions] = useState(() => {
    try {
      const savedTransactions = localStorage.getItem('finproject-transactions');
      return savedTransactions ? JSON.parse(savedTransactions) : [];
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      return [];
    }
  });

  // Только один useEffect для сохранения
  useEffect(() => {
    localStorage.setItem('finproject-transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction) => {
    setTransactions(prev => [transaction, ...prev]);
  };

  // УДАЛИЛИ deleteTransaction пока она не используется
  // const deleteTransaction = (id) => {
  //   setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  // };

  return (
    <div className="app">
      <header className="app-header">
        <h1>💰 FinProject</h1>
        <p>Умный учет ваших финансов</p>
      </header>

      <main className="app-main">
        <div className="app-grid">
          <section className="form-section">
            <TransactionForm onAddTransaction={addTransaction} />
          </section>
          
          <div className="stats-placeholder">
            <p>Здесь скоро появятся: Баланс, Графики и История транзакций</p>
            <p>Транзакций добавлено: {transactions.length}</p>
            {transactions.length > 0 && (
              <div style={{ marginTop: '20px', textAlign: 'left' }}>
                <h4>Последние транзакции:</h4>
                {transactions.slice(0, 3).map(transaction => (
                  <div key={transaction.id} style={{ 
                    padding: '8px', 
                    margin: '5px 0', 
                    background: transaction.type === 'income' ? '#d4edda' : '#f8d7da',
                    borderRadius: '4px',
                    borderLeft: `4px solid ${transaction.type === 'income' ? '#28a745' : '#dc3545'}`
                  }}>
                    <strong>{transaction.category}</strong>: 
                    <span style={{ 
                      color: transaction.type === 'income' ? '#28a745' : '#dc3545',
                      fontWeight: 'bold'
                    }}>
                      {transaction.type === 'income' ? ' +' : ' -'}
                      {transaction.amount} ₽
                    </span>
                    <br />
                    <small style={{ color: '#6c757d' }}>
                      {transaction.date} {transaction.description && `• ${transaction.description}`}
                    </small>
                  </div>
                ))}
                {transactions.length > 3 && (
                  <p style={{ marginTop: '10px', fontSize: '0.9em', color: '#6c757d' }}>
                    ... и еще {transactions.length - 3} транзакций
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;