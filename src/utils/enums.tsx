export enum profileEnums {
  suppliers = 1,
  expenses,
  fridges,
  clients,
  employees,
}

export enum trasactionsEnums {
  pay = 2,
  bouns,
  income,
}

export enum fridgeTransactionEnums {
  in = 1,
  out,
}

export enum getTrasactionsEnums {
  all = 0,
  supplier,
  expense,
  fridge,
  client,
  employee,
}

export enum clientProductStaus {
  current = 1,
  updated,
  deleted,
  new,
}

export enum apiResponseStatus {
  fail = 0,
  success,
}
