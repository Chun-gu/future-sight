import { Expense, Information } from '@/types'

type Param = {
  information: Information
  expense: Expense
  plan: string
  flag:
    | 'hopefulScenario'
    | 'hopefulScenarioPrompt'
    | 'desperateScenario'
    | 'desperateScenarioPrompt'
    | 'hopefulPlan'
}

export default async function generateFutureScenario({
  information,
  expense,
  plan,
  flag,
}: Param) {
  const {
    customer: { name },
    accounts: [balance],
    loanAccount: { balance: loanBalance, interestRate },
    transaction: { out: spend, in: receipt },
  } = information
  const { clothing, electricity, food, phone, rent, sewage, salary } = expense

  // const prompt = `조건={이름:${name},통장잔고:${
  //   balance.balance
  // }원,월급:${salary},대출잔액:${loanBalance},대출이자율:${interestRate}%,월고정지출:${
  //   clothing + electricity + food + phone + rent + sewage
  // }원,최근지출:${spend}원,최근수입:${receipt}원,${plan}지향적;주어진 조건에 맞게 시나리오 2개,프롬프트 2개,계획 1개를 만들고 JSON 형식으로 답하세요.;{hopefulScenario:<희망적인 10년 뒤의 시나리오>,hopefulScenarioPrompt:<희망적인 미래를 맞이한 인물의 모습을 그리기 위해 이미지 생성 AI인 DALL·E에게 입력할 프롬프트>,desperateScenario:<절망적인 10년 뒤 미래 시나리오>,desperateScenarioPrompt:<절망적인 미래를 맞이한 해당 인물의 모습을 그리기 위해 이미지 생성 AI인 DALL·E에게 입력할 프롬프트>,plan:<희망적인 미래를 맞이하기 위한 계획>};-시나리오 답변 조건:한국어,'${name} 님은'으로 시작,인물의 재정상태를 수치로 표현,인물이 처한 상황과 심리 묘사,최소 200자;-프롬프트 생성 조건:write in English,expression and feeling of the person,describe person's behaviour,series of keyword not sentence,less than 100 words,comma seperated keywords;-계획 답변 조건:한국어 문장,달성해야 할 수치 제시,'해야합니다' 또는 '하는 것이 좋습니다' 등의 어미 사용,구체적인 계획 제시,최소 200자
  // `
  const condition = `조건={이름:${name},통장잔고:${
    balance.balance
  }원,월급:${salary},대출잔액:${loanBalance},대출이자율:${interestRate}%,월고정지출:${
    clothing + electricity + food + phone + rent + sewage
  }원,최근지출:${spend}원,최근수입:${receipt}원,${plan}지향적;`

  const target = {
    hopefulScenario: `주어진 조건에 맞게 시나리오 1개를 만들고 JSON 형식으로 답하세요.;{hopefulScenario:<희망적인 10년 뒤의 시나리오>};-시나리오 답변 조건:한국어,'${name} 님은'으로 시작,인물의 재정상태를 수치로 표현,인물이 처한 상황과 심리 묘사,최대 200자,no linefeed or '\n' in JSON format;`,
    hopefulScenarioPrompt: `주어진 조건에 맞게 프롬프트 1개를 만들고 JSON 형식으로 답하세요.;{hopefulScenarioPrompt:<희망적인 미래를 맞이한 인물의 모습을 그리기 위해 이미지 생성 AI인 DALL·E에게 입력할 프롬프트>};-프롬프트 생성 조건:write in English,expression and feeling of the person,describe person's behaviour,series of keyword not sentence,less than 100 words,comma seperated keywords;no linefeed or '\n' in JSON format`,
    desperateScenario: `주어진 조건에 맞게 시나리오 1개를 만들고 JSON 형식으로 답하세요.;{desperateScenario:<절망적인 10년 뒤의 시나리오>};-시나리오 답변 조건:한국어,'${name} 님은'으로 시작,인물의 재정상태를 수치로 표현,인물이 처한 상황과 심리 묘사,최대 200자,no linefeed or '\n' in JSON format;`,
    desperateScenarioPrompt: `주어진 조건에 맞게 프롬프트 1개를 만들고 JSON 형식으로 답하세요.;{desperateScenarioPrompt:<절망적인 미래를 맞이한 인물의 모습을 그리기 위해 이미지 생성 AI인 DALL·E에게 입력할 프롬프트>};-프롬프트 생성 조건:write in English,expression and feeling of the person,describe person's behaviour,series of keyword not sentence,less than 100 words,comma seperated keywords;no linefeed or '\n' in JSON format`,
    hopefulPlan: `주어진 조건에 맞게 계획 1개를 만들고 JSON 형식으로 답하세요.;{plan:<희망적인 미래를 맞이하기 위한 계획>};-계획 답변 조건:한국어 문장,달성해야 할 수치 제시,'해야합니다' 또는 '하는 것이 좋습니다' 등의 어미 사용,구체적인 계획 제시,최대 200자,no linefeed or '\n' in JSON format`,
  }

  const prompt = condition + target[flag]

  try {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(prompt),
    })

    if (res.ok) {
      const data = await res.json()
      return data
    } else throw Error
  } catch (error) {
    return
  }
}
