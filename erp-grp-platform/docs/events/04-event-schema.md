# Esquema de Eventos (ejemplos)

## EmployeeCreated
```json
{
  "eventType": "EmployeeCreated",
  "payload": {
    "employeeId": "uuid",
    "personId": "uuid",
    "positionId": "uuid",
    "hireDate": "2026-01-15",
    "status": "ACTIVE"
  }
}
```

## BudgetApproved
```json
{
  "eventType": "BudgetApproved",
  "payload": {
    "cycleId": "uuid",
    "fiscalYear": 2026,
    "totalAuthorized": 1500000000.00,
    "currency": "MXN",
    "approvedBy": "uuid"
  }
}
```

## PurchaseOrderCreated
```json
{
  "eventType": "PurchaseOrderCreated",
  "payload": {
    "purchaseOrderId": "uuid",
    "number": "OC-2026-000123",
    "supplierId": "uuid",
    "totalAmount": 250000.00,
    "currency": "MXN",
    "lines": [{"sku":"MAT-1","qty":10,"unitPrice":100.00}]
  }
}
```

## InvoiceGenerated
```json
{
  "eventType": "InvoiceGenerated",
  "payload": {
    "invoiceId": "uuid",
    "customerId": "uuid",
    "total": 11600.00,
    "currency": "MXN",
    "taxTotal": 1600.00
  }
}
```

## CitizenRegistered
```json
{
  "eventType": "CitizenRegistered",
  "payload": {
    "citizenId": "uuid",
    "curp": "AAAA900101HDFRRR09",
    "fullName": "Juan Pérez",
    "email": "juan@example.com"
  }
}
```
