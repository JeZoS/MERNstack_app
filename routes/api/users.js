const express = require('express');
const router = express.Router();
const bcrypt =require('bcryptjs');
const { check, validationResult} = require('express-validator');
const gravatar = require('gravatar');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');

router.post('/',[
    check('name','name is required').not().isEmpty(),
    check('email','Enter a valid email').isEmail(),
    check('password','Please enter a password with 8 or more characters').isLength({min:8})
],async (req,res)=> {
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array() });
    }
    try{
        let user = await User.find({email:req.body.email});
        if(user.length>0){
            return res.status(400).json({error:'User already exists'});
        }
        const {name,email,password}=req.body;
        user = new User({
            name ,
            email ,
            password
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password,salt);
        await user.save();

        const payload={
            user:{
                id:user.id
            }
        }
        jwt.sign(
            payload,config.get('jwtSecret'),
            {expiresIn:360000},
            (err,token) => {
                if(err) throw err;
                res.json({ token });
            }
        )

    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Service error');
    }    
});

module.exports = router;