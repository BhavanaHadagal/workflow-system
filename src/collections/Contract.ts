import type { CollectionConfig } from 'payload'
import { triggerWorkflow } from '../hooks/triggerWorkflow'

export const Contract: CollectionConfig = {
  slug: 'contracts',
  admin: {
    useAsTitle: 'title',
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
      name: 'amount',
      type: 'number',
      required: true,
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