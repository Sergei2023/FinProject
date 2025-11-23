import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import styles from './TransactionList.module.css';

const TransactionList = ({ transactions, onDeleteTransaction }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    switch (sortBy) {
      case 'amount':
        return b.amount - a.amount;
      case 'category':
        return a.category.localeCompare(b.category);
      case 'date':
      default:
        return new Date(b.date) - new Date(a.date);
    }
  });

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'dd MMMM yyyy', { locale: ru });
    } catch {
      return dateString;
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту транзакцию?')) {
      onDeleteTransaction(id);
    }
  };

  if (transactions.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>💸</div>
        <h3>Нет транзакций</h3>
        <p>Добавьте первую транзакцию чтобы начать учет финансов</p>
      </div>
    );
  }

  return (
    <div className={styles.transactionList}>
      <div className={styles.header}>
        <h2>История транзакций</h2>
        
        <div className={styles.controls}>
          <div className={styles.filterGroup}>
            <label>Фильтр:</label>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className={styles.select}
            >
              <option value="all">Все</option>
              <option value="income">Доходы</option>
              <option value="expense">Расходы</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Сортировка:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.select}
            >
              <option value="date">По дате</option>
              <option value="amount">По сумме</option>
              <option value="category">По категории</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.stats}>
        <span>
          Показано: <strong>{sortedTransactions.length}</strong> из <strong>{transactions.length}</strong>
        </span>
      </div>

      <div className={styles.transactions}>
        {sortedTransactions.map(transaction => (
          <div key={transaction.id} className={styles.transactionItem}>
            <div className={styles.transactionMain}>
              <div className={styles.transactionInfo}>
                <div className={styles.categoryIcon}>
                  {transaction.type === 'income' ? '💰' : '💸'}
                </div>
                <div className={styles.details}>
                  <div className={styles.category}>{transaction.category}</div>
                  <div className={styles.meta}>
                    <span className={styles.date}>{formatDate(transaction.date)}</span>
                    {transaction.description && (
                      <span className={styles.description}>• {transaction.description}</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className={styles.transactionAmount}>
                <span className={`${styles.amount} ${styles[transaction.type]}`}>
                  {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toFixed(2)} ₽
                </span>
                <button
                  onClick={() => handleDelete(transaction.id)}
                  className={styles.deleteButton}
                  title="Удалить транзакцию"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTransactions.length === 0 && transactions.length > 0 && (
        <div className={styles.noResults}>
          <p>Нет транзакций по выбранному фильтру</p>
        </div>
      )}
    </div>
  );
};

export default TransactionList;