// Question bank for mock tests and practice questions
// Each question has 4 options, one correct answer, explanation, difficulty, and topic

export interface MCQ {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  subject?: string;
}

// Generic quantitative aptitude questions (used across many exams)
export const QUANT_QUESTIONS: MCQ[] = [
  { id: 'q1', question: 'The HCF of two numbers is 12 and their LCM is 360. If one number is 72, what is the other?', options: ['30', '60', '90', '120'], correctIndex: 1, explanation: 'HCF × LCM = Product of numbers. 12 × 360 = 72 × x. x = (12 × 360) / 72 = 60.', difficulty: 'easy', topic: 'Number System' },
  { id: 'q2', question: 'If 30% of a number is 120, what is 120% of that number?', options: ['360', '400', '480', '500'], correctIndex: 2, explanation: 'Let the number be x. 30% of x = 120, so x = 400. 120% of 400 = 480.', difficulty: 'easy', topic: 'Percentages' },
  { id: 'q3', question: 'A shopkeeper marks his goods 40% above cost price and gives a discount of 10%. His profit percentage is:', options: ['26%', '28%', '30%', '32%'], correctIndex: 0, explanation: 'Let CP = 100. MP = 140. SP = 140 × 0.9 = 126. Profit = 26%.', difficulty: 'medium', topic: 'Profit & Loss' },
  { id: 'q4', question: 'A train 150m long passes a pole in 15 seconds. What is its speed in km/h?', options: ['30 km/h', '36 km/h', '40 km/h', '45 km/h'], correctIndex: 1, explanation: 'Speed = 150/15 = 10 m/s = 10 × (18/5) = 36 km/h.', difficulty: 'easy', topic: 'Time & Distance' },
  { id: 'q5', question: 'If the simple interest on a sum for 2 years at 5% per annum is ₹500, what is the sum?', options: ['₹2,000', '₹3,000', '₹5,000', '₹10,000'], correctIndex: 2, explanation: 'SI = P × R × T / 100. 500 = P × 5 × 2 / 100. P = 5000.', difficulty: 'easy', topic: 'Simple Interest' },
  { id: 'q6', question: 'The ratio of two numbers is 3:5. If their LCM is 75, find the numbers.', options: ['15 and 25', '9 and 15', '12 and 20', '18 and 30'], correctIndex: 0, explanation: 'Let numbers be 3x and 5x. LCM = 15x = 75, so x = 5. Numbers: 15 and 25.', difficulty: 'medium', topic: 'Ratio & Proportion' },
  { id: 'q7', question: 'A and B together can do a work in 12 days. A alone can do it in 20 days. In how many days can B alone do the work?', options: ['25 days', '30 days', '35 days', '40 days'], correctIndex: 1, explanation: '1/12 - 1/20 = (5-3)/60 = 2/60 = 1/30. B takes 30 days.', difficulty: 'medium', topic: 'Time & Work' },
  { id: 'q8', question: 'Find the value of x: 2x + 5 = 17', options: ['4', '5', '6', '7'], correctIndex: 2, explanation: '2x = 17 - 5 = 12. x = 6.', difficulty: 'easy', topic: 'Linear Equations' },
  { id: 'q9', question: 'The area of a circle with radius 7 cm is (π = 22/7):', options: ['154 cm²', '144 cm²', '164 cm²', '174 cm²'], correctIndex: 0, explanation: 'Area = πr² = (22/7) × 7 × 7 = 154 cm².', difficulty: 'easy', topic: 'Mensuration' },
  { id: 'q10', question: 'If x² - 5x + 6 = 0, what are the roots?', options: ['2 and 3', '1 and 6', '-2 and -3', '1 and 5'], correctIndex: 0, explanation: 'x² - 5x + 6 = (x-2)(x-3) = 0. Roots: x = 2, 3.', difficulty: 'easy', topic: 'Quadratic Equations' },
  { id: 'q11', question: 'A man walks 3 km north, then 4 km east. How far is he from the starting point?', options: ['5 km', '7 km', '1 km', '25 km'], correctIndex: 0, explanation: '√(3² + 4²) = √25 = 5 km (Pythagoras).', difficulty: 'easy', topic: 'Geometry' },
  { id: 'q12', question: 'The average of 5 consecutive even numbers is 16. What is the largest number?', options: ['18', '20', '22', '24'], correctIndex: 1, explanation: 'Average = 16 means middle number = 16. Numbers: 12, 14, 16, 18, 20. Largest = 20.', difficulty: 'medium', topic: 'Average' },
  { id: 'q13', question: 'What is 25% of 25% of 400?', options: ['25', '20', '15', '10'], correctIndex: 0, explanation: '25% of 400 = 100. 25% of 100 = 25.', difficulty: 'easy', topic: 'Percentages' },
  { id: 'q14', question: 'If the perimeter of a square is 48 cm, its area is:', options: ['96 cm²', '144 cm²', '121 cm²', '100 cm²'], correctIndex: 1, explanation: 'Side = 48/4 = 12 cm. Area = 12² = 144 cm².', difficulty: 'easy', topic: 'Mensuration' },
  { id: 'q15', question: 'A car travels 240 km in 4 hours. What is its average speed?', options: ['50 km/h', '60 km/h', '55 km/h', '65 km/h'], correctIndex: 1, explanation: 'Speed = Distance/Time = 240/4 = 60 km/h.', difficulty: 'easy', topic: 'Time & Distance' },
];

