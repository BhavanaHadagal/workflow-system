import { CollectionConfig } from 'payload'
import { triggerWorkflow } from '../hooks/triggerWorkflow'

export const Blog: CollectionConfig = {
  slug: 'blog',
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