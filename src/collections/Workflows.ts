import { CollectionConfig } from 'payload'

export const Workflows: CollectionConfig = {
  slug: 'workflow-configs',
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
        {
          name: 'conditionField',
          type: 'text',
          admin: {
            condition: (data) => {
              return data?.targetCollection === 'contracts'
            },
          },
        },
        {
          name: 'conditionOperator',
          type: 'select',
          options: [
            { label: 'Equals', value: '=' },
            { label: 'Greater Than', value: '>' },
            { label: 'Less Than', value: '<' },
            { label: 'Greater Than or Equal', value: '>=' },
            { label: 'Less Than or Equal', value: '<=' },
          ],
          admin: {
            condition: (data) => {
              return data?.targetCollection === 'contracts'
            },
          },
        },
        {
          name: 'conditionValue',
          type: 'text',
          admin: {
            condition: (data) => {
              return data?.targetCollection === 'contracts'
            },
          },
        },
      ],
    },
  ],
}
