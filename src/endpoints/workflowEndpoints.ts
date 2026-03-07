import type { PayloadRequest } from 'payload'

export const triggerWorkflowEndpoint = async (req: PayloadRequest) => {
  try {
    const payload = req.payload
    const body = (req.json && (await req.json())) || {}

    const { collection, docId } = body as {
      collection?: string
      docId?: string
    }

    if (!collection || !docId) {
      return Response.json(
        { message: 'collection and docId are required' },
        { status: 400 },
      )
    }

    const doc: any = await payload.findByID({
      collection: collection as any,
      id: docId,
      depth: 0,
    })

    if (!doc) {
      return Response.json({ message: 'Document not found' }, { status: 404 })
    }

    const workflows = await payload.find({
      collection: 'workflow-configs' as any,
      where: {
        targetCollection: {
          equals: collection,
        },
      },
      depth: 0,
    })

    if (!workflows.docs.length) {
      return Response.json(
        { message: `No workflow found for ${collection}` },
        { status: 404 },
      )
    }

    const workflow: any = workflows.docs[0]

    if (!workflow.steps || workflow.steps.length === 0) {
      return Response.json(
        { message: 'Workflow has no steps' },
        { status: 400 },
      )
    }

    const firstStep = workflow.steps[0]

    await payload.update({
      collection: collection as any,
      id: docId,
      data: {
        workflowStatus: 'in-progress',
        currentStep: firstStep.stepName,
      },
      depth: 0,
      req,
    })

   await payload.create({
  collection: 'workflowLogs' as any,
  data: {
    workflow: workflow.id,
    documentId: String(docId),
    targetCollection: collection,  // ✅ FIXED
    stepName: firstStep.stepName,
    action: 'Workflow Triggered Manually',
    comment: '',
    actedBy: 'system',
  },
  req,
})

    return Response.json({
      message: 'Workflow triggered successfully',
      workflowId: workflow.id,
      currentStep: firstStep.stepName,
      status: 'in-progress',
    })
  } catch (error: any) {
    console.error('Trigger workflow error:', error)
    return Response.json(
      { message: 'Internal server error', error: error?.message },
      { status: 500 },
    )
  }
}

export const workflowStatusEndpoint = async (req: PayloadRequest) => {
  try {
    const payload = req.payload

    const docId = (req.routeParams as any)?.docId

    if (!docId) {
      return Response.json({ message: 'docId is required' }, { status: 400 })
    }

    const blogResult = await payload.find({
      collection: 'blog' as any,
      where: {
        id: {
          equals: docId,
        },
      },
      depth: 0,
    })

    const contractResult = await payload.find({
      collection: 'contracts' as any,
      where: {
        id: {
          equals: docId,
        },
      },
      depth: 0,
    })

    let foundDoc: any = null
    let foundCollection = ''

    if (blogResult.docs.length) {
      foundDoc = blogResult.docs[0]
      foundCollection = 'blog'
    } else if (contractResult.docs.length) {
      foundDoc = contractResult.docs[0]
      foundCollection = 'contracts'
    }

    if (!foundDoc) {
      return Response.json({ message: 'Document not found' }, { status: 404 })
    }

    const logs = await payload.find({
      collection: 'workflowLogs' as any,
      where: {
        documentId: {
          equals: String(docId),
        },
      },
      depth: 1,
    })

    return Response.json({
      documentId: docId,
      collection: foundCollection,
      workflowStatus: foundDoc.workflowStatus || 'pending',
      currentStep: foundDoc.currentStep || null,
      logs: logs.docs.map((log: any) => ({
        action: log.action,
        stepName: log.stepName,
        actedBy: log.actedBy,
        comment: log.comment,
        timestamp: log.timestamp || log.createdAt,
      })),
    })
  } catch (error: any) {
    console.error('Workflow status error:', error)
    return Response.json(
      { message: 'Internal server error', error: error?.message },
      { status: 500 },
    )
  }
}