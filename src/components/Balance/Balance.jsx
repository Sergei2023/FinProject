import React from 'react';
import styles from './Balance.module.css';

const Balance = ({ transactions }) => {
  const calculations = transactions.reduce((acc, transaction) => {
    if (transaction.type === 'income') {
      acc.income += transaction.amount;
      acc.balance += transaction.amount;
    } else {
      acc.expense += transaction.amount;
      acc.balance -= transaction.amount;
    }
    return acc;
  }, { balance: 0, income: 0, expense: 0 });

  const { balance, income, expense } = calculations;

  return (
    <div className={styles.balance}>
      <h2>Финансовый обзор</h2>
      
      <div className={styles.balanceCard}>
        <div className={styles.balanceAmount}>
          <span className={styles.label}>Общий баланс</span>
          <span className={`${styles.amount} ${balance >= 0 ? styles.positive : styles.negative}`}>
            {balance >= 0 ? '+' : ''}{balance.toFixed(2)} ₽
          </span>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <div className={styles.statIcon} style={{ backgroundColor: '#d4edda' }}>
            💰
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Доходы</span>
            <span className={styles.statAmountPositive}>+{income.toFixed(2)} ₽</span>
          </div>
        </div>

        <div className={styles.statItem}>
          <div className={styles.statIcon} style={{ backgroundColor: '#f8d7da' }}>
            💸
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Расходы</span>
            <span className={styles.statAmountNegative}>-{expense.toFixed(2)} ₽</span>
          </div>
        </div>
      </div>

      {transactions.length > 0 && (
        <div className={styles.summary}>
          <div className={styles.summaryItem}>
            <span>Всего транзакций:</span>
            <strong>{transactions.length}</strong>
          </div>
          <div className={styles.summaryItem}>
            <span>Доходов:</span>
            <strong>{transactions.filter(t => t.type === 'income').length}</strong>
          </div>
          <div className={styles.summaryItem}>
            <span>Расходов:</span>
            <strong>{transactions.filter(t => t.type === 'expense').length}</strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default Balance;