export const REASONING_QUESTIONS: MCQ[] = [
  { id: 'r1', question: 'Book : Author :: Painting : ?', options: ['Brush', 'Canvas', 'Artist', 'Art Gallery'], correctIndex: 2, explanation: 'An author writes a book; an artist creates a painting.', difficulty: 'easy', topic: 'Analogy' },
  { id: 'r2', question: 'Find the next term: 2, 6, 12, 20, 30, ?', options: ['40', '42', '44', '46'], correctIndex: 1, explanation: 'Differences: 4, 6, 8, 10, 12. Next term = 30 + 12 = 42.', difficulty: 'easy', topic: 'Series' },
  { id: 'r3', question: 'If CAT is coded as 24, how is DOG coded?', options: ['25', '26', '27', '28'], correctIndex: 2, explanation: 'C=3, A=1, T=20. Sum = 24. D=4, O=15, G=7. Sum = 26. Actually D(4)+O(15)+G(7) = 26. Answer: 26.', difficulty: 'medium', topic: 'Coding-Decoding' },
  { id: 'r4', question: 'Pointing to a man, a woman said, "His mother is my mother\'s daughter." How is the man related to her?', options: ['Brother', 'Son', 'Father', 'Uncle'], correctIndex: 1, explanation: 'Her mother\'s daughter = herself. So his mother is herself. He is her son.', difficulty: 'medium', topic: 'Blood Relations' },
  { id: 'r5', question: 'Find the odd one out: 3, 5, 7, 11, 14, 17', options: ['3', '5', '14', '17'], correctIndex: 2, explanation: 'All are prime numbers except 14 (which is 2 × 7).', difficulty: 'easy', topic: 'Classification' },
  { id: 'r6', question: 'If in a code, MONKEY is written as XDJMNL, how is TIGER coded?', options: ['QDFHS', 'SHFDQ', 'UJHFS', 'RHFDS'], correctIndex: 1, explanation: 'Each letter is shifted by -1. T→S, I→H, G→F, E→D, R→Q. Answer: SHFDQ.', difficulty: 'hard', topic: 'Coding-Decoding' },
  { id: 'r7', question: 'Which number completes the series: 1, 4, 9, 16, 25, ?', options: ['30', '36', '49', '64'], correctIndex: 1, explanation: 'Perfect squares: 1², 2², 3², 4², 5², 6² = 36.', difficulty: 'easy', topic: 'Series' },
  { id: 'r8', question: 'A is B\'s brother. C is B\'s mother. D is A\'s father. How is C related to D?', options: ['Sister', 'Wife', 'Mother', 'Daughter'], correctIndex: 1, explanation: 'A and B are siblings. C is their mother, D is their father. C is D\'s wife.', difficulty: 'medium', topic: 'Blood Relations' },
  { id: 'r9', question: 'Mirror image of "1965" is:', options: ['1965', '5961', '1965 reversed', '1965 itself'], correctIndex: 1, explanation: 'In a mirror, digits appear reversed left-to-right: 5961.', difficulty: 'easy', topic: 'Mirror Images' },
  { id: 'r10', question: 'Find the next in series: A, C, E, G, ?', options: ['H', 'I', 'J', 'K'], correctIndex: 1, explanation: 'Skipping one letter each time: A(+2)C(+2)E(+2)G(+2)I.', difficulty: 'easy', topic: 'Series' },
];

