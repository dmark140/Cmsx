type ChartAccount = {
  DocEntry: number
  Code: string
  Name: string
  type: string
  Status: string
}

export default function MappingList({
  mappings,
  accounts,
}: {
  mappings: { expenseDocEntry: number; cashDocEntry: number }[]
  accounts: ChartAccount[]
}) {
  const findName = (docEntry: number) =>
    accounts.find(c => c.DocEntry === docEntry)?.Name || "Unknown"

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">Current Mappings</h3>
      <ul className="space-y-2">
        {mappings.map((m, i) => (
          <li key={i} className="border rounded p-2 text-sm">
            <strong>Expense:</strong> {findName(m.expenseDocEntry)} → <strong>Cash:</strong> {findName(m.cashDocEntry)}
          </li>
        ))}
      </ul>
    </div>
  )
}
