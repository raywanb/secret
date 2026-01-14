'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from "motion/react";

const WELCOME_TEXTS = [
  { text: "baoberrr！", fontSize: "text-7xl", duration: 2.5 },
  { text: "我為你準備了一個特別的東西👀", fontSize: "text-5xl", duration: 3 }
];

const CORRECT_NICKNAME = "臭猪猪";

const SARAH_HINTS = [
  "你的綽號是什麼？猜一下",
  "是一個動物",
  "有一點肥",
  "長得跟你很像",
  "有點臭"
];

// Add your nickname and hints here
const MY_NICKNAME = "主人"; // Replace with your actual nickname
const MY_HINTS = [
  "那我的綽號是什麼？",
  "我聽了就很興奮的綽號",
  "dad？",
  "你在床上説的話",
  "提示：開頭是「主」",
  
];

const WelcomeStep = ({ onNext }: { onNext: () => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const isLastText = currentIndex === WELCOME_TEXTS.length - 1;
    const duration = WELCOME_TEXTS[currentIndex].duration * 1000;
    
    const timer = setTimeout(() => {
      if (isLastText) {
        onNext();
      } else {
        setCurrentIndex(prev => prev + 1);
        setKey(prev => prev + 1);
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [currentIndex, onNext]);

  const currentText = WELCOME_TEXTS[currentIndex];

  return (
    <div className="flex items-center justify-center h-20">
      <motion.h1
        key={key}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{
          times: [0, 0.2, 0.8, 1],
          duration: currentText.duration,
          ease: "easeInOut"
        }}
        className={`font-inter ${currentText.fontSize} text-center text-gray-800`}
      >
        {currentText.text}
      </motion.h1>
    </div>
  );
};

const NameInputStep = ({ 
  onSubmit, 
  hints, 
  correctName, 
  title 
}: { 
  onSubmit: (name: string, attempts: number) => void;
  hints: string[];
  correctName: string;
  title?: string;
}) => {
  const [name, setName] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = () => {
    if (!name.trim()) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }
    
    if (name.trim().toLowerCase() === correctName.toLowerCase()) {
      onSubmit(name.trim(), attempts);
    } else {
      // Incorrect attempt
      setAttempts(prev => prev + 1);
      setName("");
      setIsShaking(true);
      setShowHint(true);
      setTimeout(() => {
        setIsShaking(false);
        setShowHint(false);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const currentHint = hints[Math.min(attempts, hints.length - 1)];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-8"
    >
      <div className="text-center">
        <h2 className="font-inter text-4xl mb-4 text-gray-800">{currentHint}</h2>
        
        {showHint && attempts > 0 && (
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-red-500 font-inter text-xl"
          >
            再試一次！{attempts >= hints.length - 1 ? "最後一個提示！" : ""}
          </motion.p>
        )}
      </div>
      
      <div className="flex flex-col items-center gap-6">
        <motion.input
          animate={{ 
            x: isShaking ? [-10, 10, -10, 10, 0] : 0,
            borderColor: isShaking ? "#ef4444" : "#d1d5db"
          }}
          transition={{ duration: 0.5 }}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="hehehehe..."
          className="px-6 py-4 text-2xl font-inter border-2 rounded-xl focus:outline-none focus:border-blue-500 text-center w-80 text-gray-800 bg-white"
          autoFocus
        />
        
        <button
          onClick={handleSubmit}
          className="px-8 py-3 bg-blue-500 text-white text-xl font-inter rounded-xl hover:bg-blue-600 transition-colors"
        >
          繼續
        </button>
      </div>
      
      {attempts > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <p className="text-gray-500 font-inter text-base">
            嘗試次數：{attempts} / {hints.length}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

const TransitionStep = ({ 
  userName, 
  attempts,
  onNext 
}: { 
  userName: string; 
  attempts: number;
  onNext: () => void;
}) => {
  const [cute, setCute] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCute(true);
      const nextTimer = setTimeout(() => {
        onNext();
      }, 2000);
      return () => clearTimeout(nextTimer);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-8 relative overflow-visible"
    >
      <h2 className="font-inter text-5xl text-gray-800 text-center z-10 mb-50">
        {cute ? '你好可愛！' : '你這隻臭豬豬~!'}
      </h2>
      <motion.div
        initial={{ scale: 1, rotate: 0 }}
        animate={{ scale: 3, rotate: 360 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        className="flex items-center justify-center"
        style={{ zIndex: 1 }}
      >
        <Image src="/pig.png" width={200} height={200} alt="Pig" />
      </motion.div>
    </motion.div>
  );
};

// Select All Love Reasons Game
const SelectReasonsStep = ({
  userName,
  onNext
}: {
  userName: string;
  onNext: () => void;
}) => {
  // Correct reasons (all should be selected)
  const correctReasons = [
    { id: 1, text: "你很漂亮可愛 🥰", isCorrect: true },
    { id: 2, text: "你煮飯很好吃 🍳", isCorrect: true },
    { id: 3, text: "你的脾氣很牛 😊", isCorrect: true },
    { id: 4, text: "你很會照顧我 💕", isCorrect: true },
    { id: 5, text: "跟你在一起很開心 🎉", isCorrect: true },
    { id: 6, text: "你抱我的時候很溫暖 🤗", isCorrect: true },
    { id: 7, text: "你在床上很聽話 😊", isCorrect: true },
    { id: 8, text: "你很幽默 😊", isCorrect: true },
  ];
  
  // Wrong/silly options
  const wrongReasons = [
    { id: 9, text: "你很臭 💩", isCorrect: false },
    { id: 10, text: "你是個中國小姊姊🇨🇳😊", isCorrect: false },
    { id: 11, text: "你腳腳臭臭🦶💩", isCorrect: false },
    { id: 12, text: "你有時候很煩😤", isCorrect: false },
    { id: 13, text: "你很愛睡覺💤", isCorrect: false },
    { id: 14, text: "你很愛哭😭", isCorrect: false },
  ];
  
  // Shuffle once on mount, not on every render
  const [allReasons] = useState(() => 
    [...correctReasons, ...wrongReasons].sort(() => Math.random() - 0.5)
  );
  
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showError, setShowError] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSelect = (id: number) => {
    if (gameComplete) return;
    
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      } else {
        return [...prev, id];
      }
    });
    setShowError(false);
  };

  const handleSubmit = () => {
    setHasSubmitted(true);
    
    // Check if any wrong answers are selected
    const selectedWrong = selectedIds.some(id => 
      wrongReasons.some(r => r.id === id)
    );
    
    // Check if all correct answers are selected
    const allCorrectSelected = correctReasons.every(r => 
      selectedIds.includes(r.id)
    );
    
    if (selectedWrong) {
      setErrorMessage("不對🙈");
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
      return;
    }
    
    if (!allCorrectSelected) {
      setErrorMessage("在想想！豬豬");
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
      return;
    }
    
    // All correct!
    setGameComplete(true);
    setTimeout(onNext, 2000);
  };

  const correctCount = selectedIds.filter(id => 
    correctReasons.find(r => r.id === id)
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-6 max-w-lg px-4"
    >
      <h2 className="font-inter text-4xl text-gray-800 text-center">
        {gameComplete ? '答對了！你好棒！🎉💕' : `${userName}，選出我愛你的理由！`}
      </h2>
      
      {!gameComplete && (
        <p className="text-gray-600 font-inter text-lg text-center">
          選出所有正確的理由（共{correctReasons.length}個）💕
        </p>
      )}
      
      {/* Options grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        {allReasons.map((reason) => (
          <motion.button
            key={reason.id}
            onClick={() => handleSelect(reason.id)}
            className={`px-4 py-4 rounded-xl font-inter text-lg text-left transition-all border-2 ${
              selectedIds.includes(reason.id)
                ? 'bg-pink-500 border-pink-300 text-white'
                : 'bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded border-2 flex items-center justify-center text-base ${
                selectedIds.includes(reason.id) 
                  ? 'bg-white border-white text-pink-500' 
                  : 'border-gray-400'
              }`}>
                {selectedIds.includes(reason.id) && '✓'}
              </span>
              {reason.text}
            </span>
          </motion.button>
        ))}
      </div>
      
      {/* Error message */}
      {showError && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 font-inter text-lg text-center"
        >
          {errorMessage}
        </motion.p>
      )}
      
      {/* Progress - only show after first submit */}
      {hasSubmitted && !gameComplete && (
        <p className="text-gray-600 font-inter text-base">
          {correctCount} / {correctReasons.length} correct
        </p>
      )}
      
      {/* Submit button */}
      {!gameComplete && (
        <motion.button
          onClick={handleSubmit}
          className="px-8 py-3 bg-pink-500 text-white text-xl font-inter rounded-xl hover:bg-pink-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          確定！
        </motion.button>
      )}
      
      {gameComplete && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-6xl"
        >
          💕🎉💕
        </motion.div>
      )}
    </motion.div>
  );
};

const LoveQuestionStep = ({ 
  userName, 
  onNext 
}: { 
  userName: string; 
  onNext: () => void;
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [noClicks, setNoClicks] = useState(0);
  const [showHearts, setShowHearts] = useState(false);

  const questions = [
    {
      question: `${userName}，你愛我嗎？`,
      yesText: "愛！💕",
      noText: "不愛"
    },
    {
      question: `${userName}，你覺得我很可愛嗎？`,
      yesText: "超可愛！😍",
      noText: "不可愛"
    },
    {
      question: `${userName}，你願意每天跟我說早安嗎？`,
      yesText: "當然願意！☀️",
      noText: "不要"
    },
    {
      question: `${userName}，你會想我嗎？`,
      yesText: "會想！💭",
      noText: "不會"
    },
    {
      question: `${userName}，我是世界上最棒的嗎？`,
      yesText: "當然是！👑",
      noText: "不是"
    }
  ];

  const handleNoClick = () => {
    setNoClicks(prev => prev + 1);
  };

  const handleYesClick = () => {
    if (currentQuestion < questions.length - 1) {
      // Move to next question and reset no clicks
      setCurrentQuestion(prev => prev + 1);
      setNoClicks(0);
    } else {
      // Final question answered, show hearts and proceed
      setShowHearts(true);
      setTimeout(() => {
        onNext();
      }, 2000);
    }
  };

  // Calculate button sizes based on no clicks
  const yesButtonScale = 1 + (noClicks * 0.3);
  const noButtonScale = Math.max(0.5, 1 - (noClicks * 0.1));

  // Messages that change based on no clicks
  const getNoButtonText = () => {
    if (noClicks === 0) return questions[currentQuestion].noText;
    if (noClicks === 1) return questions[currentQuestion].noText + "？";
    if (noClicks === 2) return "真的嗎？";
    if (noClicks === 3) return "確定嗎？";
    if (noClicks === 4) return "拜託啦～";
    return "🥺";
  };

  const getQuestionText = () => {
    if (noClicks === 0) return questions[currentQuestion].question;
    if (noClicks === 1) return `拜託啦${userName}...`;
    if (noClicks === 2) return `我知道答案的！💕`;
    if (noClicks === 3) return `快點選是啦！😘`;
    if (noClicks >= 4) return `好吧，我讓按鈕變大一點... 😏`;
    return questions[currentQuestion].question;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-8 relative"
    >
      <h2 className="font-inter text-5xl text-gray-800 text-center mb-8">
        {getQuestionText()}
      </h2>
      
      <div className="flex items-center gap-8">
        <motion.button
          animate={{ 
            scale: yesButtonScale,
            background: noClicks > 2 ? "#ef4444" : "#22c55e"
          }}
          transition={{ duration: 0.3 }}
          onClick={handleYesClick}
          className="px-8 py-4 bg-green-500 text-white text-2xl font-inter rounded-xl hover:bg-green-600 transition-colors"
          style={{ 
            fontSize: `${1 + (noClicks * 0.2)}rem`,
            minWidth: `${120 + (noClicks * 30)}px`
          }}
        >
          {questions[currentQuestion].yesText}
        </motion.button>
        
        <motion.button
          animate={{ 
            scale: noButtonScale,
            opacity: Math.max(0.3, 1 - (noClicks * 0.2))
          }}
          transition={{ duration: 0.3 }}
          onClick={handleNoClick}
          className="px-6 py-3 bg-red-500 text-white text-xl font-inter rounded-xl hover:bg-red-600 transition-colors"
          disabled={noClicks >= 6}
        >
          {getNoButtonText()}
        </motion.button>
      </div>

      {/* Progress indicator - at bottom */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex gap-2 justify-center">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                index <= currentQuestion ? 'bg-gray-800' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        <p className="text-gray-500 text-base mt-2 text-center">
          {currentQuestion + 1} / {questions.length}
        </p>
      </div>

      {/* Hearts animation */}
      {showHearts && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                opacity: 0, 
                scale: 0,
                x: Math.random() * 400 - 200,
                y: Math.random() * 400 - 200
              }}
              animate={{ 
                opacity: [0, 1, 0], 
                scale: [0, 1.5, 0],
                y: [0, -100]
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                ease: "easeOut"
              }}
              className="absolute text-4xl"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            >
              💕
            </motion.div>
          ))}
        </div>
      )}
      
      {noClicks > 0 && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gray-600 font-inter text-base text-center"
        >
          {noClicks === 1 && "我看到你在做什麼了... 😏"}
          {noClicks === 2 && "按鈕變大了！😂"}
          {noClicks === 3 && "快投降吧！💖"}
          {noClicks >= 4 && "你逃不掉的！🥰"}
        </motion.p>
      )}
    </motion.div>
  );
};

