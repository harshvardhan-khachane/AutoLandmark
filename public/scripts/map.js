async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  const myLatlng = { lat: 0, lng: 0 };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 2,
    center: myLatlng,
  });

  let infoWindow = new google.maps.InfoWindow({
    content: "Click the map to get Lat/Lng!",
    position: myLatlng,
  });

  infoWindow.open(map);

  map.addListener("click", async (mapsMouseEvent) => {
    console.log(`Latitude: ${mapsMouseEvent.latLng.lat()}, Longitude: ${mapsMouseEvent.latLng.lng()}`);

    // Perform reverse geocoding to get the address
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: mapsMouseEvent.latLng }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results[0]) {
        // Create a clickable link with the address
        const addressLink = `<a href="#" onclick="submitPostRequest(${mapsMouseEvent.latLng.lat()}, ${mapsMouseEvent.latLng.lng()})">${results[0].formatted_address}</a>`;
        
        // Update the InfoWindow content with the clickable link
        infoWindow.setContent(addressLink);
        infoWindow.setPosition(mapsMouseEvent.latLng);
        infoWindow.open(map);
      } else {
        window.alert('No results found');
      }
    });
  });
}

// Function to submit the POST request with latitude and longitude
// function submitPostRequest(lat, lng) {
//   // Assuming you have a hidden form similar to the one previously described
//   document.getElementById('hiddenForm').elements['latitude'].value = lat;
//   document.getElementById('hiddenForm').elements['longitude'].value = lng;
//   document.getElementById('hiddenForm').submit();
// }

function submitPostRequest(lat, lng) {
  // Prevent the default form submission
  event.preventDefault();

  // Prepare the AJAX request
  $.ajax({
    url: '/submit', // Endpoint to submit the latitude and longitude
    type: 'POST',
    data: {
      latitude: lat,
      longitude: lng
    },
    success: function(data) {
      // Assume 'data' contains the HTML for the nearby places
      // Update the page with the new content
      $('#nearby-places-container').html(data);
    },
    error: function(xhr, status, error) {
      console.error('Error:', error);
    }
  });
}

initMap();
