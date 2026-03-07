import type { CollectionAfterChangeHook } from 'payload'
import { evaluateCondition } from '../utils/evaluateCondition'

export const triggerWorkflow: CollectionAfterChangeHook = async ({
  doc,
  req,
  collection,
  operation,
}) => {
  try {
    const payload = req.payload

    console.log('================ HOOK START ================')
    console.log('Collection:', collection.slug)
    console.log('Operation:', operation)
    console.log('Doc ID:', doc.id)

    if (doc.workflowStatus === 'in-progress' || doc.workflowStatus === 'completed') {
      console.log('Workflow already started or completed')
      console.log('================ HOOK END ==================')
      return doc
    }

    const workflows = await payload.find({
      collection: 'workflow-configs' as any,
      where: {
        targetCollection: {
          equals: collection.slug,
        },
      },
    })

    if (!workflows.docs.length) {
      console.log(`No workflow found for ${collection.slug}`)
      console.log('================ HOOK END ==================')
      return doc
    }

    const workflow: any = workflows.docs[0]

    if (!workflow.steps || workflow.steps.length === 0) {
      console.log('Workflow exists but has no steps')
      console.log('================ HOOK END ==================')
      return doc
    }

    const firstStep: any = workflow.steps[0]

    // ✅ NOW evaluate condition
    const conditionPassed = evaluateCondition(doc, firstStep)

    if (!conditionPassed) {
      console.log('Condition did not pass for first step')
      console.log('================ HOOK END ==================')
      return doc
    }

    await payload.update({
      collection: collection.slug as any,
      id: doc.id,
      data: {
        currentStep: firstStep.stepName,
        workflowStatus: 'in-progress',
      },
      req,
      depth: 0,
    })

    await payload.create({
      collection: 'workflowLogs' as any,
      data: {
        workflow: workflow.id,
        documentId: String(doc.id),
        targetCollection: collection.slug,
        stepName: firstStep.stepName,
        action: operation === 'create' ? 'Workflow Started' : 'Workflow Re-Evaluated',
        comment: '',
        actedBy: (req.user as any)?.email || 'system',
      },
      req,
      depth: 0,
    })

    console.log('Workflow log created successfully')
    console.log('================ HOOK END ==================')

    return doc
  } catch (error) {
    console.error('HOOK ERROR:', error)
    return doc
  }
}