const FinalStep = ({ 
  userName, 
  myName,
  myAttempts 
}: { 
  userName: string; 
  myName: string;
  myAttempts: number;
}) => {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    setIsMounted(true);
    
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const galleryImages = [
    "/IMG_5195.JPG",
    "/C061DEAF-7EFC-4F81-A835-748EFCBB7F19.JPG",
    "/IMG_7805.JPG",
    "/IMG_7826.JPG",
    "/231B4584-571B-48BB-B6D2-ED102063E7C6.JPG",
    "/IMG_6674.JPG",
    "/C831D0DE-D108-403D-8E29-849A8BBA0BDD.JPG",
    "/D4E933DC-17B7-40A3-9A6D-8C08E3B84B5A_1_105_c.jpeg",
    "/0E7362A9-CC94-41B3-9CBC-6CDDB1919DDF_1_105_c.jpeg",
    "/8B8A573B-CC52-4FD9-BA36-4653F5519218.poster.JPG",
    "/AE91D142-E2F5-455A-9778-49188A7BF638.JPG",
    "/480EEFFE-F21E-43B2-B1CF-B779FE95F0CD.JPG",
    "/B5DEBEEF-0401-4F8E-9D33-3A4C7D72C14F.JPG",
    // Converted from HEIC
    "/FullSizeRender.JPG",
    "/IMG_6752.JPG",
    "/IMG_6836.JPG",
    "/IMG_6945.JPG",
    "/IMG_7192.JPG",
  ];

  // Split images into 4 columns evenly
  const columns = [0, 1, 2, 3].map(colIndex => 
    galleryImages.filter((_, imgIndex) => imgIndex % 4 === colIndex)
  );

  const loveLetter = `
  我的寶貝陳鈺珊！
  Happy 1 year anniversary! 🤍
  我每天都覺得好幸福 因為有你在我身旁 
  謝謝你願意跟我在一起！

  雖然我們常常小吵小鬧 但你總是有辦法把我哄好 把我逗笑
  有時候我真的覺得你就是燒烤的烤肉醬 我是豬豬——沒有你 SF 真的會變得很平淡
  而且我想跟你說 從在 Berkeley 認識你的時候開始，我就覺得你是一個很熟悉的人。你超 real 超 straight forward 可以陪我一起耍白痴 也可以跟我一起認真做事情。
  我真的覺得你很棒：在外面你是女強人，在家你是我的小女人
  你很會照顧我 常常煮飯給我吃，把我養胖胖 也總是願意陪在我身邊。

  你常常讓我覺得自己像小孩一樣 會忍不住想黏著你 對你做一些屁孩事 然後你還會笑著包容我
  謝謝你把我心裡那個小朋友帶出來 讓我跟你在一起的時候可以很放鬆 很安心
  謝謝你一直忍受我的小脾氣 我的任性 還總是願意在我身邊 陪我 抱著我睡覺 跟你在一起的每一天 我都覺得自己被好好愛著


  你一定會找到工作的啦 BB 我對你超有信心！雖然我總是笑你沒工作沒護照還有你的pronunciation hehehehe:))) but I'm truly your biggest supporter 喔！
  等你找到工作 我們要一起去更多新的地方 做更多新的事 繼續把回憶存滿滿
  Spring break 一起去歐洲寶貝！ 你還要帶我去我還沒去過的Tahoeee喔

  I love you more than you know and I think you are the best person in the wholeeee world. 

  我太幸運啦！
  Yours Foreverrr,
  Ray 💕`;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-rose-50">
      {/* Auto-scrolling gallery background */}
      <div className="absolute inset-0 flex gap-4 p-4">
        {columns.map((columnImages, columnIndex) => (
          <motion.div
            key={columnIndex}
            className="flex-1 flex flex-col gap-4"
            style={{ marginTop: `${columnIndex * 150}px` }}
            animate={{
              y: columnIndex % 2 === 0 ? [0, -1000] : [-1000, 0]
            }}
            transition={{
              duration: 64 + columnIndex * 6,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {/* Duplicate images for seamless loop */}
            {[...columnImages, ...columnImages].map((src, imgIndex) => (
              <div
                key={imgIndex}
                className="overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                style={{ 
                  borderRadius: 0,
                  height: `${400 + ((imgIndex + columnIndex) % 4) * 80}px`,
                  minHeight: '450px'
                }}
                onClick={() => setExpandedImage(src)}
              >
                <img
                  src={src}
                  alt={`Gallery ${imgIndex}`}
                  className="w-full h-full object-cover"
                  style={{ borderRadius: 0 }}
                />
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      {/* Dark overlay */}
      {/* <div className="absolute inset-0 backdrop-blur-[1px]" /> */}

      {/* Love letter in the center */}
      <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-10 max-w-4xl w-full pointer-events-auto"
          style={{ maxHeight: '50vh', overflowY: 'auto' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <h2 className="font-inter text-3xl text-gray-800 mb-6 text-center">
              My Cringy Little Letter to You...And Our Photos from the Past Year 
            </h2>
            
            <div className="space-y-4 text-gray-700 font-inter leading-relaxed">
              {loveLetter.split('\n\n').map((paragraph, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 + index * 0.3, duration: 0.6 }}
                  className="text-base whitespace-pre-line"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 4, duration: 0.5 }}
              className="mt-6 text-center"
            >
              <div className="inline-flex items-center gap-2 text-red-500">
                <span className="text-2xl">💕</span>
                <span className="text-2xl">💖</span>
                <span className="text-2xl">💕</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating hearts animation */}
      {isMounted && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                opacity: 0,
                x: Math.random() * windowSize.width,
                y: windowSize.height + 50
              }}
              animate={{ 
                opacity: [0, 1, 0],
                y: -100,
                x: Math.random() * windowSize.width
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                delay: Math.random() * 5,
                repeat: Infinity,
                ease: "easeOut"
              }}
              className="absolute text-2xl"
            >
              {i % 3 === 0 ? '💕' : i % 3 === 1 ? '💖' : '💝'}
            </motion.div>
          ))}
        </div>
      )}

      {/* Lightbox modal */}
      {expandedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8 cursor-pointer"
          onClick={() => setExpandedImage(null)}
        >
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            src={expandedImage}
            alt="Expanded"
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-6 right-6 text-white text-4xl hover:text-gray-300 transition-colors"
            onClick={() => setExpandedImage(null)}
          >
            ✕
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default function Home() {
  const [step, setStep] = useState<'welcome' | 'sarah-name' | 'transition' | 'my-name' | 'memory-game' | 'love-question' | 'final'>('welcome');
  const [userName, setUserName] = useState('');
  const [sarahAttempts, setSarahAttempts] = useState(0);
  const [myName, setMyName] = useState('');
  const [myAttempts, setMyAttempts] = useState(0);

  const handleSarahNameSubmit = (name: string, attempts: number) => {
    setUserName(name);
    setSarahAttempts(attempts);
    setStep('transition');
  };

  const handleMyNameSubmit = (name: string, attempts: number) => {
    setMyName(name);
    setMyAttempts(attempts);
    setStep('memory-game');
  };

  const getBackgroundColor = () => {
    return 'bg-rose-50';
  };

  return (
    <div className={`${step === 'final' ? '' : `min-h-screen flex items-center justify-center p-8 transition-colors duration-1000 ${getBackgroundColor()}`}`}>
      {step === 'welcome' && <WelcomeStep onNext={() => setStep('sarah-name')} />}
      
      {step === 'sarah-name' && (
        <NameInputStep 
          onSubmit={handleSarahNameSubmit}
          hints={SARAH_HINTS}
          correctName={CORRECT_NICKNAME}
        />
      )}
      
      {step === 'transition' && (
        <TransitionStep 
          userName={userName} 
          attempts={sarahAttempts}
          onNext={() => setStep('my-name')}
        />
      )}
      
      {step === 'my-name' && (
        <NameInputStep 
          onSubmit={handleMyNameSubmit}
          hints={MY_HINTS}
          correctName={MY_NICKNAME}
        />
      )}
      
      {step === 'memory-game' && (
        <SelectReasonsStep 
          userName={userName}
          onNext={() => setStep('love-question')}
        />
      )}
      
      {step === 'love-question' && (
        <LoveQuestionStep 
          userName={userName}
          onNext={() => setStep('final')}
        />
      )}
      
      {step === 'final' && (
        <FinalStep 
          userName={userName} 
          myName={myName}
          myAttempts={myAttempts}
        />
      )}
    </div>
  );
}