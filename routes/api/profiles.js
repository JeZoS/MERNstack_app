const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const {check,validationResult} = require('express-validator');

router.get('/me',auth,
    async (req,res)=> {
        try{
            const profile= await Profile.findOne({user: req.user.id}).populate('user',['name']);
            if(!profile){
                return res.status(400).json({message:'No profile for this user'});
            }
            res.json({profile});
        }
        catch(err){
            console.error(err.message);
            res.status(500).send('server error');
        }
    });

router.post('/',[auth,[
    check('status','status required').not().isEmpty(),
    check('skills','skills required').not().isEmpty()
]], 
async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors : errors.array() });
    }
       const {
           company,website,location,bio,status,githubusername,skills,
           youtube,facebook,twitter,instagram,linkedin
       } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;
    if(status) profileFields.status = status;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(githubusername) profileFields.githubusername = githubusername;
    if(skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }
    profileFields.social = {};
    if(youtube) profileFields.social.youtube = youtube;
    if(twitter) profileFields.social.twitter = twitter;
    if(facebook) profileFields.social.facebook = facebook;
    if(linkedin) profileFields.social.linkedin = linkedin;
    if(instagram) profileFields.social.instagram = instagram;

    try{
        let profile = await Profile.findOne({user : req.user.id});
        if(profile){
            profile = await Profile.findOneAndUpdate(
                {user : req.user.id},
                {$set : profileFields},
                {new : true}
            );
            return res.json(profile);
        }
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/', async (req,res)=> {
    try {
        const profile = await Profile.find().populate('user',['name']);
        res.json(profile);                
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/user/:user_id', async (req,res)=> {
    try {
        const profile = await Profile.findOne({user : req.params.user_id }).populate('user',['name']);
        if(!profile){
            return res.status(400).json({message:'there is no such user profile'});
        }
        res.json(profile);                
    } catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(400).json({message:'there is no such user profile'});
        }
        res.status(500).send('Server error');
    }
});
router.delete('/',auth,async (req,res)=>{
    try {
        await Profile.deleteOne({ user: req.user.id});
        await User.deleteOne({ _id: req.user.id});
        res.json({message:'user deleted'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
router.put('/experience',[auth,[
    check('title','title is required').not().isEmpty(),
    check('company','company is required').not().isEmpty(),
    check('from','Form date is required').not().isEmpty(),
]],async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {
        title,
        company,
        from,
        to,
        location,
        current,
        description
    } = req.body;
    const newExp = {
        title,
        company,
        from,
        to,
        location,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({user:req.user.id});
        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
});

router.delete('/experience/:exp_id',auth,
    async (req,res) => {
        try {
            const profile = await Profile.findOne({user : req.user.id});
            const removeindex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
            profile.experience.splice(removeindex,1);
            
            await profile.save();
            res.status(200).json(profile);
        
        } catch (err) {
            console.error(err.message);
            res.status(500).send('server error');
        }
    });

    //for education

    router.put('/education',[auth,[
        check('school','school is required').not().isEmpty(),
        check('degree','degree is required').not().isEmpty(),
        check('from','From date is required').not().isEmpty(),
        check('fieldofstudy','fieldofstudy is required').not().isEmpty(),
    ]],async (req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }
        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        } = req.body;
        const newEdu = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        }
        try {
            const profile = await Profile.findOne({user:req.user.id});
            profile.education.unshift(newEdu);
            await profile.save();
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('server error');
        }
    });
    
    router.delete('/education/:edu_id',auth,
        async (req,res) => {
            try {
                const profile = await Profile.findOne({user : req.user.id});
                const removeindex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
                profile.education.splice(removeindex,1);
                
                await profile.save();
                res.status(200).json(profile);
            
            } catch (err) {
                console.error(err.message);
                res.status(500).send('server error');
            }
        });

module.exports = router;
