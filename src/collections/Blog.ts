import type { CollectionConfig } from 'payload'
import { triggerWorkflow } from '../hooks/triggerWorkflow'

export const Blog: CollectionConfig = {
  slug: 'blog',
  admin: {
    useAsTitle: 'title',
    components: {
      edit: {
        beforeDocumentControls: ['/components/WorkflowPanel'],
      },
    },
  },
  access: {
    update: ({ req }) => {
      const user = req.user as any

      if (!user) return false
      if (user.role === 'admin') return true

      return user.role === 'editor' || user.role === 'manager'
    },
  },
  hooks: {
    afterChange: [triggerWorkflow],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'textarea',
    },
    {
      name: 'workflowStatus',
      type: 'text',
      defaultValue: 'pending',
    },
    {
      name: 'currentStep',
      type: 'text',
    },
  ],
}
