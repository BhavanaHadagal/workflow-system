🧩 Dynamic Workflow Management System
Built with Payload CMS (Backend Developer Recruitment Task)
📌 Overview

This project implements a Dynamic Multi-Stage Workflow Management System inside Payload CMS.

The system allows admins to:

Create reusable workflows dynamically

Attach workflows to any collection (Blog, Contract, etc.)

Define unlimited workflow steps

Assign steps to roles

Track approvals via audit logs

Enforce role-based step locking

Trigger workflows automatically via hooks

Access workflow data via custom REST APIs

🎯 Objective

To build a reusable workflow engine where documents go through multi-stage approval processes dynamically through the Payload Admin UI.

🏗 System Architecture
Core Collections
1️⃣ Users

Authentication collection

Role-based system:

admin

editor

manager

2️⃣ Workflow Configs (workflow-configs)

Defines workflows dynamically.

Each workflow contains:

name

targetCollection

steps[]

Each step includes:

stepName

assignedRole

stepType (approval, review, sign-off, comment-only)

Optional condition fields

Workflows can be attached to:

Blog

Contract

Any other collection

3️⃣ Workflow Logs (workflowLogs)

Immutable audit trail collection.

Stores:

Workflow ID

Target collection

Document ID

Step name

Action (Started, Approved, Moved To Next Step, Completed)

User who acted

Timestamp

Comment

⚠ Logs are not editable.
⚙ Core Features Implemented
✅ 1. Dynamic Workflow Engine

Unlimited steps supported

Step progression logic implemented

Steps move sequentially

Workflow auto-completes after final step

Step locking based on assigned role

Email notifications simulated via console.log

✅ 2. Automatic Workflow Trigger

Implemented using Payload afterChange hook:

Triggered when document is created

Automatically assigns first step

Creates initial workflow log

✅ 3. Admin UI Injection

Custom Workflow Panel added to collection edit view:

Displays:

Workflow status

Current step

Approval comment box

Approve Current Step button

Recent logs

Inline action enabled:

Approve current step

Role enforcement:

Only assigned role can approve

Admin can override

✅ 4. Audit Trail (Immutable Logs)

All actions recorded in workflowLogs:

Workflow started

Step approved

Step progressed

Workflow completed

Logs cannot be edited from Admin UI.

✅ 5. Custom REST APIs
1️⃣ POST /api/workflows/approve

Approves current step and moves workflow forward.

Request Body:

{
  "collection": "blogs",
  "docId": "123",
  "comment": "Approved by manager"
}
2️⃣ GET /api/workflows/status/:docId

Returns:

Workflow status

Current step

Logs

Example Response:

{
  "workflowStatus": "in-progress",
  "currentStep": "Review",
  "logs": []
}
🔐 Role-Based Step Locking

If a step is assigned to editor:

Only editor can approve

Manager receives 403 error

Admin can override

Enforced inside approveStepEndpoint.

🧪 How to Test
Step 1

Create users:

Admin

Editor

Manager

Step 2

Create Workflow Config:

Target Collection: Blog

Step 1: Review (assigned to editor)

Step 2: Manager Approval (assigned to manager)

Step 3

Create new Blog

Expected:

Status: in-progress

Current Step: Review

Step 4

Login as Manager → Try Approve

Expected:

403 Forbidden

Step 5

Login as Editor → Approve

Expected:

Moves to Manager Approval step

📂 Project Structure (Important Files)

collections/
  ├── Users.ts
  ├── Blogs.ts
  ├── Contracts.ts
  ├── WorkflowConfigs.ts
  └── WorkflowLogs.ts

hooks/
  └── triggerWorkflow.ts

endpoints/
  ├── approveStep.ts
  └── workflowStatus.ts

components/
  └── WorkflowPanel.tsx

🚀 Setup Instructions
1️⃣ Install Dependencies
npm install
2️⃣ Start Development Server
npm run dev

Admin Panel:

http://localhost:3000/admin
🛠 Tech Stack

Node.js

TypeScript

Payload CMS

MongoDB

Custom Admin Components

Hooks & Plugins