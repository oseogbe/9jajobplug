import React, { useRef, useEffect } from 'react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const loadScript = (url, callback) => {
    const existingScript = document.getElementById('googleMaps');
    if (!existingScript) {
        const script = document.createElement('script');
        script.src = url;
        script.id = 'googleMaps';
        script.async = true; // Use async loading for best practice
        script.defer = true;
        document.body.appendChild(script);
        script.onload = () => {
            if (callback) callback();
        };
    } else if (callback) callback();
};

const GooglePlacesAutocomplete = ({ value, onChange, ...props }) => {
    const inputRef = useRef(null);

    useEffect(() => {
        loadScript(
            `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`,
            () => {
                if (!window.google) return;
                const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
                    types: ['geocode'],
                });
                autocomplete.addListener('place_changed', () => {
                    const place = autocomplete.getPlace();
                    onChange(place.formatted_address || inputRef.current.value);
                });
            }
        );
    }, [onChange]);

    return (
        <input
            ref={inputRef}
            type="text"
            className="w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded"
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            {...props}
        />
    );
};

export default GooglePlacesAutocomplete;
