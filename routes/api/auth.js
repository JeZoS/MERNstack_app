const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const User = require('../../models/User')
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult} = require('express-validator');

router.get('/',auth, async (req,res)=> {
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json({user});
    }
    catch(err){
        res.status(500).send('server error');
    }
});
router.post('/',[
    check('email','Enter a valid email').isEmail(),
    check('password','Password required').exists()
],
async (req,res)=> {
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array() });
    }
    try{
        let user = await User.findOne({email:req.body.email});
        if(user.length==0){
            return res.status(400).json({error:'Invalid creds'});
        }
        
        const { email, password } = req.body;
        console.log(user);
        const isMatch = await bcrypt.compare( password, user.password );
        
        if(!isMatch){
            return res.status(400).json({error:'Invalid creds'});
        }

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