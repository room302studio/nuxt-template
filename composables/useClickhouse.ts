import { createClient } from '@clickhouse/client-web'
import { useRuntimeConfig } from '#imports'

export const useClickHouse = (servicePrefix: string = 'issuebuilder') => {
  const config = useRuntimeConfig()

  const clickhouseClient = createClient({
    url: config.public.CLICKHOUSE_HOST,
    username: config.public.CLICKHOUSE_USER,
    password: config.public.CLICKHOUSE_PASSWORD,
    application: `${servicePrefix}-web`
  })

  const insertEvent = async (action: string, metric: number = 1, additionalData: Record<string, any> = {}) => {
    try {
      const prefixedAction = `${servicePrefix}-${action}`
      
      await clickhouseClient.insert({
        table: 'events',
        values: [
          {
            user: additionalData.user || null,
            date: new Date().toISOString(),
            action: prefixedAction,
            metric,
            ...additionalData
          }
        ],
        format: 'JSONEachRow',
      })
    } catch (error) {
      console.error('Error inserting event into ClickHouse:', error)
    }
  }

  return {
    insertEvent
  }
}
