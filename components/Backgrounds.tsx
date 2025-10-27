import React from 'react';

interface BackgroundsProps {
  level: number;
}

const ParallaxClouds: React.FC = () => (
    <>
        <div className="absolute top-10 left-0 w-full h-20 bg-contain bg-repeat-x opacity-40 animate-pan-slow" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/clouds.png')"}} />
        <div className="absolute top-40 left-0 w-full h-32 bg-contain bg-repeat-x opacity-60 animate-pan-fast" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/clouds.png')"}} />
    </>
);

const Backgrounds: React.FC<BackgroundsProps> = ({ level }) => {
    const groundColor = "bg-green-700";
    let background = <div className="absolute inset-0 bg-gradient-to-b from-sky-400 to-sky-700"></div>;
    let groundTexture = "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22 viewBox=%220 0 80 80%22%3E%3Cg fill=%22%2322c55e%22 fill-opacity=%221%22%3E%3Cpath fill-rule=%22evenodd%22 d=%22M0 0h40v40H0V0zm40 40h40v40H40V40z%22/%3E%3C/g%3E%3Cg fill=%22%2316a34a%22%3E%3Cpath d=%22M0 40h40v40H0V40zm40 0h40v40H40V40zM0 0h40v40H0V0z%22/%3E%3C/g%3E%3C/svg%3E')";
    let groundLineColor = "bg-green-800";

    switch(level) {
        case 1: // School
            background = <div className="absolute inset-0 bg-gradient-to-b from-sky-300 to-sky-500">
                <div className="absolute bottom-12 left-1/2 w-80 h-96 bg-red-800" style={{ transform: 'translateX(-50%)' }}>
                    <div className="w-20 h-32 bg-gray-900 absolute left-1/2 top-48" style={{ transform: 'translateX(-50%)' }}></div>
                </div>
            </div>;
            groundTexture = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239ca3af' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`;
            groundLineColor = "bg-gray-600";
            break;
        case 2: // City
            background = <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 to-gray-900">
                {[...Array(10)].map((_, i) => <div key={i} className="absolute bottom-12 bg-gray-700" style={{left: `${i*10}%`, width: `${5 + Math.random()*5}%`, height: `${20 + Math.random()*60}%`, opacity: 0.8}}></div>)}
            </div>;
            groundTexture = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239ca3af' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`;
            groundLineColor = "bg-gray-600";
            break;
        case 3: // Meadow
            background = <div className="absolute inset-0 bg-gradient-to-b from-green-300 to-green-500"><ParallaxClouds/></div>;
            break;
        case 4: // Forest
            background = <div className="absolute inset-0 bg-gradient-to-b from-teal-700 to-teal-900">
                {[...Array(15)].map((_, i) => <div key={i} className="absolute bottom-12 bg-emerald-900" style={{left: `${i*7}%`, width: `15px`, height: `${30 + Math.random()*50}%`}}></div>)}
            </div>;
            break;
        case 5: // Mountains
            background = <div className="absolute inset-0 bg-gradient-to-b from-slate-400 to-slate-600">
                 <div className="absolute bottom-12 left-0 w-full h-48 bg-gray-500" style={{clipPath: 'polygon(0 80%, 15% 40%, 30% 60%, 45% 30%, 60% 70%, 75% 45%, 90% 65%, 100% 20%, 100% 100%, 0 100%)'}}></div>
            </div>;
            groundTexture = `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.8' fill-rule='evenodd'%3E%3Cpath d='M0 0h20v20H0V0zM2 2h16v16H2V2zm2 2h12v12H4V4z'/%3E%3C/g%3E%3C/svg%3E")`;
            groundLineColor = "bg-white";
            break;
        case 6: // Field with sun
            background = <div className="absolute inset-0 bg-gradient-to-b from-blue-300 to-blue-500">
                <div className="absolute top-10 right-10 w-24 h-24 bg-yellow-300 rounded-full"></div>
                <ParallaxClouds/>
            </div>;
            break;
        case 7: // Underwater 1
        case 8: // Underwater 2
            background = <div className="absolute inset-0 bg-gradient-to-b from-cyan-600 to-blue-900">
                {[...Array(10)].map((_, i) => <div key={i} className="absolute rounded-full bg-white opacity-20" style={{left: `${Math.random()*100}%`, bottom: `${-20 + Math.random()*120}%`, width: `${5+Math.random()*15}px`, height: `${5+Math.random()*15}px`}}></div>)}
            </div>;
            groundTexture = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23ca8a04' fill-opacity='0.4'%3E%3Cpath fill-rule='evenodd' d='M11 0l5 20-5-5-5 5L11 0zM21 25l5 20-5-5-5 5L21 25zM31 50l5 20-5-5-5 5L31 50zM41 75l5 20-5-5-5 5L41 75zM51 0l5 20-5-5-5 5L51 0zM61 25l5 20-5-5-5 5L61 25zM71 50l5 20-5-5-5 5L71 50z'/%3E%3C/g%3E%3C/svg%3E")`;
            groundLineColor = "bg-yellow-800";
            break;
        case 9: // Beach
             background = <div className="absolute inset-0 bg-gradient-to-b from-cyan-300 to-blue-400">
                <div className="absolute top-10 right-10 w-24 h-24 bg-yellow-300 rounded-full"></div>
             </div>;
             groundTexture = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23fde68a' fill-opacity='0.6'%3E%3Cpath fill-rule='evenodd' d='M11 0l5 20-5-5-5 5L11 0zM21 25l5 20-5-5-5 5L21 25z'/%3E%3C/g%3E%3C/svg%3E")`;
             groundLineColor = "bg-amber-400";
            break;
        case 10: // Rocket
            background = <div className="absolute inset-0 bg-gradient-to-b from-slate-600 to-slate-900">
                 <svg viewBox="0 0 100 300" className="absolute bottom-12 left-1/2 -translate-x-1/2 h-3/4 w-auto">
                    <path d="M50 0 L70 50 L70 280 L30 280 L30 50 Z" fill="#E5E7EB"/>
                    <path d="M50 0 L40 15 L60 15 Z" fill="#EF4444"/>
                    <path d="M30 280 L10 300 L30 290 Z" fill="#9CA3AF"/>
                    <path d="M70 280 L90 300 L70 290 Z" fill="#9CA3AF"/>
                 </svg>
            </div>;
            groundTexture = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20h20v20H20zM0 0h20v20H0z' fill='%2371717a' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`;
            groundLineColor = "bg-zinc-600";
            break;
        case 11: // Moon
            background = <div className="absolute inset-0 bg-gray-900">
                <div className="absolute top-10 right-10 w-24 h-24 rounded-full bg-blue-500 overflow-hidden">
                    <div className="absolute w-12 h-12 bg-green-500 rounded-full -top-2 left-8"></div>
                    <div className="absolute w-8 h-8 bg-green-500 rounded-full top-12 left-2"></div>
                </div>
                {[...Array(50)].map((_, i) => <div key={i} className="absolute rounded-full bg-white" style={{left: `${Math.random()*100}%`, top: `${Math.random()*100}%`, width: '2px', height: '2px', opacity: Math.random()}}></div>)}
            </div>;
            groundTexture = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23a1a1aa' fill-opacity='0.4'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;
            groundLineColor = "bg-zinc-500";
            break;
        case 12: // Mars
            background = <div className="absolute inset-0 bg-gradient-to-b from-orange-500 to-red-800"></div>;
            groundTexture = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.4'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;
            groundLineColor = "bg-orange-900";
            break;
    }

    return (
        <>
            {background}
            <div className="absolute bottom-0 left-0 w-full bg-repeat-x bg-center" style={{ height: 58, backgroundImage: groundTexture, backgroundSize: '40px' }} />
            <div className={`absolute bottom-0 left-0 w-full ${groundLineColor}`} style={{ height: '8px', top: 'calc(100% - 58px)' }} />
        </>
    );
}

export default Backgrounds;
