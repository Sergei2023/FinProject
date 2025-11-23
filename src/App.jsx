import React, { useState, useEffect } from 'react';
import TransactionForm from './components/TransactionForm/TransactionForm';
import Balance from './components/Balance/Balance';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState(() => {
    try {
      const savedTransactions = localStorage.getItem('finproject-transactions');
      return savedTransactions ? JSON.parse(savedTransactions) : [];
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('finproject-transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction) => {
    setTransactions(prev => [transaction, ...prev]);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>FinProject</h1>
        <p>учет всего, что есть в твоем кошельке</p>
      </header>

      <main className="app-main">
        <div className="app-grid">
          <section className="form-section">
            <TransactionForm onAddTransaction={addTransaction} />
          </section>
          
          <section className="balance-section">
            <Balance transactions={transactions} />
          </section>

          {transactions.length > 0 && (
            <section className="transactions-preview">
              <div className="preview-card">
                <h3>Последние транзакции</h3>
                {transactions.slice(0, 5).map(transaction => (
                  <div key={transaction.id} className="preview-item">
                    <div className="preview-main">
                      <span className="preview-category">{transaction.category}</span>
                      <span className={`preview-amount ${transaction.type}`}>
                        {transaction.type === 'income' ? '+' : '-'}{transaction.amount} ₽
                      </span>
                    </div>
                    <div className="preview-details">
                      <span className="preview-date">{transaction.date}</span>
                      {transaction.description && (
                        <span className="preview-description">• {transaction.description}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;