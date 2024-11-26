import jwt from 'jsonwebtoken';


const authenticate = (req,res,next)=>{
          const token = req.header("authorization")?.replace('bearer','');

          if (!token) {
            return res.status(401).json({ message: 'Access denied,No token provided.' });
          }


try {
      const decoded = jwt.verify(token,process.env.JWT_SECRET)
          req.user = decoded
          next()  //pass control to the next middleware or route handler
} catch (error) {
    res.status(401).json({ message: 'Invalid token.' });

}}
export default authenticate;
