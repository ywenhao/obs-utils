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

  for (const promiseFn of promiseList) {
    if (stopped)
      break

    // 大于limit时需要等待任意一个promise完成
    if (poolSet.size >= limit)
      await Promise.race(poolSet)

    const p = promiseFn()
      .then(() => {
        poolSet.delete(p)
      })
      .catch((err) => {
        poolSet.delete(p)
        stopped = true
        error = err
      })

    poolSet.add(p)
  }

  // 等待所有promise完成
  await Promise.all(poolSet)

  if (error)
    throw error
}
