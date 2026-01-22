# 🧾 Perfect Labeler – Multi-Tenant SaaS (Supabase)

This project is a secure **multi-tenant receipt/label design system** built using **Supabase**, **PostgreSQL**, and **Edge Functions**.

Each user can access **only their own tenant’s data**. Tenant isolation is enforced using **Row Level Security (RLS)** and **Edge Functions**.

---

## 🚀 Features

- Multi-tenant SaaS architecture  
- One tenant → multiple users  
- Secure data isolation using RLS  
- Tenant ID never comes from client  
- Edge Functions handle all CRUD operations  
- API tested using CURL  
- Production-ready design  

---

## 🧠 How It Works (Simple Flow)

1. User logs in using Supabase Auth  
2. JWT contains only `user_id`  
3. Edge Function:
   - Validates user
   - Finds tenant_id from `tenant_users`
   - Performs DB operation securely  
4. RLS protects data from cross-tenant access  

---

## 🗂 Database Tables

### tenants
Stores tenant information.

### tenant_users
Maps users to tenants (supports multiple users per tenant).

### receipt_designs
Stores label/receipt designs per tenant.

### receipt_elements
stores receipt elements for receipt designs 

---

## 🔐 Security Model

- Users never send tenant_id
- Edge Functions inject tenant_id automatically
- Service role key used only inside Edge Functions
- RLS policies ensure tenant-level isolation

---
## 🧪 API Testing using CURL before adding edge function

### get access token(JWT token) - valid only 1 hr
```bash
curl -X POST "https://cvyagefdclimrizwgiis.supabase.co/auth/v1/token?grant_type=password" 
 -H "apikey: ANON_KEY"
 -H "Content-Type: application/json" 
 -d "{\"email\":\"test123@gmail.com\",\"password\":\"test@123\"}"
 ```

### Insert Design
```bash
curl -X POST "https://PROJECT_ID.supabase.co/rest/v1/receipt_designs" \
  -H "apikey: PUBLIC_ANON_KEY" \
  -H "Authorization: Bearer USER_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"tenant_id\":\"bb099da9-0a1f-49b1-b2b0-f75d30cff879\",\"name\":\" print\",\"width\":\"400\", \"height\":\"400\",}"
```

### Get Designs
```bash
curl -X GET "https://PROJECT_ID.supabase.co/rest/v1/receipt_designs?select=*" \
  -H "apikey: PUBLIC_ANON_KEY" \
  -H "Authorization: Bearer USER_ACCESS_TOKEN"
```

### Update Design
```bash
curl -X PATCH "https://PROJECT_ID.supabase.co/rest/v1/receipt_designs?id=eq.DESIGN_ID" \
  -H "apikey: PUBLIC_ANON_KEY" \
  -H "Authorization: Bearer USER_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"width\":500}"
```

### Delete Design
```bash
curl -X DELETE "https://PROJECT_ID.supabase.co/rest/v1/receipt_designs?id=eq.DESIGN_ID" \
  -H "apikey: PUBLIC_ANON_KEY" \
  -H "Authorization: Bearer USER_ACCESS_TOKEN"
```

---
---
##  API Testing Video

https://drive.google.com/file/d/1j7qeKoysmNBW8ic8nNm8aW-qoQoBjvtH/view?usp=drive_link

---
## 🧪 API Testing using CURL after adding edge function

### Insert Design
```bash
curl -X POST "https://PROJECT_ID.supabase.co/functions/v1/hyper-responder" \
  -H "apikey: PUBLIC_ANON_KEY" \
  -H "Authorization: Bearer USER_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Shipping Label",
    "width": 300,
    "height": 200
  }'
```

### Get Designs
```bash
curl -X GET "https://PROJECT_ID.supabase.co/functions/v1/hyper-responder" \
  -H "apikey: PUBLIC_ANON_KEY" \
  -H "Authorization: Bearer USER_JWT"
```

### Update Design
```bash
curl -X PATCH "https://PROJECT_ID.supabase.co/functions/v1/hyper-responder?id=DESIGN_ID" \
  -H "apikey: PUBLIC_ANON_KEY" \
  -H "Authorization: Bearer USER_JWT" \
  -H "Content-Type: application/json" \
  -d '{ "width": 400 }'
```

### Delete Design
```bash
curl -X DELETE "https://PROJECT_ID.supabase.co/functions/v1/hyper-responder?id=DESIGN_ID" \
  -H "apikey: PUBLIC_ANON_KEY" \
  -H "Authorization: Bearer USER_JWT"
```

---

## 🧑‍🤝‍🧑 Multi-User Tenant Support

- Multiple users can belong to the same tenant
- Controlled via `tenant_users` table
- All users under same tenant see shared data

---

## 🛠 Tech Stack

- Supabase (Auth, Database, Edge Functions)
- PostgreSQL
- Deno
- CURL

---

## 👩‍💻 Author

Vijayalakshmi  
 
