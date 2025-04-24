const RADAR_API_KEY = import.meta.env.PUBLIC_RADAR_API_KEY;

export async function searchCities(query) {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    if (!RADAR_API_KEY) {
      throw new Error("Radar API Key is not set");
    }

    const response = await fetch(
      `https://api.radar.io/v1/search/autocomplete?query=${encodeURIComponent(
        query
      )}&layers=locality&limit=5`,
      {
        method: "GET",
        headers: {
          Authorization: RADAR_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Radar API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    return data.addresses.map((address) => ({
      address: `${address.city}, ${address.state} ${address.countryCode}`,
      latitude: address.latitude,
      longitude: address.longitude,
    }));
  } catch (error) {
    console.error("Error fetching cities:", error);
    throw error;
  }
}
