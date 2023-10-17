'use client'

import { ChangeEvent, useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'
import { useSetRecoilState } from 'recoil'

import { promptAtom } from '@/atoms/promptAtom'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import generateFutureScenario from '@/lib/api/generateFutureScenario'
import getAccounts from '@/lib/api/getAccounts'
import getElectricFarePayment from '@/lib/api/getElectricFarePayment'
import getLoanAccount from '@/lib/api/getLoanAccount'
import getSewageFarePayment from '@/lib/api/getSewageFarePayment'
import getTransaction from '@/lib/api/getTransaction'

import type { Information, Expense, Entries, Prompts } from '@/types'

const EXPENSE_LABEL = {
  salary: '월급',
  sewage: '수도',
  electricity: '전기',
  rent: '주거',
  phone: '통신',
  clothing: '의류',
  food: '식품',
} as const

export default function Page() {
  const router = useRouter()
  const setPrompts = useSetRecoilState(promptAtom)
  const [information, setInformation] = useState<Information>({
    accounts: [{ balance: 0, name: '', number: '' }],
    averageElectricityFare: 0,
    averageSewageFare: 0,
    customer: { id: '', name: '' },
    loanAccount: {
      balance: 0,
      contractionDate: '',
      dueDate: '',
      interestRate: 0,
      name: '',
      number: '',
    },
    transaction: { in: 0, out: 0 },
  })
  const [expense, setExpense] = useState<Expense>({
    salary: 0,
    rent: 0,
    sewage: 0,
    electricity: 0,
    phone: 0,
    clothing: 0,
    food: 0,
  })
  const [plan, setPlan] = useState('저축')

  useEffect(() => {
    async function getAll() {
      let information = {} as Information
      let expense = {} as Expense
      await Promise.allSettled([
        getAccounts(),
        getLoanAccount(),
        getTransaction(),
        getElectricFarePayment(),
        getSewageFarePayment(),
      ]).then((result) => {
        result.forEach((val) => {
          if (val.status === 'fulfilled') {
            if ('averageSewageFare' in val.value.result) {
              expense.sewage = val.value.result.averageSewageFare
            } else if ('averageElectricityFare' in val.value.result) {
              expense.electricity = val.value.result.averageElectricityFare
            } else information = { ...information, ...val.value.result }
          }
        })
      })
      setInformation(information)
      setExpense((prev) => ({ ...prev, ...expense }))
    }
    getAll()
  }, [])

  function onChangeExpense(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.currentTarget
    setExpense((prev) => ({ ...prev, [name]: Number(value) }))
  }

  function onClickPlan(e: React.MouseEvent<HTMLInputElement, MouseEvent>) {
    const { value } = e.currentTarget
    setPlan(value)
  }

  async function generateFuture() {
    let prompts = { name: information.customer.name } as Prompts
    await Promise.allSettled([
      generateFutureScenario({
        information,
        expense,
        plan,
        flag: 'hopefulScenario',
      }),
      generateFutureScenario({
        information,
        expense,
        plan,
        flag: 'hopefulScenarioPrompt',
      }),
      generateFutureScenario({
        information,
        expense,
        plan,
        flag: 'desperateScenario',
      }),
      generateFutureScenario({
        information,
        expense,
        plan,
        flag: 'desperateScenarioPrompt',
      }),
      generateFutureScenario({
        information,
        expense,
        plan,
        flag: 'hopefulPlan',
      }),
    ])
      .then((result) => {
        result.forEach((val) => {
          if (val.status === 'fulfilled') {
            if (val.value.data !== undefined) {
              const data = JSON.parse(val.value.data)
              prompts = { ...prompts, ...data }
            }
          }
        })
      })
      .finally(() => {
        setPrompts(prompts)
        router.push('/result')
      })
    return
  }

  return (
    <>
      <h1 className="text-center text-xl font-extrabold">
        {information.customer.name} 님의 현재 재무정보
      </h1>

      <Separator className="my-4" />

      <section className="mb-4">
        <h2 className="text-lg font-bold">계좌</h2>
        <ul>
          {information.accounts.map((account) => (
            <li key={account.number} className="text-right">
              <h3>상품명: {account.name}</h3>
              <div>계좌번호: {account.number}</div>
              <div>잔액: {account.balance.toLocaleString()}원</div>
            </li>
          ))}
        </ul>
        <div>
          <span>계좌 총잔액: </span>
          <span className="text-yellow-400">
            {information.accounts
              .reduce((acc, cur) => acc + cur.balance, 0)
              .toLocaleString()}
            원
          </span>
        </div>
      </section>

      <section className="mb-4">
        <h2 className="text-lg font-bold">대출</h2>
        <div className="text-right">
          <h3>상품명: {information.loanAccount.name}</h3>
          <div>
            대출잔액: {information.loanAccount.balance.toLocaleString()}원
          </div>
          <div>이자율: {information.loanAccount.interestRate}%</div>
        </div>
        <div>
          <span>총 대출잔액: </span>
          <span className="text-yellow-400">
            {information.loanAccount.balance.toLocaleString()}원
          </span>
        </div>
      </section>

      <section className="mb-4">
        <h2 className="text-lg font-bold">지출</h2>
        <div>
          <div className="mb-2 flex justify-between">
            <h3 className="shrink-0 font-semibold">최근 거래내역</h3>
            <div className="grow text-right">
              <div>
                <span>입금: </span>
                <span>{information.transaction.in.toLocaleString()}원</span>
              </div>
              <div>
                <span>송금: </span>
                <span>{information.transaction.out.toLocaleString()}원</span>
              </div>
            </div>
          </div>
          <div>
            <div className="mb-2 flex items-center gap-2">
              <h3 className="font-semibold">정기 수입•지출</h3>
              <p className="text-right text-xs text-gray-700">
                직접 입력해 주세요.
              </p>
            </div>
          </div>
        </div>

        {(Object.entries(expense) as Entries<Expense>).map(([key, value]) => {
          return (
            <div key={key} className="mb-1 flex gap-4">
              <span>{EXPENSE_LABEL[key]}</span>
              <div className="grow rounded-md border border-gray-300 bg-gray-100 px-1 text-right">
                <input
                  name={key}
                  type="number"
                  defaultValue={value}
                  onChange={onChangeExpense}
                  className="bg-gray-100 text-right"
                />
                원
              </div>
            </div>
          )
        })}
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-center text-lg font-bold">
          현재 잔액으로 무엇을 가장 하고 싶으세요?
        </h2>
        <fieldset className="grid grid-cols-3 gap-x-4">
          <input
            type="radio"
            id="saving"
            name="plan"
            value="저축"
            onClick={onClickPlan}
            checked={plan === '저축'}
            className="peer/saving hidden"
          />
          <label
            htmlFor="saving"
            className="flex aspect-square cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-gray-100 peer-checked/saving:bg-yellow-400">
            저축
          </label>
          <input
            type="radio"
            id="spend"
            name="plan"
            value="소비"
            onClick={onClickPlan}
            checked={plan === '소비'}
            className="peer/spend hidden"
          />
          <label
            htmlFor="spend"
            className="flex aspect-square cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-gray-100 peer-checked/spend:bg-yellow-400">
            소비
          </label>
          <input
            type="radio"
            id="investment"
            name="plan"
            value="투자"
            onClick={onClickPlan}
            checked={plan === '투자'}
            className="peer/investment hidden"
          />
          <label
            htmlFor="investment"
            className="flex aspect-square cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-gray-100 peer-checked/investment:bg-yellow-400">
            투자
          </label>
        </fieldset>
      </section>

      <Button type="submit" onClick={generateFuture} className="w-full">
        미래보기
      </Button>
    </>
  )
}
