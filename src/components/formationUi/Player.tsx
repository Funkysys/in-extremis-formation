
"use client"
import { gql, useQuery } from '@apollo/client';
import dynamic from "next/dynamic";
const Plyr = dynamic(() => import("plyr-react"), { ssr: false });
import "plyr-react/plyr.css"

const plyrProps = {
  source: {
    type: "video" as "video",
    sources: [
      {
        src: "/videos/test.mov",
        type: "video/quicktime"
      }
    ]
  },
  options: null, 
}


const GET_FORMATION = {
    id: "coucoucoucou",
    title: "test vidéo",
    description: "description de la vidéo",
    videoUrl: "/videos/test.mov",
    duration: "1h 30min",
    instructor: "Aadel",
    category: "Musique",
    createdAt: "2025-05-12T14:09:39",
    updatedAt: "2025-05-12T14:09:39"
}

export default function Player({ params }: { params: { title: string } }) {

    const { title } = params;
    const decodedTitle = decodeURIComponent(title);
    
    // const { loading, error, data } = useQuery(GET_FORMATION, {
    //     variables: { title: decodedTitle }
    // });

    // if (loading) return <div>Loading...</div>;
    // if (error) return <div>
    //     <p>
    //         {`message=${`Error loading formation: ${error.message}`}`}
    //     </p>
    // </div>
    //  ;

    // const formation = data?.formation;
    const formation = GET_FORMATION;
    if (!formation) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600">Formation not found</h2>
                    <p className="mt-2">The requested formation could not be found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 ">
            <div className="bg-sky-100  rounded-lg rounded-lg shadow-lg overflow-hidden">
                <div className="w-full aspect-video bg-black">
                    <Plyr {...plyrProps}/>
                </div>
                <div className="p-10">
                    <h1 className="text-3xl font-bold text-gray-900 ">{formation.title}</h1>
                    
                    <div className="flex flex-wrap items-center mt-4 text-sm text-gray-600">
                        <div className="flex items-center mr-6">
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{formation.duration}</span>
                        </div>
                        
                        <div className="flex items-center mr-6">
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>{formation.instructor}</span>
                        </div>
                        
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            <span>{formation.category}</span>
                        </div>
                    </div>
                    
                    <div className="mt-6 ">
                        <h2 className="text-xl font-semibold text-gray-900">Description</h2>
                        <p className="mt-2 text-gray-700 whitespace-pre-line">{formation.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}