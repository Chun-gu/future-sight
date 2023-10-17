import { atom } from 'recoil'

export const promptAtom = atom({
  key: 'prompts',
  default: {
    name: '',
    hopefulScenario: '',
    hopefulScenarioPrompt: '',
    desperateScenario: '',
    desperateScenarioPrompt: '',
    hopefulPlan: '',
  },
})
