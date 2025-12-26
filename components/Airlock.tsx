import React, { useState, useEffect } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../src/api';

interface AirlockProps {
  onUnlock: () => void;
}

export const Airlock: React.FC<AirlockProps> = ({ onUnlock }) => {
  const [code, setCode] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const checkCode = async () => {
      if (code.length === 4) { // Assuming 4 digit code
        try {
          const isValid = await api.verifyAccess(code);
          if (isValid) {
            setIsSuccess(true);
            setTimeout(onUnlock, 800);
          } else {
            setIsError(true);
            setTimeout(() => {
              setIsError(false);
              setCode('');
            }, 500);
          }
        } catch (error) {
          console.error("Verification failed", error);
          setIsError(true);
          setTimeout(() => {
            setIsError(false);
            setCode('');
          }, 500);
        }
      }
    };
    checkCode();
  }, [code, onUnlock]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-onyx-950 font-mono text-white overflow-hidden">
      {/* Background Grid Mesh */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          {isSuccess ? (
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360, scale: 1.2 }}
              transition={{ duration: 0.5, ease: "backOut" }}
            >
              <Unlock className="w-12 h-12 text-emerald-400" strokeWidth={1} />
            </motion.div>
          ) : (
            <Lock className="w-12 h-12 text-onyx-500" strokeWidth={1} />
          )}
        </motion.div>

        <motion.div
          animate={isError ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="relative"
        >
          <input
            type="password"
            autoFocus
            value={code}
            onChange={(e) => {
              if (!isSuccess && e.target.value.length <= 4) setCode(e.target.value);
            }}
            className="bg-transparent border-b-2 border-onyx-700 text-center text-4xl tracking-[1em] w-64 focus:outline-none focus:border-white transition-colors py-2 text-transparent caret-white selection:bg-transparent"
          />
          {/* Custom display for the code dots to look like a vault interface */}
          <div className="absolute inset-0 flex justify-between items-center pointer-events-none">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex-1 flex justify-center">
                <span className={`w-3 h-3 rounded-full transition-all duration-300 ${code.length > i ? (isSuccess ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]' : (isError ? 'bg-red-500' : 'bg-white')) : 'bg-onyx-800'}`}></span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="h-6">
          <AnimatePresence>
            {isError && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-500 text-xs tracking-widest uppercase"
              >
                Access Denied
              </motion.p>
            )}
            {isSuccess && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-emerald-500 text-xs tracking-widest uppercase"
              >
                Access Granted
              </motion.p>
            )}
            {!isSuccess && !isError && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-onyx-500 text-xs tracking-widest uppercase"
              >
                Enter Passcode
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
