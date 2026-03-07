'use client'

import React, { useEffect, useState } from 'react'
import { useDocumentInfo } from '@payloadcms/ui'

type WorkflowLog = {
  action: string
  stepName: string
  actedBy: string
  comment?: string
  timestamp?: string
}

type WorkflowStatusResponse = {
  documentId: string
  collection: string
  workflowStatus: string
  currentStep: string | null
  logs: WorkflowLog[]
}

export default function WorkflowPanel() {
  const { id, collectionSlug } = useDocumentInfo()
  const [data, setData] = useState<WorkflowStatusResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')

  const fetchStatus = async () => {
    if (!id) return

    try {
      setLoading(true)
      setError('')

      const res = await fetch(`/api/workflows/status/${id}`)
      const json = await res.json()

      if (!res.ok) {
        throw new Error(json?.message || 'Failed to fetch workflow status')
      }

      setData(json)
    } catch (err: any) {
      setError(err?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [id])

  const handleApprove = async () => {
    if (!id) return

    try {
      setError('')

      const res = await fetch('/api/workflows/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collection: collectionSlug,
          docId: id,
          comment: comment || 'Approved from admin panel',
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        alert(json?.message || 'Failed to approve step')
        return
      }

      window.location.reload()
    } catch (err: any) {
      setError(err?.message || 'Failed to approve step')
    }
  }

  if (!id) return null

  const isFinished = data?.workflowStatus === 'completed' || data?.workflowStatus === 'rejected'

  return (
    <div
      style={{
        width: 300,
        maxWidth: 300,
        padding: '18px 14px 14px 14px',
        border: '1px solid #333',
        borderRadius: 10,
        background: '#111',
        marginRight: 8,
        marginTop: 150,
        boxSizing: 'border-box',
      }}
    >
      <h4 style={{ margin: '0 0 10px 0', fontSize: 18 }}>Workflow</h4>

      {loading ? (
        <p style={{ margin: 0 }}>Loading...</p>
      ) : (
        <>
          <div style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 10 }}>
            <div>
              <strong>Status:</strong> {data?.workflowStatus || 'pending'}
            </div>
            <div>
              <strong>Step:</strong> {data?.currentStep || 'N/A'}
            </div>
            <div>
              <strong>Logs:</strong> {data?.logs?.length || 0}
            </div>
          </div>

          {error ? (
            <div style={{ color: '#ff6b6b', fontSize: 13, marginBottom: 10 }}>{error}</div>
          ) : null}

          <div style={{ marginBottom: 10 }}>
            <label
              htmlFor="workflow-comment"
              style={{
                display: 'block',
                marginBottom: 6,
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Comment
            </label>

            <textarea
              id="workflow-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add approval comment"
              style={{
                width: '100%',
                minHeight: 60,
                padding: 8,
                borderRadius: 8,
                border: '1px solid #555',
                backgroundColor: '#1a1a1a',
                color: '#fff',
                resize: 'vertical',
                boxSizing: 'border-box',
                fontSize: 14,
              }}
            />
          </div>

          <button
            onClick={handleApprove}
            disabled={isFinished}
            style={{
              width: '100%',
              padding: '9px 12px',
              borderRadius: 8,
              border: 'none',
              cursor: isFinished ? 'not-allowed' : 'pointer',
              opacity: isFinished ? 0.6 : 1,
              marginBottom: 14,
            }}
          >
            Approve Current Step
          </button>

          <div>
            <h5 style={{ margin: '0 0 8px 0', fontSize: 15 }}>Recent Logs</h5>

            <div
              style={{
                maxHeight: 150,
                overflowY: 'auto',
                borderTop: '1px solid #222',
                paddingTop: 6,
              }}
            >
              {data?.logs?.length ? (
                data.logs.slice(0, 2).map((log, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '8px 0',
                      borderBottom: '1px solid #222',
                      fontSize: 13,
                      lineHeight: 1.45,
                    }}
                  >
                    <div>
                      <strong>{log.stepName}</strong> — {log.action}
                    </div>

                    <div style={{ opacity: 0.85 }}>by {log.actedBy}</div>

                    {log.timestamp ? (
                      <div style={{ opacity: 0.65 }}>
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    ) : null}

                    {log.comment ? (
                      <div style={{ marginTop: 3 }}>Comment: {log.comment}</div>
                    ) : null}
                  </div>
                ))
              ) : (
                <p style={{ margin: 0, fontSize: 13 }}>No logs yet.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
