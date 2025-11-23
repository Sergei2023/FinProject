import React, { useState, useEffect } from 'react';
import TransactionForm from './components/TransactionForm/TransactionForm';
import Balance from './components/Balance/Balance';
import TransactionList from './components/TransactionList/TransactionList';
import ExpenseChart from './components/Charts/ExpenseChart';
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

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>FinProject</h1>
        <p>Управляй своим кошельком</p>
      </header>

      <main className="app-main">
        <div className="app-grid">
          <section className="balance-section">
            <Balance transactions={transactions} />
          </section>

          <section className="form-section">
            <TransactionForm onAddTransaction={addTransaction} />
          </section>

          <section className="charts-section">
            <ExpenseChart transactions={transactions} />
          </section>

          <section className="list-section">
            <TransactionList 
              transactions={transactions}
              onDeleteTransaction={deleteTransaction}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;