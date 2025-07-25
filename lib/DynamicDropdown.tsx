'use client'

import { useEffect, useState } from 'react'
import { runQuery } from './utils'

type DropdownItem = {
  DocEntry: number
  Name: string
}

type DynamicDropdownProps = {
  queryText: string
  params?: any[] // <--- updated here
  onChange?: (value: string | number) => void
}

export default function DynamicDropdown({
  queryText,
  params = [],
  onChange,
}: DynamicDropdownProps) {
  const [items, setItems] = useState<DropdownItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await runQuery(queryText, params)
        setItems(res.data || [])
      } catch (err) {
        console.error('Dropdown fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    getData()
  }, [queryText, JSON.stringify(params)]) // stringified to track array changes

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value
    console.log('Selected value:', selectedValue)
    onChange?.(selectedValue)
  }

  return (
    <select
      className="bg-background border rounded px-2 py-1 w-full"
      onChange={handleChange}
      disabled={loading}
    >
      <option value="" className='bg-background'>Select...</option>
      {items.map((item) => (
        <option className='bg-background' key={item.DocEntry} value={item.DocEntry}>
          {item.Name}
        </option>
      ))}
    </select>
  )
}
