'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { runQuery } from '@/lib/utils'
import { useGlobalContext } from '@/context/GlobalContext'
import { toast } from 'sonner'
import { useGlobalPush } from '@/lib/router/useGlobalPush'

type LineItem = {
  lineNumber: number
  lineName: string
}

export default function LineItemForm() {
  const { push } = useGlobalPush()
  const { ID } = useGlobalContext()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [lineItems, setLineItems] = useState<LineItem[]>([])
  const [defaultLine, setDefaultLine] = useState<number | null>(null)
  const [useDefault, setUseDefault] = useState<boolean>(false)

  const handleAddLineItem = () => {
    setLineItems((prev) => [
      ...prev,
      { lineNumber: prev.length + 1, lineName: '' },
    ])
  }

  const handleLineNameChange = (index: number, value: string) => {
    const updated = [...lineItems]
    updated[index].lineName = value
    setLineItems(updated)
  }

  const handleRemoveLineItem = (indexToRemove: number) => {
    const updated = lineItems.filter((_, index) => index !== indexToRemove)
    const renumbered = updated.map((item, index) => ({
      ...item,
      lineNumber: index + 1,
    }))
    setLineItems(renumbered)

    if (defaultLine === indexToRemove + 1) {
      setDefaultLine(null)
    }
  }

  const handleSubmit = async () => {
    const data = {
      title,
      description,
      lineItems,
      defaultValue: useDefault
        ? lineItems.find((item) => item.lineNumber === defaultLine)
        : null,
    }
    try {
      const headerInsert = await runQuery("insertselectionlist", [ID, data.title, data.description])
      console.log({ headerInsert })
      const insertedID = await headerInsert.insertId ?? 0
      console.log({ headerInsert })

      if (insertedID != 0 && lineItems.length > 0) {
        data.lineItems.map(async (item) => {
          const res = await runQuery("insertselectionlist_fields", [insertedID, item.lineName, item.lineNumber])
          console.log(res)
        })
        toast("Added")
        push('./')
      }
    } catch (error) {
      console.log(error)
      toast("" + error)

    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 w-full">
      {/* Header */}
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold">Header</h2>
          <div className="space-y-2">
            <Label>Code</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
            />
          </div>
        </CardContent>
      </Card>

      {/* Line Items */}
      <Card>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Line Items</h2>
            <Button variant="outline" onClick={handleAddLineItem}>
              + Add Line Item
            </Button>
          </div>

          {lineItems.map((item, index) => (
            <div key={item.lineNumber} className="flex gap-4 w-full mb-2">
              <div className="w-full">
                <p>Selection {item.lineNumber}</p>
                <div className="flex gap-4">
                  <Input
                    value={item.lineName}
                    className="w-full"
                    onChange={(e) =>
                      handleLineNameChange(index, e.target.value)
                    }
                    placeholder="Enter line name"
                  />
                  <Button
                    variant="destructive"
                    onClick={() => handleRemoveLineItem(index)}
                    className="px-3"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Checkbox to Toggle Default Value */}
      {/* {lineItems.length > 0 && (
        <div className="flex items-center space-x-2">
          <Checkbox
            id="useDefault"
            checked={useDefault}
            onCheckedChange={(checked) => {
              // setUseDefault(Boolean(checked))
              if (!checked) setDefaultLine(null)
            }}
          />
          <Label htmlFor="useDefault">Does this form require a default value?</Label>
        </div>
      )} */}

      {/* Default Value Selector */}
      {useDefault && lineItems.length > 0 && (
        <Card>
          <CardContent className="space-y-4">
            <h2 className="text-xl font-semibold">Select Default Value</h2>
            <RadioGroup
              value={defaultLine?.toString() || ''}
              onValueChange={(value) => setDefaultLine(parseInt(value))}
            >
              {lineItems.map((item) => (
                <div key={item.lineNumber} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={item.lineNumber.toString()}
                    id={`line-${item.lineNumber}`}
                  />
                  <Label htmlFor={`line-${item.lineNumber}`}>
                    {`Line ${item.lineNumber}: ${item.lineName || '(Unnamed)'}`}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-between">
        <Button onClick={() => push('./')} variant="destructive">
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </div>
  )
}
