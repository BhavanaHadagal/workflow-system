import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Blog } from './collections/Blog'
import { Contract } from './collections/Contract'
import { Workflows } from './collections/Workflows'
import { WorkflowLogs } from './collections/WorkflowLogs'
import { Users } from './collections/Users'
import {
  triggerWorkflowEndpoint,
  workflowStatusEndpoint,
} from './endpoints/workflowEndpoints'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  endpoints: [
  {
    path: '/custom-workflow-trigger',
    method: 'post',
    handler: triggerWorkflowEndpoint,
  },
  {
    path: '/custom-workflow-status/:docId',
    method: 'get',
    handler: workflowStatusEndpoint,
  },
],
  collections: [Users, Blog, Contract, Workflows, WorkflowLogs],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [],
})
