import express from 'express'
import Score from '../models/scoreSchema'
import Question from '../models/questionSchema.js'


const router= express.Router();

router.post("/submit-answer",async (req,res)=>{
    const { userId, category, answers } = req.body;


    try {
        let score = 0;
        const updateAnswer = [];
      
        for(const answer of answers){
           const question =  await Question.findById(answer.questionId)
           if(!question){
            res.status(404).json(`{message:Question ID ${answer.questionId} not found}`)
           }

           const isCorrect = question.correctAnswer === answer.selectedOption

           if(isCorrect) score+=2

           updateAnswer.push({
            questionId:answer.questionId,
            isCorrect,
            selectedOption:answer.selectedOption,
            category,
           })
        }

             //update or create user score record
             const userScore = await Score.findOneAndUpdate({userId,category},
                {
                    $setOnInsert:{category,userId},
                    $push:{answers:{$each:updateAnswer}},
                    $inc:{score}

                },
                {new:true,upsert:true}
             )

             return res.status(200).json({ message: "Answers submitted successfully!"},userScore)

    } catch (error) {
        console.log("error fetching leaderboard",error);
        return res.status(500).json({message:"fetching user's leaderboard is undefined",error:error.message})
    }
})