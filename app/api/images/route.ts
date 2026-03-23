const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get("query")

  if (!query) {
    return Response.json({ error: "Query parameter is required" }, { status: 400 })
  }

  // If no Unsplash key is set, return a placeholder
  if (!UNSPLASH_ACCESS_KEY) {
    // Return a curated travel image from Unsplash Source (no API key needed)
    const placeholderUrl = `https://source.unsplash.com/1600x900/?${encodeURIComponent(query)}`
    return Response.json({ imageUrl: placeholderUrl })
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error("Failed to fetch from Unsplash")
    }

    const data = await response.json()

    if (data.results && data.results.length > 0) {
      return Response.json({
        imageUrl: data.results[0].urls.regular,
        photographer: data.results[0].user.name,
        photographerUrl: data.results[0].user.links.html,
      })
    }

    // Fallback to source.unsplash.com if no results
    const fallbackUrl = `https://source.unsplash.com/1600x900/?${encodeURIComponent(query)}`
    return Response.json({ imageUrl: fallbackUrl })
  } catch (error) {
    console.error("Error fetching image:", error)
    // Fallback to source.unsplash.com on error
    const fallbackUrl = `https://source.unsplash.com/1600x900/?${encodeURIComponent(query)}`
    return Response.json({ imageUrl: fallbackUrl })
  }
}
