import { CollectionConfig } from 'payload'

export const Workflows: CollectionConfig = {
  slug: 'workflows',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'targetCollection',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Blogs',
          value: 'blog',
        },
        {
          label: 'Contracts',
          value: 'contracts',
        },
      ],
    },
    {
      name: 'steps',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'stepName',
          type: 'text',
          required: true,
        },
        {
          name: 'assignedRole',
          type: 'text',
          required: true,
        },
        {
          name: 'stepType',
          type: 'select',
          options: [
            { label: 'Review', value: 'review' },
            { label: 'Approval', value: 'approval' },
            { label: 'Sign Off', value: 'signoff' },
            { label: 'Comment Only', value: 'comment' },
          ],
        },
      ],
    },
  ],
}