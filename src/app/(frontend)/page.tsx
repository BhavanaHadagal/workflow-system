import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import config from '@/payload.config'
import './styles.css'

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#000',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div style={{ maxWidth: 800, textAlign: 'center' }}>
        <h1 style={{ fontSize: '56px', marginBottom: '16px' }}>
          Dynamic Workflow Management System
        </h1>

        <p style={{ fontSize: '20px', lineHeight: 1.6, marginBottom: '32px' }}>
          A Payload CMS based workflow engine for Blog and Contract approvals with
          multi-step progression, role-based approval, audit logs, conditions, and admin UI integration.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="/admin"
            style={{
              padding: '12px 20px',
              background: '#fff',
              color: '#000',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Open Admin Panel
          </a>

          <a
            href="/admin/collections/blog"
            style={{
              padding: '12px 20px',
              border: '1px solid #666',
              color: '#fff',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            View Blog Collection
          </a>
        </div>

        <div style={{ marginTop: '40px', fontSize: '16px', opacity: 0.85 }}>
          <p>✅ Multi-step workflows</p>
          <p>✅ Role-based approvals</p>
          <p>✅ Condition-based triggers</p>
          <p>✅ Immutable workflow logs</p>
          <p>✅ Custom admin workflow panel</p>
        </div>
      </div>
    </main>
  )
}
