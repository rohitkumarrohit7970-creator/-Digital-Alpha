import os

with open("src/components/transactions/TransactionDashboard.tsx", "r") as f:
    content = f.read()
content = content.replace("import { useTransactions, TransactionFilters as FilterType } from \"@/hooks/useTransactions\"", "import { useTransactions } from \"@/hooks/useTransactions\"")
with open("src/components/transactions/TransactionDashboard.tsx", "w") as f:
    f.write(content)

with open("src/components/ui/Input.tsx", "r") as f:
    content = f.read()
content = content.replace("export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}", "export type InputProps = React.InputHTMLAttributes<HTMLInputElement>")
with open("src/components/ui/Input.tsx", "w") as f:
    f.write(content)

with open("src/components/ui/Modal.tsx", "w") as f:
    f.write('export function Modal({ children, open }: { children: React.ReactNode, open: boolean }) { if (!open) return null; return <div>{children}</div> }\n')

with open("src/components/ui/Select.tsx", "w") as f:
    f.write('export function Select({ children }: { children: React.ReactNode }) { return <select>{children}</select> }\n')
