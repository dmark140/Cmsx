// types/approval-decision.ts
export interface ApprovalDecision {
  ApprovalNum: number
  DocNum: number
  FirstName: string
  LastName: string
  MiddleName: string
  Title: string
  description: string
  decision: number // 0=pending, 1=accepted, 2=rejected
}
