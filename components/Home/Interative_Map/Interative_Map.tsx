'use client';



import React, { useState, useEffect, useRef } from 'react';



interface Location {

  name: string;

  lat: number;

  lng: number;

}



interface LocationGroup {

  title: string;

  locations: string[];

}



const COORDINATES: Record<string, { lat: number; lng: number }> = {

  'The League Sports Village': { lat: 17.425, lng: 78.337 },

  'Prestige Skytech': { lat: 17.412, lng: 78.333 },

  'Ignite Art Cafe': { lat: 17.414, lng: 78.335 },

  'Tansen Restaurant': { lat: 17.413, lng: 78.334 },

  'Asie Stories': { lat: 17.416, lng: 78.336 },

  'Mamalola': { lat: 17.415, lng: 78.332 },

  'Soul of South': { lat: 17.417, lng: 78.338 },

  'Cycling Track': { lat: 17.418, lng: 78.340 },

  'Myscape Stories': { lat: 17.411, lng: 78.345 },

  'The Kidz Land': { lat: 17.410, lng: 78.342 },

  'ORR': { lat: 17.4139, lng: 78.3804 },

};



const DEFAULT_CENTER = { lat: 17.414994, lng: 78.332845 };



const LOCATION_GROUPS: LocationGroup[] = [

  {

    title: 'Walk',

    locations: [

      'The League Sports Village',

      'Prestige Skytech',

      'Ignite Art Cafe',

      'Tansen Restaurant',

      'Asie Stories',

      'Mamalola',

      'Soul of South',

    ],

  },

  {

    title: '2 Min Drive',

    locations: ['Cycling Track', 'Myscape Stories', 'The Kidz Land', 'ORR'],

  },

];



export default function InteractiveMap() {

  const [selectedLocation, setSelectedLocation] = useState<string>('Select a location');

  const [expandedAccordion, setExpandedAccordion] = useState<string>('Walk');

  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);

  const mapRef = useRef<HTMLDivElement>(null);



  const handleLocationClick = (locationName: string) => {

    setSelectedLocation(locationName);

    const coords = COORDINATES[locationName] || DEFAULT_CENTER;

    setMapCenter(coords);

  };



  const toggleAccordion = (title: string) => {

    setExpandedAccordion(expandedAccordion === title ? '' : title);

  };



  return (

    <section className="bg-white h-screen">

      <div className="container mx-auto px-4 h-full flex items-center">

        <div className="grid lg:grid-cols-12 gap-8 items-center h-full">

          {/* Left Column */}

          <div className="lg:col-span-5">

            <div className="space-y-4">

              <h5 className="text-blue-600 font-semibold tracking-wider text-sm">

                CONNECTIVITY

              </h5>

              <h1 className="text-4xl font-bold text-gray-900">

                The Element of Time

              </h1>

              <p className="text-gray-600 leading-relaxed">

                Located in the Financial District, Pavani Mirai is situated just off the

                main road, near ISB and a mere 1 km from the Outer Ring Road (ORR). From IT

                hubs and elite educational institutions to world-class healthcare and leisure

                experiences, every essential is within reach.

              </p>

              <div className="flex flex-wrap gap-4 pt-4">

                <a href="#" className="text-blue-600 hover:underline">

                  Location

                </a>

                <a href="#" className="text-blue-600 hover:underline">

                  Interactive Map

                </a>

              </div>

            </div>

          </div>



          {/* Right Column - Map with Overlapping Panel */}

          <div className="lg:col-span-7">

            <div className="bg-gray-100 p-5 rounded-lg h-full flex items-center">

              <div className="relative w-full h-[65vh] lg:h-[75vh]">

                {/* Map Area - Base Layer */}

                <div

                  ref={mapRef}

                  className="absolute inset-0 bg-linear-to-br from-gray-300 to-gray-400 rounded-lg overflow-hidden"

                >

                  {selectedLocation !== 'Select a location' ? (

                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded shadow-lg z-10">

                      {selectedLocation}

                    </div>

                  ) : (

                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">

                      <div>

                        <svg

                          className="w-16 h-16 mx-auto mb-2"

                          fill="none"

                          stroke="currentColor"

                          viewBox="0 0 24 24"

                        >

                          <path

                            strokeLinecap="round"

                            strokeLinejoin="round"

                            strokeWidth={2}

                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"

                          />

                          <path

                            strokeLinecap="round"

                            strokeLinejoin="round"

                            strokeWidth={2}

                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"

                          />

                        </svg>

                        <p className="text-center">Pavani Mirai</p>

                      </div>

                    </div>

                  )}

                  {/* Map grid overlay */}

                  <div className="absolute inset-0 opacity-10 pointer-events-none">

                    <div className="grid grid-cols-8 h-full">

                      {Array.from({ length: 64 }).map((_, i) => (

                        <div key={i} className="border border-gray-400" />

                      ))}

                    </div>

                  </div>

                </div>



                {/* Selection Panel - Overlapping Layer */}

                <div className="absolute top-4 left-4 z-30 w-80 max-w-[calc(100%-2rem)] bg-white rounded-lg shadow-xl">

                  {/* Header */}

                  <div className="text-center py-3 border-b bg-gray-50 rounded-t-lg">

                    <span className="font-medium text-gray-700 text-sm">Select a Location :</span>

                  </div>



                  {/* Accordion */}

                  <div className="divide-y max-h-72 overflow-y-auto">

                    {LOCATION_GROUPS.map((group) => (

                      <div key={group.title}>

                        <button

                          onClick={() => toggleAccordion(group.title)}

                          className="w-full text-left px-4 py-2.5 font-semibold text-sm hover:bg-gray-50 transition-colors flex justify-between items-center"

                        >

                          <span>{group.title}</span>

                          <svg

                            className={`w-4 h-4 transition-transform ${

                              expandedAccordion === group.title ? 'rotate-180' : ''

                            }`}

                            fill="none"

                            stroke="currentColor"

                            viewBox="0 0 24 24"

                          >

                            <path

                              strokeLinecap="round"

                              strokeLinejoin="round"

                              strokeWidth={2}

                              d="M19 9l-7 7-7-7"

                            />

                          </svg>

                        </button>

                        {expandedAccordion === group.title && (

                          <div className="px-3 pb-2">

                            <div className="flex flex-col gap-1.5">

                              {group.locations.map((location) => (

                                <button

                                  key={location}

                                  onClick={() => handleLocationClick(location)}

                                  className={`text-left px-3 py-1.5 rounded text-xs transition-colors ${

                                    selectedLocation === location

                                      ? 'bg-blue-600 text-white'

                                      : 'hover:bg-blue-50 text-gray-700'

                                  }`}

                                >

                                  {location}

                                </button>

                              ))}

                            </div>

                          </div>

                        )}

                      </div>

                    ))}

                  </div>



                  {/* Info Panel */}

                  <div className="px-3 py-2.5 bg-white border-t rounded-b-lg">

                    <div className="bg-gray-100 px-3 py-2 rounded text-gray-700 text-xs">

                      {selectedLocation}

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>

  );

} 