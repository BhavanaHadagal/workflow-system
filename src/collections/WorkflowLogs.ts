import type { CollectionConfig } from 'payload'

export const WorkflowLogs: CollectionConfig = {
  slug: 'workflowLogs',
  admin: {
    useAsTitle: 'action',
  },
  access: {
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'workflow',
      type: 'relationship',
      relationTo: 'workflow-configs',
      required: true,
    },
    {
      name: 'documentId',
      type: 'text',
      required: true,
    },
    {
      name: 'targetCollection',
      type: 'text',
      required: true,
    },
    {
      name: 'stepName',
      type: 'text',
      required: true,
    },
    {
      name: 'action',
      type: 'text',
      required: true,
    },
    {
      name: 'comment',
      type: 'textarea',
    },
    {
      name: 'actedBy',
      type: 'text',
      required: true,
    },
    {
      name: 'timestamp',
      type: 'date',
      defaultValue: () => new Date(),
    },
  ],
}
