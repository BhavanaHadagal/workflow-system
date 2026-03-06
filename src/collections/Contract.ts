import { CollectionConfig } from 'payload'
import { triggerWorkflow } from '../hooks/triggerWorkflow'

export const Contract: CollectionConfig = {
  slug: 'contracts',
  admin: {
    useAsTitle: 'title',
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