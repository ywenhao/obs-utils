type PromiseFn = (...args: any) => Promise<any>

/**
 * 并发控制
 * @param promiseList Promise 列表
 * @param limit 并发数
 * @returns 所有已完成的 promise 结果
 */
export async function promisePool<T extends PromiseFn>(
  promiseList: T[],
  limit: number,
) {
  const poolSet = new Set<Promise<any>>()
  let stopped = false
  let error: any = null

  const results: any[] = []

  for (const promiseFn of promiseList) {
    if (stopped)
      break

    if (poolSet.size >= limit)
      await Promise.race(poolSet)

    const p = promiseFn()
      .then((res) => {
        poolSet.delete(p)
        results.push(res)
      })
      .catch((err) => {
        poolSet.delete(p)
        stopped = true
        error = err
      })

    poolSet.add(p)
  }

  if (error)
    throw error
  return results
}
