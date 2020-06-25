/* eslint-disable no-return-assign */
import Transaction from '../models/Transaction';
import CreateTransactionService from '../services/CreateTransactionService';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransaction {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {

    const income = this.transactions.reduce((total, elemento) => {
      if (elemento.type === 'income') return (total += elemento.value);
      return total},0);

    const outcome = this.transactions.reduce((total, elemento) => {
      if (elemento.type === 'outcome') return (total += elemento.value);
      return total},0);

    const result = this.getBalance({ income, outcome });

    return [this.transactions, result];
  }

  // eslint-disable-next-line class-methods-use-this
  public getBalance({ income, outcome }: Omit<Balance, 'total'>): Balance {
    const result = income - outcome;
    const balance = {
      income,
      outcome,
      total: result,
    };
    return balance;
  }

  public create({ title, value, type }: CreateTransaction): Transaction {
    if (type === 'income') {
      const transaction = new Transaction({ title, value, type });
      this.transactions.push(transaction);
      return transaction;
    };

    const income = this.transactions.reduce((total, elemento) => {
      if (elemento.type === 'income') return (total += elemento.value);
      return total},0);

    const outcome = this.transactions.reduce((total, elemento) => {
      if (elemento.type === 'outcome') return (total += elemento.value);
      return total},0);

    const result = this.getBalance({ income, outcome });

    if (result.total < value) {
      throw Error('You can´t get the outcome transaction!');
    }

    const transaction = new Transaction({ title, value, type });
    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
