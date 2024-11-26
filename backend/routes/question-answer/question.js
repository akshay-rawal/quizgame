import express from 'express'
import Question from '../../models/questionSchema.js';

const router = express.Router();

router.get('/questions/:category',async (req,res)=>{
    const category = req.params.category;
    try {
            const questions = await Question.find({category});
            if(questions.length===0){
                return res.status(404).json({ message: "No questions found for this category." });
            }


            res.status(200).json({questions})
    } catch (error) {
        console.error('Error fetching questions:', error);

        res.status(500).json({ message: "Error fetching questions", error: error.message });
    }
})

export default router;
