const mongoose=require('mongoose')
const bcrypt =require('bcrypt')
const validator=require('validator')

const Schema =mongoose.Schema

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
},{timestamps:true})

userSchema.statics.signup = async function(email,password){

    if(!email||!password){
        throw Error('All fields must be filled')
    }
    if(!validator.isEmail(email)){
        throw Error('Enter a valid email')
    }
    if(!validator.isStrongPassword(password)){
        throw Error('Enter a strong password8')
    }

    const exists = await this.findOne({email})
    if (exists){
        throw Error('Email already in use')
    }
    const salt =await bcrypt.genSalt(10)
    const hash =await bcrypt.hash(password,salt)

    const user = await this.create({email,password:hash})

    return user
}

userSchema.statics.login = async function(email,password){
    if(!email||!password){
        throw Error('All fields must be filled')
    }

    const user = await this.findOne({email})
    if (!user){
        throw Error('Incorrect email')
    }

    const match=await bcrypt.compare(password,user.password)
    if(!match){
        throw Error('Incorrect password')
    }

    return user
}

userSchema.statics.reset =async function(pwd,pwd1,email){
    if (pwd != pwd1) {
        throw Error(`pwd!=pwd1 ${email}`);
    }
    const main=email;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(pwd, salt);

    const filter = { email: main };
    const update = { password: hash };

    const updatedUser = await this.findOneAndUpdate(filter, update, { new: true });

    return updatedUser;
}

// userSchema.statics.orders=async function()

module.exports=mongoose.model('users',userSchema) 