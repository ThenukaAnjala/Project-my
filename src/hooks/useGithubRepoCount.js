import { useEffect, useState } from 'react'

export const useGithubRepoCount = (githubUsername) => {
  const [repoCount, setRepoCount] = useState(null)

  useEffect(() => {
    if (!githubUsername) {
      return undefined
    }

    const controller = new AbortController()
    let isMounted = true
    const privateReposOverride = Number(import.meta.env.VITE_GITHUB_PRIVATE_REPOS)
    const hasPrivateOverride = Number.isFinite(privateReposOverride)
    const headers = { Accept: 'application/vnd.github+json' }
    const fallbackUrl = `https://api.github.com/users/${githubUsername}`

    const fetchRepoCount = async () => {
      let total = null

      try {
        const response = await fetch('/api/github-repo-count', { signal: controller.signal })
        if (response.ok) {
          const data = await response.json()
          const apiTotal = Number(data?.totalCount)
          if (Number.isFinite(apiTotal)) {
            total = apiTotal
          }
        }
      } catch (error) {
        if (controller.signal.aborted) {
          return
        }
      }

      if (total === null) {
        try {
          const response = await fetch(fallbackUrl, { headers, signal: controller.signal })
          if (!response.ok) {
            throw new Error(`GitHub request failed with status ${response.status}`)
          }
          const data = await response.json()
          const publicRepos = Number(data.public_repos)

          if (Number.isFinite(publicRepos)) {
            const privateRepos = hasPrivateOverride ? privateReposOverride : 0
            total = publicRepos + (Number.isFinite(privateRepos) ? privateRepos : 0)
          }
        } catch (error) {
          if (controller.signal.aborted) {
            return
          }
        }
      }

      if (!isMounted || controller.signal.aborted) {
        return
      }

      setRepoCount(total)
    }

    fetchRepoCount()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [githubUsername])

  return repoCount
}
