const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql'

const REPO_COUNT_QUERY = `
  query RepoCount {
    viewer {
      repositories(affiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER]) {
        totalCount
      }
    }
  }
`

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const token = process.env.GITHUB_TOKEN

  if (!token) {
    res.status(500).json({ error: 'Missing GitHub token' })
    return
  }

  try {
    const response = await fetch(GITHUB_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github+json',
      },
      body: JSON.stringify({ query: REPO_COUNT_QUERY }),
    })

    if (!response.ok) {
      res.status(response.status).json({ error: 'GitHub request failed' })
      return
    }

    const payload = await response.json()
    const totalCount = payload?.data?.viewer?.repositories?.totalCount

    if (!Number.isFinite(totalCount)) {
      res.status(500).json({ error: 'Unexpected GitHub response' })
      return
    }

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
    res.status(200).json({ totalCount })
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}
