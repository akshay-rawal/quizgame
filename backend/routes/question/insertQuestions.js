

import Question from '../../models/questionSchema.js';

export const insertQuestion = async () => {
  try {
    const question = new Question({
      questionText: 'What is the capital of France?',
      options: ['Paris', 'London', 'Berlin', 'Madrid'],
      correctAnswer: 'A',
      category: 'General Knowledge',
    });

    await question.save();
    console.log('Question inserted successfully!');
  } catch (error) {
    console.error('Error inserting question:', error);
  } 
};
