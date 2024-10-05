import mapboxgl from "mapbox-gl";
mapboxgl.accessToken = "uIDEnHqIVetWK5zuULr6"; // Replace with your MapTiler API key

export async function getLocationByCoordinates(coord) {
  const { latitude, longitude } = coord;
  console.log("corr", coord);
  try {
    const response = fetch(
      `https://api.maptiler.com/geocoding/${longitude},${latitude}.json?key=${mapboxgl.accessToken}`
    );
    const data = response.then((res) => res.json());
    return data;
  } catch (err) {
    return null;
  }

}