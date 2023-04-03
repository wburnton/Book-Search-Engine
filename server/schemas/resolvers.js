const { AuthenticationError } = require('apollo-server-express');
const { Book, User } = require('../models'); 
const bookSchema = require('../models/Book');
const { signToken } = require('../utils/auth');

const resolvers = { 
Query: { 
    me: async () => { 
        return User.find({});
    }
}, 
Mutation: { 
    login: async (parent, { email, password }) => {
        const user = await User.findOne({ email });
  
        if (!user) {
          throw new AuthenticationError('No user found with this email address');
        }
  
        const correctPw = await user.isCorrectPassword(password);
  
        if (!correctPw) {
          throw new AuthenticationError('Incorrect credentials');
        }
  
        const token = signToken(user);
  
        return { token, user };
      }, 
      addUser: async (parent, args) => {
        const user = await User.create(args);
        const token = signToken(user);
        return { token, user };
      }, 
      saveBook: async ( parents, args, context) => { 
        if (context.user) { 
            const book =  await User.findOneAndUpdate( 
                {_id: context.user._id}, 
                { $addToSet: {savedBooks: args}},  
                {
                    new: true,
                    runValidators: true,
                  }  
                  



            



            );
            return book;
        }
      },
      removeBook: async (parent, args, context) => { 
        if (context.user) { 
            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $pull: { savedBooks: { bookId: args.bookId } } },
                { new: true }
            );
            return updatedUser;
        }
      }
}
}; 

module.exports = resolvers;