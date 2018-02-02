import bcrypt from 'bcrypt';

const saltRounds = 10;

export default {
  Query: {
    getUser: (parent, { id }, { models }) => models.User.findOne({ where: { id } }),
    allUsers: (parent, args, { models }) => models.User.findAll(),
  },
  Mutation: {
    register: async (parent, { password, ...otherArgs }, { models }) => {
      try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await models.User.create({ ...otherArgs, password: hashedPassword });
        return true;
      } catch (err) {
        return false;
      }
    },
  },
};
