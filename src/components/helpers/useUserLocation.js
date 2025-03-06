import { useState, useEffect } from 'react';

// Free IP location service (you can change if needed)
// const IP_API_URL = 'https://ipapi.co/json/';
// const IP_API_URL = 'https://ipinfo.io/json';
const IP_API_URL = 'https://ipwhois.app/json/';
// const IP_API_URL = 'http://ip-api.com/json';

function useUserLocation() {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // First try GPS location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude, source: 'gps' });
                },
                async (err) => {
                    console.warn('GPS failed:', err.message);
                    // If GPS fails, fall back to IP-based location
                    await fetchLocationFromIP();
                },
                { timeout: 5000 } // Optional timeout after 10 seconds
            );
        } else {
            setError('Geolocation is not supported by this browser.');
            fetchLocationFromIP();
        }
    }, []);

    const fetchLocationFromIP = async () => {
        try {
            const response = await fetch(IP_API_URL);
            const data = await response.json();

            setLocation({
                latitude: data.latitude,
                longitude: data.longitude,
                city: data.city,
                region: data.region,
                country: data.country,
                source: 'ip'
            });
        } catch (ipError) {
            setError('Failed to fetch location from IP.');
        }
    };

    return { location, error };
}

export default useUserLocation;
