// pages/index.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/Anniversary.module.scss';

interface GameStep {
  id: string;
  component: React.ReactNode;
}

const AnniversaryWebsite: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextStep = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(prev => prev + 1);
      setIsAnimating(false);
    }, 500);
  };

  const steps: GameStep[] = [
    { id: 'welcome', component: <WelcomeStep onNext={nextStep} /> },
    { id: 'name', component: <NameStep onNext={nextStep} /> },
    { id: 'qualities', component: <QualitiesStep onNext={nextStep} /> },
    { id: 'best-person', component: <BestPersonStep onNext={nextStep} /> },
    { id: 'question', component: <QuestionStep onNext={nextStep} /> },
    { id: 'love-letter', component: <LoveLetterStep /> },
  ];

  return (
    <div className={styles.container}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className={styles.stepContainer}
        >
          {steps[currentStep]?.component}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Welcome Step Component
const WelcomeStep: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onNext();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className={styles.welcomeStep}>
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className={styles.title}
      >
        Happy Anniversary, Beautiful! 💕
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className={styles.subtitle}
      >
        I made something special just for you...
      </motion.p>
    </div>
  );
};

// Name Step Component
const NameStep: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [name, setName] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctName = 'Sarah Johnson'; // Replace with her actual name
    const yourLastName = 'Smith'; // Replace with your last name
    
    if (name.toLowerCase() === `sarah ${yourLastName.toLowerCase()}`) {
      onNext();
    } else if (attempts < 1) {
      setAttempts(prev => prev + 1);
      setError('Hmm, that doesn\'t seem right...');
    } else {
      setShowHint(true);
      setError('Maybe try my last name instead? 😉');
    }
  };

  return (
    <div className={styles.nameStep}>
      <h2 className={styles.stepTitle}>Let's start with the basics...</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="name" className={styles.label}>
          What's your full name?
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
          placeholder="Enter your full name"
          required
        />
        {error && <p className={styles.error}>{error}</p>}
        {showHint && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles.hint}
          >
            Hint: Maybe try my last name instead? 😉
          </motion.p>
        )}
        <button type="submit" className={styles.button}>
          Continue
        </button>
      </form>
    </div>
  );
};