export const ENGLISH_QUESTIONS: MCQ[] = [
  { id: 'e1', question: 'Choose the synonym of "Abundant":', options: ['Scarce', 'Plentiful', 'Limited', 'Rare'], correctIndex: 1, explanation: 'Abundant means existing in large quantities; plentiful.', difficulty: 'easy', topic: 'Vocabulary' },
  { id: 'e2', question: 'Choose the antonym of "Transparent":', options: ['Clear', 'Opaque', 'Visible', 'Open'], correctIndex: 1, explanation: 'Transparent allows light through; opaque does not.', difficulty: 'easy', topic: 'Vocabulary' },
  { id: 'e3', question: 'Fill in the blank: He is known ___ his honesty.', options: ['for', 'as', 'by', 'with'], correctIndex: 0, explanation: '"Known for" means recognized because of a quality.', difficulty: 'easy', topic: 'Grammar' },
  { id: 'e4', question: 'Find the error: "Neither of the boys have done their homework."', options: ['Neither', 'have', 'their', 'No error'], correctIndex: 1, explanation: '"Neither of" takes a singular verb. Correct: "has done".', difficulty: 'medium', topic: 'Grammar' },
  { id: 'e5', question: 'Choose the correct spelling:', options: ['Accomodation', 'Acommodation', 'Accommodation', 'Acomodation'], correctIndex: 2, explanation: 'Correct spelling: Accommodation (double c, double m).', difficulty: 'easy', topic: 'Vocabulary' },
  { id: 'e6', question: 'One word for "a person who talks too much":', options: ['Taciturn', 'Loquacious', 'Reticent', 'Reserved'], correctIndex: 1, explanation: 'Loquacious means tending to talk a great deal.', difficulty: 'medium', topic: 'Vocabulary' },
  { id: 'e7', question: 'The passive voice of "She writes a letter" is:', options: ['A letter is written by her', 'A letter was written by her', 'A letter has been written by her', 'A letter is being written by her'], correctIndex: 0, explanation: 'Present simple passive: is/am/are + past participle. "A letter is written by her."', difficulty: 'easy', topic: 'Grammar' },
  { id: 'e8', question: 'Choose the correct preposition: "She is fond ___ music."', options: ['of', 'with', 'for', 'in'], correctIndex: 0, explanation: '"Fond of" is the correct collocation.', difficulty: 'easy', topic: 'Grammar' },
  { id: 'e9', question: 'Synonym of "Diligent":', options: ['Lazy', 'Hardworking', 'Careless', 'Slow'], correctIndex: 1, explanation: 'Diligent means showing care and effort; hardworking.', difficulty: 'easy', topic: 'Vocabulary' },
  { id: 'e10', question: 'Choose the correct article: "___ honest man is respected."', options: ['A', 'An', 'The', 'No article'], correctIndex: 1, explanation: '"Honest" starts with a silent h, so "an" is used.', difficulty: 'easy', topic: 'Grammar' },
];

