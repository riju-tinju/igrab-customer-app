import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, StandaloneSearchBox } from '@react-google-maps/api';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../contexts/LanguageContext';

interface MapModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectLocation: (location: {
        address: string;
        city: string;
        lat: number;
        lng: number;
    }) => void;
    initialCenter?: { lat: number; lng: number };
    allowedEmirates?: string[];
}

const containerStyle = {
    width: '100%',
    height: '100%'
};

const MapModal: React.FC<MapModalProps> = ({ isOpen, onClose, onSelectLocation, initialCenter, allowedEmirates = [] }) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
        libraries: ['places']
    });

    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);
    const [position, setPosition] = useState<google.maps.LatLngLiteral>(initialCenter || {
        lat: 25.2048,
        lng: 55.2708 // Dubai
    });
    const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>(initialCenter || {
        lat: 25.2048,
        lng: 55.2708
    });
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [isValidating, setIsValidating] = useState(false);
    const { t, isRTL, language } = useLanguage();

    const onLoad = useCallback((map: google.maps.Map) => {
        setMap(map);
    }, []);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    const onSearchBoxLoad = (ref: google.maps.places.SearchBox) => {
        setSearchBox(ref);
    };

    const onPlacesChanged = () => {
        if (searchBox) {
            const places = searchBox.getPlaces();
            if (places && places.length > 0) {
                const place = places[0];
                if (place.geometry && place.geometry.location) {
                    const newPos = {
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng()
                    };
                    setPosition(newPos);
                    setMapCenter(newPos);
                    map?.setZoom(17);

                    // Use geocodePosition to ensure we get standardized address components
                    // consistent with manual selection behavior.
                    geocodePosition(newPos);
                }
            }
        }
    };

    const extractAddressInfo = (place: google.maps.places.PlaceResult) => {
        const address = place.formatted_address || '';
        const name = place.name || '';

        // If name is not just a coordinate or number, prepend it to address for building info
        const displayAddress = name && !address.startsWith(name) ? `${name}, ${address}` : address;

        setAddress(displayAddress);

        const cityComponent = place.address_components?.find(c =>
            c.types.includes('locality') || c.types.includes('administrative_area_level_1')
        );
        setCity(cityComponent?.long_name || '');
        setIsValidating(false);
    };

    const geocodePosition = (pos: google.maps.LatLngLiteral) => {
        if (!isLoaded) return;
        setIsValidating(true);
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: pos }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
                extractAddressInfo(results[0]);
            } else {
                setIsValidating(false);
            }
        });
    };

    useEffect(() => {
        if (isOpen && isLoaded) {
            geocodePosition(position);
        }
    }, [isOpen, isLoaded]);

    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            const newPos = {
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
            };
            setPosition(newPos);
            geocodePosition(newPos);
        }
    };

    const onMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            const newPos = {
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
            };
            setPosition(newPos);
            geocodePosition(newPos);
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className={`fixed inset-0 bg-black/60 z-[3000] flex items-end lg:items-center lg:justify-center p-0 lg:p-4 animate-fade-in text-gray-900 ${isRTL ? 'rtl' : 'ltr'}`}>
            <div className="bg-white w-full lg:w-[800px] h-[90vh] lg:h-[600px] rounded-t-[28px] lg:rounded-[28px] flex flex-col overflow-hidden relative shadow-2xl transition-all">
                {/* Header */}
                <div className={`p-4 border-b flex justify-between items-center bg-white z-10 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <h2 className="text-xl font-bold font-chillax">{t('map_title')}</h2>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                {/* Search Box */}
                <div className="p-4 bg-white z-10 shadow-sm">
                    {isLoaded && (
                        <StandaloneSearchBox onLoad={onSearchBoxLoad} onPlacesChanged={onPlacesChanged}>
                            <div className="relative">
                                <i className={`fas fa-search absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400`}></i>
                                <input
                                    id="pac-input-ref"
                                    type="text"
                                    placeholder={t('map_search_placeholder')}
                                    className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all shadow-inner font-inter text-sm ${isRTL ? 'text-right' : 'text-left'}`}
                                    autoFocus
                                />
                            </div>
                        </StandaloneSearchBox>
                    )}
                </div>

                {/* Map */}
                <div className="flex-1 relative">
                    {isLoaded ? (
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={mapCenter}
                            zoom={15}
                            onLoad={onLoad}
                            onUnmount={onUnmount}
                            onClick={handleMapClick}
                            options={{
                                disableDefaultUI: true,
                                zoomControl: true,
                                clickableIcons: true,
                                styles: [] // Remove custom styles to match original site better
                            }}
                        >
                            <MarkerF
                                position={position}
                                draggable={true}
                                onDragEnd={onMarkerDragEnd}
                                animation={window.google?.maps?.Animation?.DROP}
                            />
                        </GoogleMap>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50">
                            <div className="flex flex-col items-center gap-3">
                                <i className="fas fa-spinner fa-spin text-primary text-3xl"></i>
                                <p className="text-sm text-gray-400 font-inter">{t('loading_maps')}</p>
                            </div>
                        </div>
                    )}

                    {/* Floating Info */}
                    <div className="absolute bottom-6 left-6 right-6">
                        <div className={`bg-white p-4 rounded-2xl shadow-xl border transition-all duration-300 ${city && allowedEmirates.length > 0 && !allowedEmirates.some(e => city.toLowerCase().includes(e.toLowerCase()) || e.toLowerCase().includes(city.toLowerCase())) ? 'border-red-200 ring-4 ring-red-50' : 'border-gray-100'}`}>
                            {isValidating ? (
                                <div className={`mb-4 p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center gap-3 text-gray-400 animate-pulse ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    <p className="text-[11px] font-bold">{t('validating_location')}</p>
                                </div>
                            ) : city && allowedEmirates.length > 0 && !allowedEmirates.some(e => city.toLowerCase().includes(e.toLowerCase()) || e.toLowerCase().includes(city.toLowerCase())) ? (
                                <div className={`mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 animate-slide-down ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                                    <i className="fas fa-exclamation-triangle flex-shrink-0"></i>
                                    <p className="text-[11px] font-bold leading-tight">
                                        {t('delivery_unavailable_in')}{city}. <br />
                                        <span className="opacity-70 font-normal">{t('please_select_in')}{allowedEmirates.join(', ')}</span>
                                    </p>
                                </div>
                            ) : null}

                            <div className={`flex items-start gap-3 mb-4 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${city && allowedEmirates.length > 0 && !allowedEmirates.some(e => city.toLowerCase().includes(e.toLowerCase()) || e.toLowerCase().includes(city.toLowerCase())) ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'}`}>
                                    <i className="fas fa-location-dot"></i>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-400 font-inter uppercase tracking-wider font-bold">{t('delivery_address')}</p>
                                    <p className={`font-bold line-clamp-2 transition-colors ${city && allowedEmirates.length > 0 && !allowedEmirates.some(e => city.toLowerCase().includes(e.toLowerCase()) || e.toLowerCase().includes(city.toLowerCase())) ? 'text-red-700' : 'text-gray-900'}`}>
                                        {isValidating ? t('locating') : (address || t('selecting'))}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => onSelectLocation({ address, city, ...position })}
                                disabled={
                                    !address ||
                                    isValidating ||
                                    (allowedEmirates.length > 0 && city !== '' && !allowedEmirates.some(e => city.toLowerCase().includes(e.toLowerCase()) || e.toLowerCase().includes(city.toLowerCase())))
                                }
                                className={`w-full py-4 rounded-xl font-bold active:scale-95 transition-all shadow-lg ${(!address || (allowedEmirates.length > 0 && city !== '' && !allowedEmirates.some(e => city.toLowerCase().includes(e.toLowerCase()) || e.toLowerCase().includes(city.toLowerCase()))))
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                    : 'bg-primary text-white shadow-primary/20'
                                    }`}
                            >
                                {isValidating ? t('checking') :
                                    (city && allowedEmirates.length > 0 && !allowedEmirates.some(e => city.toLowerCase().includes(e.toLowerCase()) || e.toLowerCase().includes(city.toLowerCase())))
                                        ? t('delivery_not_available_btn')
                                        : t('confirm_location')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default MapModal;
