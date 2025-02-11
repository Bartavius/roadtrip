import { useEffect } from "react";

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "";

interface Location {address:String, latitude: number,  longitude: number;}

export default function GoogleMap({location1, location2} : {location1: Location, location2: Location}) {
  useEffect(() => {
    const loadMap = () => {
      const mapElement = document.getElementById("map");
      if (!mapElement) {
        console.error("Map element not found");
        return;
      }
      const map = new google.maps.Map(mapElement, {
        center: { lat: location1.latitude - location2.latitude, lng: location1.longitude - location2.longitude }, // Tokyo Example
        zoom: 10,
      });

      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer();
      directionsRenderer.setMap(map);

      directionsService.route(
        {
          origin: {lat: location1.latitude, lng: location1.longitude},
          destination: {lat: location2.latitude, lng: location2.longitude},
          travelMode: google.maps.TravelMode.DRIVING,
          provideRouteAlternatives: true,
          drivingOptions: {
            departureTime: new Date(),
            trafficModel: google.maps.TrafficModel.BEST_GUESS,
          },
          // routingPreference: "FUEL_EFFICIENT", // Eco-friendly routing
        },
        (result, status) => {
          if (status === "OK") {
            directionsRenderer.setDirections(result);
          } else {
            console.error("Error fetching directions:", status);
          }
        }
      );
    };

    if (window.google) {
      loadMap();
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=initMap`;
      script.async = true;
      script.defer = true;
      script.onload = loadMap;
      document.head.appendChild(script);
    }
  }, []);

  return <div id="map" style={{ width: "100%", height: "500px" }} />;
};

