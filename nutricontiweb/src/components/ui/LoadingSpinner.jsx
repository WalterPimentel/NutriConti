import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const l4 = keyframes`
  0%     {-webkit-mask:conic-gradient(#0000 0     ,#000 0)}
  16.67% {-webkit-mask:conic-gradient(#0000 60deg ,#000 0)}
  33.33% {-webkit-mask:conic-gradient(#0000 120deg,#000 0)}
  50%    {-webkit-mask:conic-gradient(#0000 180deg,#000 0)}
  66.67% {-webkit-mask:conic-gradient(#0000 240deg,#000 0)}
  83.33% {-webkit-mask:conic-gradient(#0000 300deg,#000 0)}
  100%   {-webkit-mask:conic-gradient(#0000 360deg,#000 0)}
`;

const Loader = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 8px solid #d1914b;
  box-sizing: border-box;
  --c:no-repeat radial-gradient(farthest-side, #d64123 94%,#0000);
  --b:no-repeat radial-gradient(farthest-side, #000 94%,#0000);
  background:
    var(--c) 11px 15px,
    var(--b) 6px 15px,    
    var(--c) 35px 23px,
    var(--b) 29px 15px,    
    var(--c) 11px 46px,
    var(--b) 11px 34px,    
    var(--c) 36px 0px,
    var(--b) 50px 31px,
    var(--c) 47px 43px,
    var(--b) 31px 48px,    
    #f6d353; 
  background-size: 15px 15px,6px 6px;
  animation: ${l4} 3s infinite;
`;

const l8 = keyframes`
 0%   {-webkit-mask-size: auto,0 0,0 0,0 0,0 0,0 0,0 0}
 15%  {-webkit-mask-size: auto,20px 20px,0 0,0 0,0 0,0 0,0 0}
 30%  {-webkit-mask-size: auto,20px 20px,20px 20px,0 0,0 0,0 0,0 0}
 45%  {-webkit-mask-size: auto,20px 20px,20px 20px,20px 20px,0 0,0 0,0 0}
 60%  {-webkit-mask-size: auto,20px 20px,20px 20px,20px 20px,20px 20px,0 0,0 0}
 75%  {-webkit-mask-size: auto,20px 20px,20px 20px,20px 20px,20px 20px,20px 20px,0 0}
 90%,
 100% {-webkit-mask-size: auto,20px 20px,20px 20px,20px 20px,20px 20px,20px 20px,20px 20px}
`;

const Loader2 = styled.div`
  width: 80px;
  height: 40px;
  border-radius: 0 0 100px 100px;
  border: 5px solid #538a2d;
  border-top: 0;
  box-sizing: border-box;
  background:
    radial-gradient(farthest-side at top,#0000 calc(100% - 5px),#e7ef9d calc(100% - 4px)), 
    radial-gradient(2px 3px,#5c4037 89%,#0000) 0 0/17px 12px,
    #ff1643;
  --c:radial-gradient(farthest-side,#000 94%,#0000);
  -webkit-mask:
    linear-gradient(#0000 0 0),
    var(--c) 12px -8px,
    var(--c) 29px -8px,
    var(--c) 45px -6px,
    var(--c) 22px -2px,
    var(--c) 34px  6px, 
    var(--c) 21px  6px,
    linear-gradient(#000 0 0);
  mask:
    linear-gradient(#000 0 0),
    var(--c) 12px -8px,
    var(--c) 29px -8px,
    var(--c) 45px -6px,
    var(--c) 22px -2px,
    var(--c) 34px  6px, 
    var(--c) 21px  6px,
    linear-gradient(#0000 0 0);
  -webkit-mask-composite:destination-out;
  mask-composite:exclude,add,add,add,add,add,add;
  -webkit-mask-repeat: no-repeat;
  animation: ${l8} 3s infinite;
`;

const LoadingSpinner = ({ isOpen }) => {
    const [dots, setDots] = useState('');
    const [currentLoader, setCurrentLoader] = useState(0);
    const [intervalTime] = useState(3000);

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(dots => dots.length < 3 ? dots + '.' : '');
        }, 400);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentLoader(loader => (loader + 1) % 3);
        }, intervalTime);

        return () => clearInterval(interval);
    }, [intervalTime]);

    if (!isOpen) return null;

    return (
        <div className="flex w-full fixed flex-col justify-center items-center bg-gray-800 h-screen top-0 left-0">
            <div className='h-[20%] content-center'>
                {currentLoader === 0 && <Loader />}
                {currentLoader === 1 && <Loader2 />}
                {currentLoader === 2 && <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-8 border-blue-500"></div>}
            </div>
            <p className="font-bold text-xl text-gray-300 mt-4">Cargando {dots}</p>
        </div>
    );
};

export default LoadingSpinner;