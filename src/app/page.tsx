'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex w-full grow flex-col justify-between pb-20 pt-10">
      <h1 className="pt-40 text-center text-7xl font-extrabold">
        FUTURE SIGHT
      </h1>
      <Button asChild className="w-full">
        <Link href="/form">시작하기</Link>
      </Button>
    </div>
  )
}
