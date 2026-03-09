# 🧩 Dynamic Workflow Management System  
### Backend Developer Recruitment Task

---

## 📌 Overview

This project implements a **Dynamic Multi-Stage Workflow Management System** using **Payload CMS**.

The system allows administrators to:

- Create reusable workflows dynamically
- Attach workflows to multiple collections (Blog, Contract)
- Define unlimited workflow steps
- Assign each step to specific roles
- Enforce role-based approvals
- Trigger workflows automatically
- Track all actions with immutable audit logs
- Manage workflow state directly from Admin UI
- Access workflow information through REST APIs

---

# 🎯 Objective

To build a reusable workflow engine where documents pass through multi-stage approval processes dynamically within Payload CMS.

---

# 🏗 System Architecture

## 1️⃣ Users (Authentication Collection)

Role-based system implemented:

- admin
- editor
- manager
- reviewer

Role is used for step-level approval enforcement.

---

## 2️⃣ Workflow Configs (`workflow-configs`)

Defines dynamic workflows.

Each workflow contains:

- name
- targetCollection
- steps[]

Each step includes:

- stepName
- assignedRole
- stepType (review, approval, signoff, comment)
- Optional condition fields (for conditional workflow start)

Workflows can be attached to:
- Blog
- Contract
- Any future collection

---

## 3️⃣ Workflow Logs (`workflowLogs`)

Immutable audit trail collection.

Stores:

- workflow
- documentId
- targetCollection
- stepName
- action
- comment
- actedBy
- timestamp

Logs cannot be edited or deleted.

---

## 4️⃣ Blog Collection

Fields:

- title
- content
- workflowStatus
- currentStep

Workflow starts automatically on document creation.

---

## 5️⃣ Contract Collection

Fields:

- title
- amount
- workflowStatus
- currentStep

Supports condition-based workflow trigger.

Example:
- Workflow starts only if amount >= 10000

---

# 🔐 Role-Based Permissions

## 🛡 Admin

Can:
- Create/edit/delete any collection
- Create and modify workflow configs
- Approve any step (override)
- View all logs
- Create users and assign roles

Cannot:
- Edit workflow logs (immutable)

---

## 📝 Editor

Can:
- Create and edit blog posts
- Approve steps assigned to editor
- View workflow logs
- Add approval comments

Cannot:
- Approve steps assigned to manager
- Modify workflow configs
- Edit logs

---

## 👔 Manager

Can:
- Approve steps assigned to manager
- View workflow logs
- Add approval comments

Cannot:
- Approve steps assigned to editor
- Modify workflow configs
- Edit logs

---

## 👀 Reviewer

Can:
- View documents
- View workflow status
- View logs

Cannot:
- Approve steps
- Modify workflows
- Edit logs

---

# ⚙ Core Features Implemented

## ✅ Dynamic Multi-Step Workflow Engine

- Unlimited steps
- Sequential progression
- Automatic completion at final step
- Role-based approval enforcement
- Email notification simulation via console.log

---

## ✅ Automatic Workflow Trigger (Hook)

Implemented via afterChange hook:

- Assigns first step automatically
- Sets workflowStatus = in-progress
- Creates initial workflow log

---

## ✅ Real Step Progression

When approving:

- Current step is approved
- Log created
- Moves to next step
- If no next step → workflow marked as completed

---

## ✅ Condition-Based Workflow Start

Example:

If Contract amount >= 10000 → workflow starts  
If Contract amount < 10000 → workflow does not start

---

## ✅ Immutable Audit Logs

All actions recorded:

- Workflow Started
- Approved
- Moved To Next Step
- Workflow Completed

Logs cannot be edited.

---

## ✅ Custom Admin UI Injection

Workflow Panel added to document edit view.

Displays:

- Workflow Status
- Current Step
- Logs
- Comment Box
- Approve Button

---

## ✅ Custom REST APIs

### Approve Current Step

POST /api/workflows/approve

Request Body:

{
  "collection": "blog",
  "docId": "DOCUMENT_ID",
  "comment": "Approved by manager"
}

---

### Workflow Status

GET /api/workflows/status/:docId

Response:

{
  "workflowStatus": "in-progress",
  "currentStep": "Review",
  "logs": []
}

---

# 🧪 Testing Guide

### Step 1 – Create Users

Create:
- Admin
- Editor
- Manager

---

### Step 2 – Create Workflow Config

Example Blog Workflow:

Step 1:
- Step Name: Review
- Assigned Role: editor

Step 2:
- Step Name: Manager Approval
- Assigned Role: manager

---

### Step 3 – Create Blog

Expected:
- workflowStatus = in-progress
- currentStep = Review

---

### Step 4 – Role Enforcement Test

Login as manager → try approving Review step  
Expected: Forbidden

Login as editor → approve  
Expected: Moves to Manager Approval step

---

### Step 5 – Contract Condition Test

Create Contract with:

Amount = 5000  
Expected: No workflow start

Create Contract with:

Amount = 15000  
Expected: Workflow starts

---

# 🚀 Setup Instructions

## 1️⃣ Clone Repository

git clone <repo-url>  
cd workflow-system

---

## 2️⃣ Install Dependencies

npm install  
or  
pnpm install

---

## 3️⃣ Configure Environment Variables

Create `.env` file:

DATABASE_URL=your_mongodb_connection_string  
PAYLOAD_SECRET=your_secret_key  

---

## 4️⃣ Run Development Server

npm run dev  

Open:

http://localhost:3000/admin

---

# 🌍 Deployment (Vercel)

1. Push project to GitHub
2. Import repository into Vercel
3. Add environment variables:
   - DATABASE_URL
   - PAYLOAD_SECRET
   - NEXT_PUBLIC_SERVER_URL
4. Deploy
5. Test admin panel and workflows

---

# 🛠 Tech Stack

- Node.js
- TypeScript
- Payload CMS
- MongoDB
- Next.js
- Custom Admin Components
- REST APIs

---

# 📂 Project Structure

src/
  collections/
    Users.ts
    Blog.ts
    Contract.ts
    WorkflowConfigs.ts
    WorkflowLogs.ts

  hooks/
    triggerWorkflow.ts

  endpoints/
    approveStep.ts
    workflowStatus.ts

  components/
    WorkflowPanel.tsx

---

# 📊 Requirement Coverage

| Requirement | Status |
|------------|--------|
| Dynamic Workflow Creation | ✅ |
| Unlimited Steps | ✅ |
| Role Assignment | ✅ |
| Admin UI Injection | ✅ |
| Audit Logs | ✅ |
| REST APIs | ✅ |
| Hook-based Trigger | ✅ |
| Step Progression | ✅ |
| Condition Support | ✅ |
| Role Enforcement | ✅ |

---

# 💡 Conclusion

This implementation delivers a fully functional dynamic workflow engine built inside Payload CMS.

The system demonstrates:

- Backend architecture design
- Role-based security
- Multi-step progression
- Conditional workflow logic
- CMS customization
- Clean API design

The solution is modular, reusable, and extensible for future collections.
