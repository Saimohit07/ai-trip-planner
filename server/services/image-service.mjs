const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY

function getPlaceholderImage(query) {
  return {
    imageUrl: `https://picsum.photos/seed/${encodeURIComponent(query)}/1600/900`,
  }
}

export async function getImageForQuery(query) {
  if (!UNSPLASH_ACCESS_KEY) {
    return getPlaceholderImage(query)
  }

  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
    {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    }
  )

  if (!response.ok) {
    return getPlaceholderImage(query)
  }

  const data = await response.json()

  if (!data.results?.length) {
    return getPlaceholderImage(query)
  }

  return {
    imageUrl: data.results[0].urls.regular,
    photographer: data.results[0].user.name,
    photographerUrl: data.results[0].user.links.html,
  }
}
