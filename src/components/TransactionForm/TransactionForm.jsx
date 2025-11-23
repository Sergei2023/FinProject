import React, { useState } from 'react';
import styles from './TransactionForm.module.css';

const TransactionForm = ({ onAddTransaction }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    type: 'expense',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = {
    income: ['Зарплата', 'Фриланс', 'Инвестиции', 'Подарок'],
    expense: ['Еда', 'Транспорт', 'Развлечения', 'Жилье', 'Здоровье', 'Одежда']
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.category) {
      alert('Пожалуйста, заполните сумму и категорию');
      return;
    }

    const transaction = {
      id: Date.now(),
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type,
      description: formData.description,
      date: formData.date
    };

    onAddTransaction(transaction);
    
    setFormData({
      amount: '',
      category: '',
      type: 'expense',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'type' && { category: '' })
    }));
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3>Добавить транзакцию</h3>
      
      <div className={styles.radioGroup}>
        <label className={formData.type === 'income' ? styles.active : ''}>
          <input
            type="radio"
            name="type"
            value="income"
            checked={formData.type === 'income'}
            onChange={handleChange}
          />
          Доход
        </label>
        <label className={formData.type === 'expense' ? styles.active : ''}>
          <input
            type="radio"
            name="type"
            value="expense"
            checked={formData.type === 'expense'}
            onChange={handleChange}
          />
          Расход
        </label>
      </div>

      <div className={styles.inputGroup}>
        <input
          type="number"
          name="amount"
          placeholder="Сумма"
          value={formData.amount}
          onChange={handleChange}
          step="0.01"
          min="0"
          required
        />
        
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Выберите категорию</option>
          {categories[formData.type].map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <input
        type="text"
        name="description"
        placeholder="Описание (необязательно)"
        value={formData.description}
        onChange={handleChange}
        className={styles.description}
      />

      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        className={styles.date}
      />

      <button type="submit" className={styles.submitButton}>
        Добавить транзакцию
      </button>
    </form>
  );
};

export default TransactionForm;