// Qualities Step Component
const QualitiesStep: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [selectedQualities, setSelectedQualities] = useState<string[]>([]);
  const [removedQualities, setRemovedQualities] = useState<string[]>([]);

  const goodQualities = [
    'Beautiful', 'Funny', 'Smart', 'Kind', 'Adventurous',
    'Caring', 'Creative', 'Loving', 'Amazing'
  ];

  const badQualities = [
    'Boring', 'Mean', 'Lazy', 'Rude', 'Selfish', 'Annoying'
  ];

  const allQualities = [...goodQualities, ...badQualities];

  const handleQualityClick = (quality: string) => {
    if (badQualities.includes(quality)) {
      setRemovedQualities(prev => [...prev, quality]);
    } else {
      setSelectedQualities(prev => 
        prev.includes(quality) 
          ? prev.filter(q => q !== quality)
          : [...prev, quality]
      );
    }
  };

  const canContinue = selectedQualities.length === goodQualities.length;

  return (
    <div className={styles.qualitiesStep}>
      <h2 className={styles.stepTitle}>Why should I date you?</h2>
      <p className={styles.subtitle}>Select all the qualities that describe you:</p>
      
      <div className={styles.qualitiesGrid}>
        {allQualities.map((quality) => {
          const isRemoved = removedQualities.includes(quality);
          const isSelected = selectedQualities.includes(quality);
          
          if (isRemoved) {
            return (
              <motion.div
                key={quality}
                initial={{ opacity: 1 }}
                animate={{ opacity: 0, scale: 0.8 }}
                className={styles.qualityRemoved}
              >
                Nope! 😅
              </motion.div>
            );
          }
          
          return (
            <motion.button
              key={quality}
              onClick={() => handleQualityClick(quality)}
              className={`${styles.qualityButton} ${
                isSelected ? styles.selected : ''
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {quality}
            </motion.button>
          );
        })}
      </div>

      {canContinue && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onNext}
          className={styles.continueButton}
        >
          Continue
        </motion.button>
      )}
    </div>
  );
};

// Best Person Step Component
const BestPersonStep: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [wrongClicks, setWrongClicks] = useState<string[]>([]);

  const people = [
    { id: 'girlfriend', name: 'You', image: '/girlfriend.jpg', isCorrect: true },
    { id: 'duck', name: 'Duck', image: '/duck.jpg', isCorrect: false },
    { id: 'celebrity1', name: 'Taylor Swift', image: '/taylor.jpg', isCorrect: false },
    { id: 'villain', name: 'Darth Vader', image: '/vader.jpg', isCorrect: false },
    { id: 'random1', name: 'Random Person', image: '/random1.jpg', isCorrect: false },
    { id: 'random2', name: 'Another Person', image: '/random2.jpg', isCorrect: false }
  ];

  const handlePersonClick = (person: typeof people[0]) => {
    if (person.isCorrect) {
      setSelectedPerson(person.id);
      setTimeout(() => {
        onNext();
      }, 1500);
    } else {
      setWrongClicks(prev => [...prev, person.id]);
    }
  };

  return (
    <div className={styles.bestPersonStep}>
      <h2 className={styles.stepTitle}>Who's the best person in the world?</h2>
      <div className={styles.peopleGrid}>
        {people.map((person) => (
          <motion.div
            key={person.id}
            className={`${styles.personCard} ${
              selectedPerson === person.id ? styles.selected : ''
            } ${wrongClicks.includes(person.id) ? styles.wrong : ''}`}
            onClick={() => handlePersonClick(person)}
            animate={wrongClicks.includes(person.id) ? { x: [-5, 5, -5, 5, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.personImage}>
              <img src={person.image} alt={person.name} />
            </div>
            <p className={styles.personName}>{person.name}</p>
          </motion.div>
        ))}
      </div>
      
      {selectedPerson && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={styles.correctMessage}
        >
          Perfect choice! 💖
        </motion.div>
      )}
    </div>
  );
};

// Question Step Component
const QuestionStep: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [noClickCount, setNoClickCount] = useState(0);
  const [showGiantYes, setShowGiantYes] = useState(false);

  const noMessages = [
    'What?',
    'Why?',
    'I thought you loved me 😢',
    'Please?',
    'Are you sure?',
    'Really?'
  ];

  const handleNoClick = () => {
    if (noClickCount < noMessages.length - 1) {
      setNoClickCount(prev => prev + 1);
    } else {
      setShowGiantYes(true);
    }
  };

  const handleYesClick = () => {
    onNext();
  };

  if (showGiantYes) {
    return (
      <div className={styles.giantYesStep}>
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={styles.giantYesButton}
          onClick={handleYesClick}
        >
          YES! 💕
        </motion.button>
      </div>
    );
  }

  return (
    <div className={styles.questionStep}>
      <h2 className={styles.stepTitle}>
        Will you be my forever valentine?
      </h2>
      <div className={styles.buttonContainer}>
        <motion.button
          onClick={handleYesClick}
          className={styles.yesButton}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Yes! 💕
        </motion.button>
        <motion.button
          onClick={handleNoClick}
          className={styles.noButton}
          key={noClickCount}
          animate={{ 
            backgroundColor: `hsl(${noClickCount * 30}, 70%, 50%)`,
            scale: [1, 1.1, 1]
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {noMessages[noClickCount] || 'No'}
        </motion.button>
      </div>
    </div>
  );
};

// Love Letter Step Component
const LoveLetterStep: React.FC = () => {
  return (
    <div className={styles.loveLetterStep}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={styles.letterContainer}
      >
        <h2 className={styles.letterTitle}>My Dearest Love,</h2>
        <div className={styles.letterContent}>
          <p>
            Every day with you feels like a beautiful adventure. You make me laugh, 
            you inspire me to be better, and you fill my heart with so much joy.
          </p>
          <p>
            This anniversary isn't just about celebrating another year together—
            it's about celebrating US. The way you smile when you're happy, 
            the way you care for everyone around you, and the way you make 
            even ordinary moments feel magical.
          </p>
          <p>
            I love you more than words can express, and I can't wait to create 
            many more memories with you. Here's to us, to our love, and to 
            all the beautiful moments still to come.
          </p>
          <p className={styles.signature}>
            Forever yours,<br />
            Your loving partner 💕
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AnniversaryWebsite;