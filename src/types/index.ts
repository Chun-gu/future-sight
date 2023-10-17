export type Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]

export type Information = {
  accounts: { balance: number; name: string; number: string }[]
  averageElectricityFare: number
  averageSewageFare: number
  customer: { id: string; name: string }
  loanAccount: {
    balance: number
    contractionDate: string
    dueDate: string
    interestRate: number
    name: string
    number: string
  }
  transaction: { in: number; out: number }
}

export type Expense = {
  salary: number
  rent: number
  sewage: number
  electricity: number
  phone: number
  clothing: number
  food: number
}

export type Prompts = {
  name: string
  hopefulScenario: string
  hopefulScenarioPrompt: string
  desperateScenario: string
  desperateScenarioPrompt: string
  hopefulPlan: string
}
