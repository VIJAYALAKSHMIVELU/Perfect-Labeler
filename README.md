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

---

## 🔐 Security Model

- Users never send tenant_id
- Edge Functions inject tenant_id automatically
- Service role key used only inside Edge Functions
- RLS policies ensure tenant-level isolation

---

## 🧪 API Testing using CURL

### Insert Design
```bash
curl -X POST "https://PROJECT_ID.supabase.co/functions/v1/insert-receipt-design" \
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
curl -X GET "https://PROJECT_ID.supabase.co/functions/v1/insert-receipt-design" \
  -H "apikey: PUBLIC_ANON_KEY" \
  -H "Authorization: Bearer USER_JWT"
```

### Update Design
```bash
curl -X PATCH "https://PROJECT_ID.supabase.co/functions/v1/insert-receipt-design?id=DESIGN_ID" \
  -H "apikey: PUBLIC_ANON_KEY" \
  -H "Authorization: Bearer USER_JWT" \
  -H "Content-Type: application/json" \
  -d '{ "width": 400 }'
```

### Delete Design
```bash
curl -X DELETE "https://PROJECT_ID.supabase.co/functions/v1/insert-receipt-design?id=DESIGN_ID" \
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

## 📄 Submission Notes

- Industry-standard SaaS architecture
- Secure and scalable
- Suitable for internships and interviews

---

## 👩‍💻 Author

Vijayalakshmi  
B.Tech IT  