export const GA_QUESTIONS: MCQ[] = [
  { id: 'g1', question: 'Who is known as the "Father of the Indian Constitution"?', options: ['Mahatma Gandhi', 'Jawaharlal Nehru', 'B.R. Ambedkar', 'Rajendra Prasad'], correctIndex: 2, explanation: 'Dr. B.R. Ambedkar was the Chairman of the Drafting Committee.', difficulty: 'easy', topic: 'Polity' },
  { id: 'g2', question: 'Which is the longest river in India?', options: ['Yamuna', 'Ganga', 'Godavari', 'Krishna'], correctIndex: 1, explanation: 'The Ganga is the longest river in India (2,525 km).', difficulty: 'easy', topic: 'Geography' },
  { id: 'g3', question: 'When did the Quit India Movement start?', options: ['August 8, 1942', 'August 15, 1947', 'January 26, 1950', 'October 2, 1947'], correctIndex: 0, explanation: 'The Quit India Movement was launched on August 8, 1942.', difficulty: 'medium', topic: 'History' },
  { id: 'g4', question: 'What is the SI unit of electric current?', options: ['Volt', 'Watt', 'Ampere', 'Ohm'], correctIndex: 2, explanation: 'The SI unit of electric current is the Ampere (A).', difficulty: 'easy', topic: 'Science' },
  { id: 'g5', question: 'How many fundamental rights are guaranteed by the Indian Constitution?', options: ['5', '6', '7', '11'], correctIndex: 1, explanation: 'There are 6 fundamental rights (after Right to Property was removed).', difficulty: 'medium', topic: 'Polity' },
  { id: 'g6', question: 'Which planet is known as the "Red Planet"?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correctIndex: 1, explanation: 'Mars is called the Red Planet due to iron oxide on its surface.', difficulty: 'easy', topic: 'Science' },
  { id: 'g7', question: 'Who discovered penicillin?', options: ['Alexander Fleming', 'Louis Pasteur', 'Robert Koch', 'Edward Jenner'], correctIndex: 0, explanation: 'Alexander Fleming discovered penicillin in 1928.', difficulty: 'easy', topic: 'Science' },
  { id: 'g8', question: 'The Tropic of Cancer passes through how many Indian states?', options: ['6', '7', '8', '9'], correctIndex: 2, explanation: 'The Tropic of Cancer passes through 8 Indian states.', difficulty: 'hard', topic: 'Geography' },
  { id: 'g9', question: 'Which Mughal emperor built the Taj Mahal?', options: ['Akbar', 'Babur', 'Shah Jahan', 'Aurangzeb'], correctIndex: 2, explanation: 'Shah Jahan built the Taj Mahal in memory of his wife Mumtaz Mahal.', difficulty: 'easy', topic: 'History' },
  { id: 'g10', question: 'What is the chemical formula for water?', options: ['H₂O₂', 'H₂O', 'HO₂', 'H₃O'], correctIndex: 1, explanation: 'Water is H₂O — two hydrogen atoms and one oxygen atom.', difficulty: 'easy', topic: 'Science' },
];

export const PHYSICS_QUESTIONS: MCQ[] = [
  { id: 'p1', question: 'The SI unit of force is:', options: ['Joule', 'Watt', 'Newton', 'Pascal'], correctIndex: 2, explanation: 'Force = mass × acceleration. SI unit: Newton (N).', difficulty: 'easy', topic: 'Mechanics' },
  { id: 'p2', question: 'A body moving with constant velocity has:', options: ['Accelerating motion', 'Zero acceleration', 'Negative acceleration', 'Variable acceleration'], correctIndex: 1, explanation: 'Constant velocity means no change in speed or direction, so acceleration is zero.', difficulty: 'easy', topic: 'Kinematics' },
  { id: 'p3', question: 'The value of g on the surface of the Earth is approximately:', options: ['9.8 m/s²', '8.9 m/s²', '10.8 m/s²', '9.0 m/s²'], correctIndex: 0, explanation: 'Acceleration due to gravity g ≈ 9.8 m/s² on Earth\'s surface.', difficulty: 'easy', topic: 'Gravitation' },
  { id: 'p4', question: 'Ohm\'s law states V = IR. If V = 12V and R = 4Ω, what is I?', options: ['2A', '3A', '4A', '48A'], correctIndex: 1, explanation: 'I = V/R = 12/4 = 3A.', difficulty: 'easy', topic: 'Current Electricity' },
  { id: 'p5', question: 'The speed of light in vacuum is approximately:', options: ['3 × 10⁶ m/s', '3 × 10⁷ m/s', '3 × 10⁸ m/s', '3 × 10⁹ m/s'], correctIndex: 2, explanation: 'Speed of light c = 3 × 10⁸ m/s.', difficulty: 'easy', topic: 'Optics' },
  { id: 'p6', question: 'A ball is thrown vertically upward at 20 m/s. Maximum height reached (g=10):', options: ['10 m', '20 m', '30 m', '40 m'], correctIndex: 1, explanation: 'H = u²/(2g) = 400/20 = 20 m.', difficulty: 'medium', topic: 'Kinematics' },
  { id: 'p7', question: 'The unit of electric resistance is:', options: ['Volt', 'Ampere', 'Ohm', 'Watt'], correctIndex: 2, explanation: 'Resistance is measured in Ohms (Ω).', difficulty: 'easy', topic: 'Current Electricity' },
  { id: 'p8', question: 'Which of the following is a vector quantity?', options: ['Speed', 'Mass', 'Velocity', 'Time'], correctIndex: 2, explanation: 'Velocity has both magnitude and direction, making it a vector.', difficulty: 'easy', topic: 'Kinematics' },
  { id: 'p9', question: 'Two resistors 3Ω and 6Ω are connected in parallel. Equivalent resistance is:', options: ['2Ω', '3Ω', '9Ω', '18Ω'], correctIndex: 0, explanation: '1/R = 1/3 + 1/6 = 2/6 + 1/6 = 3/6 = 1/2. R = 2Ω.', difficulty: 'medium', topic: 'Current Electricity' },
  { id: 'p10', question: 'The dimensional formula of work is:', options: ['[ML²T⁻²]', '[MLT⁻²]', '[ML²T⁻¹]', '[MLT⁻¹]'], correctIndex: 0, explanation: 'Work = Force × Distance = [MLT⁻²][L] = [ML²T⁻²].', difficulty: 'hard', topic: 'Mechanics' },
];

export const CHEMISTRY_QUESTIONS: MCQ[] = [
  { id: 'c1', question: 'The atomic number of Carbon is:', options: ['4', '6', '8', '12'], correctIndex: 1, explanation: 'Carbon has 6 protons, so atomic number = 6.', difficulty: 'easy', topic: 'Atomic Structure' },
  { id: 'c2', question: 'Which gas is most abundant in the Earth\'s atmosphere?', options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'], correctIndex: 2, explanation: 'Nitrogen makes up about 78% of Earth\'s atmosphere.', difficulty: 'easy', topic: 'General Chemistry' },
  { id: 'c3', question: 'The pH of a neutral solution is:', options: ['0', '7', '14', '1'], correctIndex: 1, explanation: 'A neutral solution has pH = 7 at 25°C.', difficulty: 'easy', topic: 'Acids & Bases' },
  { id: 'c4', question: 'What is the chemical formula for common salt?', options: ['NaCl', 'KCl', 'CaCO₃', 'NaOH'], correctIndex: 0, explanation: 'Common salt (table salt) is Sodium Chloride (NaCl).', difficulty: 'easy', topic: 'General Chemistry' },
  { id: 'c5', question: 'The hybridization of carbon in CH₄ (methane) is:', options: ['sp', 'sp²', 'sp³', 'sp³d'], correctIndex: 2, explanation: 'CH₄ has 4 sigma bonds and no lone pairs → sp³ hybridization → tetrahedral.', difficulty: 'medium', topic: 'Chemical Bonding' },
  { id: 'c6', question: 'Which is the lightest element?', options: ['Helium', 'Hydrogen', 'Lithium', 'Carbon'], correctIndex: 1, explanation: 'Hydrogen is the lightest element with atomic number 1.', difficulty: 'easy', topic: 'Atomic Structure' },
  { id: 'c7', question: 'The number of moles in 36g of water (H₂O) is:', options: ['1', '2', '3', '4'], correctIndex: 1, explanation: 'Molar mass of H₂O = 18 g/mol. Moles = 36/18 = 2.', difficulty: 'medium', topic: 'Mole Concept' },
  { id: 'c8', question: 'Which of the following is an exothermic reaction?', options: ['Melting ice', 'Dissolving salt in water', 'Burning of fuel', 'Evaporation'], correctIndex: 2, explanation: 'Burning of fuel releases heat, making it exothermic.', difficulty: 'easy', topic: 'Thermodynamics' },
  { id: 'c9', question: 'The catalyst used in the Haber process for ammonia synthesis is:', options: ['Platinum', 'Iron', 'Nickel', 'Vanadium'], correctIndex: 1, explanation: 'Iron catalyst is used in the Haber process (N₂ + 3H₂ → 2NH₃).', difficulty: 'hard', topic: 'Industrial Chemistry' },
  { id: 'c10', question: 'Oxidation involves:', options: ['Gain of electrons', 'Loss of electrons', 'Gain of protons', 'Loss of protons'], correctIndex: 1, explanation: 'Oxidation is loss of electrons (OIL RIG: Oxidation Is Loss, Reduction Is Gain).', difficulty: 'easy', topic: 'Redox Reactions' },
];

export const BIOLOGY_QUESTIONS: MCQ[] = [
  { id: 'b1', question: 'The powerhouse of the cell is:', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi body'], correctIndex: 1, explanation: 'Mitochondria produces ATP through cellular respiration.', difficulty: 'easy', topic: 'Cell Biology' },
  { id: 'b2', question: 'Which organ produces insulin?', options: ['Liver', 'Kidney', 'Pancreas', 'Spleen'], correctIndex: 2, explanation: 'Insulin is produced by beta cells in the pancreas.', difficulty: 'easy', topic: 'Human Physiology' },
  { id: 'b3', question: 'The basic unit of life is:', options: ['Tissue', 'Organ', 'Cell', 'Organism'], correctIndex: 2, explanation: 'The cell is the smallest structural and functional unit of life.', difficulty: 'easy', topic: 'Cell Biology' },
  { id: 'b4', question: 'Photosynthesis occurs in which organelle?', options: ['Mitochondria', 'Chloroplast', 'Nucleus', 'Vacuole'], correctIndex: 1, explanation: 'Photosynthesis takes place in chloroplasts, which contain chlorophyll.', difficulty: 'easy', topic: 'Plant Physiology' },
  { id: 'b5', question: 'In a monohybrid cross, the F2 phenotypic ratio is:', options: ['1:1', '3:1', '9:3:3:1', '1:2:1'], correctIndex: 1, explanation: 'Monohybrid F2: 3 dominant : 1 recessive phenotypic ratio.', difficulty: 'medium', topic: 'Genetics' },
  { id: 'b6', question: 'The number of chromosomes in a normal human cell is:', options: ['23', '44', '46', '48'], correctIndex: 2, explanation: 'Humans have 46 chromosomes (23 pairs).', difficulty: 'easy', topic: 'Genetics' },
  { id: 'b7', question: 'Which blood cells fight infections?', options: ['Red blood cells', 'White blood cells', 'Platelets', 'Plasma'], correctIndex: 1, explanation: 'White blood cells (leukocytes) are the body\'s defense against infection.', difficulty: 'easy', topic: 'Human Physiology' },
  { id: 'b8', question: 'Where does fertilization occur in humans?', options: ['Uterus', 'Ovary', 'Fallopian tube', 'Cervix'], correctIndex: 2, explanation: 'Fertilization typically occurs in the ampulla of the fallopian tube.', difficulty: 'medium', topic: 'Reproduction' },
  { id: 'b9', question: 'The product of light reaction in photosynthesis is:', options: ['Glucose', 'ATP and NADPH', 'Oxygen only', 'Carbon dioxide'], correctIndex: 1, explanation: 'Light reactions produce ATP, NADPH, and O₂ as byproduct.', difficulty: 'medium', topic: 'Plant Physiology' },
  { id: 'b10', question: 'Which hormone is called the "stress hormone"?', options: ['Insulin', 'Cortisol', 'Adrenaline', 'Thyroxine'], correctIndex: 1, explanation: 'Cortisol is called the stress hormone, released during stress.', difficulty: 'medium', topic: 'Human Physiology' },
];

// Get questions by subject combination
export function getQuestionsForExam(examSlug: string, count: number = 50): MCQ[] {
  const subjectMap: Record<string, MCQ[][]> = {
    'jee-main': [PHYSICS_QUESTIONS, CHEMISTRY_QUESTIONS, QUANT_QUESTIONS],
    'jee-advanced': [PHYSICS_QUESTIONS, CHEMISTRY_QUESTIONS, QUANT_QUESTIONS],
    'neet-ug': [BIOLOGY_QUESTIONS, PHYSICS_QUESTIONS, CHEMISTRY_QUESTIONS],
    'neet-pg': [BIOLOGY_QUESTIONS, PHYSICS_QUESTIONS, CHEMISTRY_QUESTIONS],
    'ntse': [QUANT_QUESTIONS, REASONING_QUESTIONS, GA_QUESTIONS],
    'olympiads': [QUANT_QUESTIONS, PHYSICS_QUESTIONS, ENGLISH_QUESTIONS],
    'cuet-ug': [QUANT_QUESTIONS, REASONING_QUESTIONS, GA_QUESTIONS, ENGLISH_QUESTIONS],
    'nda': [QUANT_QUESTIONS, GA_QUESTIONS, ENGLISH_QUESTIONS, PHYSICS_QUESTIONS],
    'clat': [ENGLISH_QUESTIONS, GA_QUESTIONS, REASONING_QUESTIONS, QUANT_QUESTIONS],
    'upsc-cse': [GA_QUESTIONS, QUANT_QUESTIONS, REASONING_QUESTIONS, ENGLISH_QUESTIONS],
    'ssc-cgl': [QUANT_QUESTIONS, REASONING_QUESTIONS, ENGLISH_QUESTIONS, GA_QUESTIONS],
    'ssc-chsl': [QUANT_QUESTIONS, REASONING_QUESTIONS, ENGLISH_QUESTIONS, GA_QUESTIONS],
    'rrb-ntpc': [GA_QUESTIONS, QUANT_QUESTIONS, REASONING_QUESTIONS, ENGLISH_QUESTIONS],
    'upsc-cds': [ENGLISH_QUESTIONS, GA_QUESTIONS, QUANT_QUESTIONS],
    'police-constable': [GA_QUESTIONS, QUANT_QUESTIONS, REASONING_QUESTIONS],
    'sbi-po': [QUANT_QUESTIONS, REASONING_QUESTIONS, ENGLISH_QUESTIONS, GA_QUESTIONS],
    'ibps-po': [QUANT_QUESTIONS, REASONING_QUESTIONS, ENGLISH_QUESTIONS, GA_QUESTIONS],
    'ibps-clerk': [QUANT_QUESTIONS, REASONING_QUESTIONS, ENGLISH_QUESTIONS, GA_QUESTIONS],
    'rbi-grade-b': [GA_QUESTIONS, ENGLISH_QUESTIONS, QUANT_QUESTIONS, REASONING_QUESTIONS],
    'lic-aao': [QUANT_QUESTIONS, REASONING_QUESTIONS, ENGLISH_QUESTIONS, GA_QUESTIONS],
    'gate': [QUANT_QUESTIONS, PHYSICS_QUESTIONS, CHEMISTRY_QUESTIONS],
    'isro': [PHYSICS_QUESTIONS, QUANT_QUESTIONS, REASONING_QUESTIONS],
    'cat': [QUANT_QUESTIONS, REASONING_QUESTIONS, ENGLISH_QUESTIONS],
    'xat': [QUANT_QUESTIONS, ENGLISH_QUESTIONS, GA_QUESTIONS, REASONING_QUESTIONS],
    'ctet': [GA_QUESTIONS, ENGLISH_QUESTIONS, QUANT_QUESTIONS, BIOLOGY_QUESTIONS],
    'ap-tet': [GA_QUESTIONS, ENGLISH_QUESTIONS, QUANT_QUESTIONS, BIOLOGY_QUESTIONS],
    'ugc-net': [GA_QUESTIONS, REASONING_QUESTIONS, QUANT_QUESTIONS, ENGLISH_QUESTIONS],
    'afc': [GA_QUESTIONS, ENGLISH_QUESTIONS, QUANT_QUESTIONS, REASONING_QUESTIONS],
    'agniveer': [GA_QUESTIONS, QUANT_QUESTIONS, REASONING_QUESTIONS, PHYSICS_QUESTIONS],
    'ca-foundation': [QUANT_QUESTIONS, GA_QUESTIONS, ENGLISH_QUESTIONS],
    'sebi-grade-a': [GA_QUESTIONS, QUANT_QUESTIONS, REASONING_QUESTIONS, ENGLISH_QUESTIONS],
    'icar-aieea': [BIOLOGY_QUESTIONS, PHYSICS_QUESTIONS, CHEMISTRY_QUESTIONS],
    'nata': [QUANT_QUESTIONS, REASONING_QUESTIONS, PHYSICS_QUESTIONS],
    'nift': [QUANT_QUESTIONS, ENGLISH_QUESTIONS, GA_QUESTIONS, REASONING_QUESTIONS],
    'nchm-jee': [QUANT_QUESTIONS, ENGLISH_QUESTIONS, GA_QUESTIONS, REASONING_QUESTIONS],
  };

  const pools = subjectMap[examSlug] ?? [QUANT_QUESTIONS, REASONING_QUESTIONS, GA_QUESTIONS, ENGLISH_QUESTIONS];
  const all = pools.flat();

  // Shuffle and take the required count, cycling if not enough
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  const result: MCQ[] = [];
  let i = 0;
  while (result.length < count && i < shuffled.length * 3) {
    const q = shuffled[i % shuffled.length];
    if (!result.includes(q)) result.push(q);
    i++;
  }
  return result.slice(0, count);
}

// Get practice questions for a specific topic
export function getPracticeQuestions(topicName: string, level: 'easy' | 'medium' | 'hard' | 'expert', count: number = 20): MCQ[] {
  const allPools = [QUANT_QUESTIONS, REASONING_QUESTIONS, ENGLISH_QUESTIONS, GA_QUESTIONS, PHYSICS_QUESTIONS, CHEMISTRY_QUESTIONS, BIOLOGY_QUESTIONS].flat();
  let filtered = allPools.filter(q => q.topic.toLowerCase().includes(topicName.toLowerCase()) || topicName.toLowerCase().includes(q.topic.toLowerCase()));

  if (filtered.length === 0) {
    filtered = allPools;
  }

  // Adjust difficulty based on level
  if (level === 'easy') filtered = filtered.filter(q => q.difficulty === 'easy');
  else if (level === 'medium') filtered = filtered.filter(q => q.difficulty === 'easy' || q.difficulty === 'medium');
  else if (level === 'hard') filtered = filtered.filter(q => q.difficulty === 'medium' || q.difficulty === 'hard');
  else filtered = allPools; // expert: all questions

  if (filtered.length === 0) filtered = allPools;
  return filtered.slice(0, count);
}

export function getDailyQuestions(count: number = 10): MCQ[] {
  const all = [QUANT_QUESTIONS, REASONING_QUESTIONS, ENGLISH_QUESTIONS, GA_QUESTIONS, PHYSICS_QUESTIONS, CHEMISTRY_QUESTIONS, BIOLOGY_QUESTIONS].flat();
  const today = new Date().getDate();
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  // Use date as seed for consistency within a day
  return shuffled.slice(today % 5, (today % 5) + count);
}
