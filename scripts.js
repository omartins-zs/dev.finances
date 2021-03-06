const Modal = {
  open() {
    // Abrir modal
    // Adicionar a class active ao modal
    document.querySelector(".modal-overlay").classList.add("active");
  },
  close() {
    // fechar o modal
    // remover a class active do modal
    document.querySelector(".modal-overlay").classList.remove("active");
  },
};

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem("dev.finances:transactions")) || [];
  },

  set(transactions) {
    localStorage.setItem(
      "dev.finances:transactions",
      JSON.stringify(transactions)
    );
  },
};
const Transaction = {
  // Substituido all por Storage.get e guardado em anotaçoes
  all: Storage.get(),

  add(transaction) {
    Transaction.all.push(transaction);

    App.reload();
  },

  remove(index) {
    Transaction.all.splice(index, 1);

    App.reload();
  },

  incomes() {
    let income = 0;
    //   Pegar todas as transaçoes
    Transaction.all.forEach((transaction) => {
      //  Se for maior que zero
      if (transaction.amount > 0) {
        //  somar a uma variavel e retornar a variavel
        income += transaction.amount;
      }
    });
    return income;
    // Somar as entradas
  },

  expenses() {
    let expense = 0;
    Transaction.all.forEach((transaction) => {
      //  Se for menor que zero
      if (transaction.amount < 0) {
        expense += transaction.amount;
      }
    });
    return expense;
    //  Somar as saidas
  },

  total() {
    return Transaction.incomes() + Transaction.expenses(); // Somar as entradas
  },
};

const DOM = {
  transactionsContainer: document.querySelector("#data-table tbody"),

  addTransaction(transaction, index) {
    const tr = document.createElement("tr");
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
    tr.dataset.index = index;

    DOM.transactionsContainer.appendChild(tr);
  },
  innerHTMLTransaction(transaction, index) {
    const CSSclass = transaction.amount > 0 ? "income" : "expense";

    const amount = Utils.formatCurrency(transaction.amount);

    const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
           <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
        </td>
        `;

    return html;
  },

  updateBalance() {
    document.getElementById("incomeDisplay").innerHTML = Utils.formatCurrency(
      Transaction.incomes()
    );
    document.getElementById("expenseDisplay").innerHTML = Utils.formatCurrency(
      Transaction.expenses()
    );
    document.getElementById("totalDisplay").innerHTML = Utils.formatCurrency(
      Transaction.total()
    );
  },

  clearTransactions() {
    DOM.transactionsContainer.innerHTML = "";
  },
};

const Utils = {
  formatAmount(value) {
    //* Metodo 1 *
    // value = Number(value) * 100;

    // Metodo Mayk
    // value = Number(value.replace(/\,\./g, "")) * 100;

    // * Metodo Aula 4 Corrigido *
    value = value * 100;
    return Math.round(value);
  },

  formatDate(date) {
    const splittedDate = date.split("-");
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
  },
  formatCurrency(value) {
    const signal = Number(value) < 0 ? "-" : "";

    value = String(value).replace(/\D/g, "");

    value = Number(value) / 100;

    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return signal + value;
  },
};

const Form = {
  description: document.querySelector("input#description"),
  amount: document.querySelector("input#amount"),
  date: document.querySelector("input#date"),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value,
    };
  },

  validateFields() {
    const { description, amount, date } = Form.getValues();
    if (
      description.trim() === "" ||
      amount.trim() === "" ||
      date.trim() === ""
    ) {
      throw new Error("Por favor, preencha todos os campos");
    }
  },

  formatValues() {
    let { description, amount, date } = Form.getValues();

    amount = Utils.formatAmount(amount);

    date = Utils.formatDate(date);

    return {
      description,
      amount,
      date,
    };
  },

  clearFields() {
    Form.description.value = "";
    Form.amount.value = "";
    Form.date.value = "";
  },
  submit(event) {
    event.preventDefault();

    try {
      // Verificar se todas as informaçoes foram preenchidas
      Form.validateFields();

      // Formatar os dados para Salvar
      const transaction = Form.formatValues();

      // Salvar
      Transaction.add(transaction);

      // apagar os dados do formulario
      Form.clearFields();

      // modal fechar
      Modal.close();

      // Atualizar aplicação
      // * Já e feito no add
    } catch (error) {
      alert(error.message);
    }
  },
};

const App = {
  init() {
    // Nao usei Arrow Function
    Transaction.all.forEach(function (transaction, index) {
      DOM.addTransaction(transaction, index);
    });

    DOM.updateBalance();

    Storage.set(Transaction.all);
  },
  reload() {
    DOM.clearTransactions();
    App.init();
  },
};

App.init();

// Transaction.remove(0)

// Transaction.add({
//   description: "Alo",
//   amount: 200,
//   date: "30/01/2021",
// });

// * Para adicionar manualmente *
// DOM.addTransaction(transactions[0])
// DOM.addTransaction(transactions[1])
// DOM.addTransaction(transactions[2])

// * Exemplo de for *
// for(let i = 0; i < 3; i++) {
//      console.log(i)
// }
