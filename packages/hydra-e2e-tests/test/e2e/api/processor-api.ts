import { GraphQLClient } from 'graphql-request'
import Container from 'typedi'
import fetch from 'node-fetch'

import {
  FTS_COMMENT_QUERY,
  FIND_TRANSFER_BY_VALUE,
  FETCH_INSERTED_AT_FIELD_FROM_TRANSFER,
  FTS_COMMENT_QUERY_WITH_WHERE_CONDITION,
  LAST_BLOCK_TIMESTAMP,
} from './graphql-queries'

export interface Transfer {
  value: string
  from: string
  to: string
  block: number
}

const getGQLClient = () => Container.get<GraphQLClient>('ProcessorClient')

export async function findTransfersByComment(text: string): Promise<string[]> {
  const result = await getGQLClient().request<{
    commentSearch: {
      highlight: string
    }[]
  }>(FTS_COMMENT_QUERY, { text })

  return result.commentSearch.map((c) => c.highlight)
}

export async function findTransfersByValue(
  value: number,
  block: number
): Promise<Transfer[]> {
  const result = await getGQLClient().request<{
    transfers: {
      value: string
      from: string
      to: string
      block: number
    }[]
  }>(FIND_TRANSFER_BY_VALUE, { value: value.toString(), block })

  return result.transfers
}

export async function fetchDateTimeFieldFromTransfer(): Promise<Date> {
  const result = await getGQLClient().request<{
    transfers: {
      insertedAt: string
    }[]
  }>(FETCH_INSERTED_AT_FIELD_FROM_TRANSFER)

  return new Date(result.transfers[0].insertedAt)
}

export async function findTransfersByCommentAndWhereCondition(
  text: string,
  from: string,
  skip = 0
): Promise<
  {
    highlight: string
    rank: number
  }[]
> {
  const result = await getGQLClient().request<{
    commentSearch: {
      highlight: string
      rank: number
    }[]
  }>(FTS_COMMENT_QUERY_WITH_WHERE_CONDITION, { text, skip, from })
  return result.commentSearch
}

export async function lastTimestamp(): Promise<Number | undefined> {
  const result = await getGQLClient().request<{
    blockTimestamps: {
      timestamp: number
    }[]
  }>(LAST_BLOCK_TIMESTAMP)
  console.log(`Result: ${JSON.stringify(result)}`)
  return result.blockTimestamps.length > 0
    ? result.blockTimestamps[0].timestamp
    : undefined
}

export async function getMetric(metric: string): Promise<string> {
  const url = `${process.env.PROCESSOR_METRICS_ENDPOINT}/${metric}`

  const plain = await (await fetch(url)).text()
  const regex = `^(${metric})\\s+(\\w+)`

  const match = plain.match(new RegExp(regex, 'm'))

  if (match === null || match.length < 3) {
    throw new Error(`Can't match the regex: ${JSON.stringify(match, null, 2)}`)
  }
  return match[2]
}

export async function getNumberMetric(metric: string): Promise<number> {
  const metricString = await getMetric(metric)
  return Number.parseInt(metricString)
}

export async function getProcessorHead(): Promise<number> {
  return getNumberMetric('hydra_processor_last_scanned_block')
}
