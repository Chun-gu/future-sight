'use client'
import { useEffect, useState } from 'react'

import Image from 'next/image'
import { useRecoilValue } from 'recoil'

import { promptAtom } from '@/atoms/promptAtom'
import { Separator } from '@/components/ui/separator'
import getDallePainting from '@/lib/api/getDallePainting'

export default function Page() {
  const prompts = useRecoilValue(promptAtom)
  const [images, setImages] = useState<string[]>([])

  useEffect(() => {
    async function getImages() {
      if (!prompts.desperateScenarioPrompt || !prompts.hopefulScenarioPrompt)
        return

      const temp = [] as string[]
      await Promise.allSettled([
        getDallePainting(prompts.hopefulScenarioPrompt),
        getDallePainting(prompts.desperateScenarioPrompt),
      ])
        .then((result) => {
          result.forEach((val) => {
            if (val.status === 'fulfilled') {
              temp.push(val.value)
            }
          })
        })
        .finally(() => {
          setImages(temp)
        })
    }
    getImages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <h1 className="text-xl font-extrabold">{prompts.name}님의 미래는...</h1>

      <Separator className="my-4" />

      <section className="mb-4">
        <h2 className="text-lg font-semibold">희망편</h2>

        <p>{prompts.hopefulScenario}</p>
        <div className="relative aspect-square w-full">
          {images.length > 0 && (
            <Image src={images[0]} fill alt={prompts.hopefulScenarioPrompt} />
          )}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">절망편</h2>
        <p>{prompts.desperateScenario}</p>
        <div className="relative aspect-square w-full">
          {images.length > 0 && (
            <Image src={images[1]} fill alt={prompts.desperateScenarioPrompt} />
          )}
        </div>
      </section>
    </>
  )
}
