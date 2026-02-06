import React from 'react'
import { NextRequest } from 'next/server'

export  async  function POST(req:NextRequest)  {
    const formData = await req.json()
    console.log(formData)
  return (
    <div>route</div>
  )
}
