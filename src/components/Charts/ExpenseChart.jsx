import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import styles from './ExpenseChart.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ExpenseChart = ({ transactions }) => {
  const prepareChartData = () => {
    const incomeByCategory = {};
    const expenseByCategory = {};
    const monthlyData = {};

    transactions.forEach(transaction => {
      const { type, category, amount, date } = transaction;
      
      if (type === 'income') {
        incomeByCategory[category] = (incomeByCategory[category] || 0) + amount;
      } else {
        expenseByCategory[category] = (expenseByCategory[category] || 0) + amount;
      }

      const monthYear = date.substring(0, 7);
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { income: 0, expense: 0 };
      }
      if (type === 'income') {
        monthlyData[monthYear].income += amount;
      } else {
        monthlyData[monthYear].expense += amount;
      }
    });

    return { incomeByCategory, expenseByCategory, monthlyData };
  };

  const { incomeByCategory, expenseByCategory, monthlyData } = prepareChartData();

  const expenseChartData = {
    labels: Object.keys(expenseByCategory),
    datasets: [
      {
        data: Object.values(expenseByCategory),
        backgroundColor: [
          '#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6',
          '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#64748b'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };
  
  const monthlyChartData = {
    labels: Object.keys(monthlyData).map(month => {
      const [year, monthNum] = month.split('-');
      const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
      return `${months[parseInt(monthNum) - 1]} ${year}`;
    }),
    datasets: [
      {
        label: 'Доходы',
        data: Object.values(monthlyData).map(data => data.income),
        backgroundColor: '#10b981',
        borderColor: '#10b981',
        borderWidth: 2
      },
      {
        label: 'Расходы',
        data: Object.values(monthlyData).map(data => data.expense),
        backgroundColor: '#ef4444',
        borderColor: '#ef4444',
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Распределение расходов по категориям'
      }
    }
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Доходы и расходы по месяцам'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const totalExpenses = Object.values(expenseByCategory).reduce((sum, amount) => sum + amount, 0);
  const totalIncome = Object.values(incomeByCategory).reduce((sum, amount) => sum + amount, 0);

  return (
    <div className={styles.charts}>
      <h2>Визуализация финансов</h2>
      
      {transactions.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📊</div>
          <p>Добавьте транзакции чтобы увидеть графики</p>
        </div>
      ) : (
        <div className={styles.chartsGrid}>
          {/* Круговая диаграмма расходов */}
          {Object.keys(expenseByCategory).length > 0 && (
            <div className={styles.chartContainer}>
              <div className={styles.chartWrapper}>
                <Doughnut data={expenseChartData} options={chartOptions} />
              </div>
              
              {/* Детализация расходов */}
              <div className={styles.chartDetails}>
                <h4>Расходы по категориям:</h4>
                {Object.entries(expenseByCategory)
                  .sort(([,a], [,b]) => b - a)
                  .map(([category, amount]) => (
                    <div key={category} className={styles.categoryItem}>
                      <span className={styles.categoryName}>{category}</span>
                      <div className={styles.categoryStats}>
                        <span className={styles.amount}>{amount.toFixed(2)} ₽</span>
                        <span className={styles.percentage}>
                          ({((amount / totalExpenses) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Столбчатая диаграмма по месяцам */}
          {Object.keys(monthlyData).length > 0 && (
            <div className={styles.chartContainer}>
              <div className={styles.chartWrapper}>
                <Bar data={monthlyChartData} options={barChartOptions} />
              </div>
              
              {/* Статистика по месяцам */}
              <div className={styles.chartDetails}>
                <h4>Статистика по месяцам:</h4>
                {Object.entries(monthlyData)
                  .sort(([a], [b]) => b.localeCompare(a))
                  .map(([month, data]) => {
                    const [year, monthNum] = month.split('-');
                    const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 
                                   'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
                    return (
                      <div key={month} className={styles.monthItem}>
                        <span className={styles.monthName}>
                          {months[parseInt(monthNum) - 1]} {year}
                        </span>
                        <div className={styles.monthStats}>
                          <span className={styles.income}>+{data.income.toFixed(2)} ₽</span>
                          <span className={styles.expense}>-{data.expense.toFixed(2)} ₽</span>
                          <span className={
                            data.income - data.expense >= 0 ? styles.netPositive : styles.netNegative
                          }>
                            {data.income - data.expense >= 0 ? '+' : ''}{(data.income - data.expense).toFixed(2)} ₽
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Общая статистика */}
          <div className={styles.summaryCards}>
            <div className={styles.summaryCard}>
              <h4>Общая статистика</h4>
              <div className={styles.summaryItem}>
                <span>Всего доходов:</span>
                <span className={styles.positive}>{totalIncome.toFixed(2)} ₽</span>
              </div>
              <div className={styles.summaryItem}>
                <span>Всего расходов:</span>
                <span className={styles.negative}>{totalExpenses.toFixed(2)} ₽</span>
              </div>
              <div className={styles.summaryItem}>
                <span>Баланс:</span>
                <span className={
                  totalIncome - totalExpenses >= 0 ? styles.positive : styles.negative
                }>
                  {totalIncome - totalExpenses >= 0 ? '+' : ''}{(totalIncome - totalExpenses).toFixed(2)} ₽
                </span>
              </div>
            </div>

            {/* Топ категории */}
            {Object.keys(expenseByCategory).length > 0 && (
              <div className={styles.summaryCard}>
                <h4>Топ категории расходов</h4>
                {Object.entries(expenseByCategory)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 3)
                  .map(([category, amount], index) => (
                    <div key={category} className={styles.topCategory}>
                      <span className={styles.rank}>#{index + 1}</span>
                      <span className={styles.categoryName}>{category}</span>
                      <span className={styles.amount}>{amount.toFixed(2)} ₽</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseChart;