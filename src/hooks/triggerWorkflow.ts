import type { CollectionAfterChangeHook } from 'payload'

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

    if (operation !== 'create') {
      console.log('Skipping because operation is not create')
      console.log('================ HOOK END ==================')
      return doc
    }

    const workflows = await payload.find({
      collection: 'workflows',
      where: {
        targetCollection: {
          equals: collection.slug,
        },
      },
    })

    console.log('Workflows found:', workflows.docs.length)

    if (!workflows.docs.length) {
      console.log(`No workflow found for ${collection.slug}`)
      console.log('================ HOOK END ==================')
      return doc
    }

    const workflow: any = workflows.docs[0]

    console.log('Workflow ID:', workflow.id)
    console.log('Workflow name:', workflow.name)
    console.log('Workflow steps:', workflow.steps)

    if (!workflow.steps || workflow.steps.length === 0) {
      console.log('Workflow exists but has no steps')
      console.log('================ HOOK END ==================')
      return doc
    }

    const firstStep: any = workflow.steps[0]
    console.log('First step:', firstStep)

    await payload.update({
      collection: collection.slug,
      id: doc.id,
      data: {
        currentStep: firstStep.stepName,
        workflowStatus: 'in-progress',
      },
      req,
      depth: 0,
    })

    console.log('Document updated successfully')

    await payload.create({
      collection: 'workflowLogs',
      data: {
        workflow: workflow.id,
        documentId: String(doc.id),
        collection: collection.slug,
        stepName: firstStep.stepName,
        action: 'Workflow Started',
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