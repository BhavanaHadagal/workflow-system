import type { PayloadRequest } from 'payload'

export const approveStepEndpoint = async (req: PayloadRequest) => {
  try {
    const payload = req.payload
    const body = (req.json && (await req.json())) || {}

    const { collection, docId, comment } = body as {
      collection?: string
      docId?: string
      comment?: string
    }

    if (!collection || !docId) {
      return Response.json(
        { message: 'collection and docId are required' },
        { status: 400 },
      )
    }

    const user = req.user as any

    if (!user) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const docs = await payload.find({
      collection: collection as any,
      where: {
        id: {
          equals: docId,
        },
      },
      depth: 0,
    })

    if (!docs.docs.length) {
      return Response.json({ message: 'Document not found' }, { status: 404 })
    }

    const doc: any = docs.docs[0]

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
      return Response.json({ message: 'Workflow not found' }, { status: 404 })
    }

    const workflow: any = workflows.docs[0]

    if (!workflow.steps || workflow.steps.length === 0) {
      return Response.json({ message: 'Workflow has no steps' }, { status: 400 })
    }

    if (!doc.currentStep) {
      return Response.json(
        { message: 'No active current step on this document' },
        { status: 400 },
      )
    }

    const currentStepIndex = workflow.steps.findIndex(
      (step: any) => step.stepName === doc.currentStep,
    )

    if (currentStepIndex === -1) {
      return Response.json(
        { message: 'Current step not found in workflow config' },
        { status: 400 },
      )
    }

    const currentStep = workflow.steps[currentStepIndex]
    const nextStep = workflow.steps[currentStepIndex + 1]
    const actedBy = user.email || 'system'

    const userRole = String(user.role || '').toLowerCase()
    const assignedRole = String(currentStep.assignedRole || '').toLowerCase()

    if (assignedRole && userRole !== assignedRole) {
      return Response.json(
        {
          message: `Only users with role "${currentStep.assignedRole}" can approve this step`,
        },
        { status: 403 },
      )
    }

    await payload.create({
      collection: 'workflowLogs' as any,
      data: {
        workflow: workflow.id,
        documentId: String(docId),
        targetCollection: collection,
        stepName: currentStep.stepName,
        action: 'Approved',
        comment: comment || '',
        actedBy,
      },
      req,
      depth: 0,
    })

    if (nextStep) {
      await payload.update({
        collection: collection as any,
        id: docId,
        data: {
          currentStep: nextStep.stepName,
          workflowStatus: 'in-progress',
        },
        req,
        depth: 0,
      })

      console.log(
        `Email notification: next step "${nextStep.stepName}" assigned to role "${nextStep.assignedRole}"`,
      )

      await payload.create({
        collection: 'workflowLogs' as any,
        data: {
          workflow: workflow.id,
          documentId: String(docId),
          targetCollection: collection,
          stepName: nextStep.stepName,
          action: 'Moved To Next Step',
          comment: '',
          actedBy: 'system',
        },
        req,
        depth: 0,
      })

      return Response.json({
        message: 'Step approved and moved to next step',
        workflowStatus: 'in-progress',
        currentStep: nextStep.stepName,
      })
    }

    await payload.update({
      collection: collection as any,
      id: docId,
      data: {
        currentStep: null,
        workflowStatus: 'completed',
      },
      req,
      depth: 0,
    })

    await payload.create({
      collection: 'workflowLogs' as any,
      data: {
        workflow: workflow.id,
        documentId: String(docId),
        targetCollection: collection,
        stepName: currentStep.stepName,
        action: 'Workflow Completed',
        comment: '',
        actedBy: 'system',
      },
      req,
      depth: 0,
    })

    return Response.json({
      message: 'Final step approved. Workflow completed.',
      workflowStatus: 'completed',
      currentStep: null,
    })
  } catch (error: any) {
    console.error('Approve step error:', error)
    return Response.json(
      { message: 'Internal server error', error: error?.message },
      { status: 500 },
    )
  }
}