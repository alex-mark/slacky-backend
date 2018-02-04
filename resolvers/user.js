import bcrypt from 'bcrypt';
import R from 'ramda';

const saltRounds = 10;

const formatErrors = (err, models) => {
  if (err instanceof models.sequelize.ValidationError) {
    return err.errors.map(e => R.pick(['path', 'message'], e));
  }
  return [{ path: 'name', message: 'Something went wrong' }];
};

export default {
  Query: {
    getUser: (parent, { id }, { models }) => models.User.findOne({ where: { id } }),
    allUsers: (parent, args, { models }) => models.User.findAll(),
  },
  Mutation: {
    register: async (parent, { password, ...otherArgs }, { models }) => {
      try {
        if (password.length < 5 || password.length > 100) {
          return {
            ok: false,
            errors: [
              {
                path: 'password',
                message: 'The password needs to be between 5 and 100 characters long',
              },
            ],
          };
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await models.User.create({ ...otherArgs, password: hashedPassword });
        return {
          ok: true,
          user,
        };
      } catch (err) {
        return {
          ok: false,
          errors: formatErrors(err, models),
        };
      }
    },
  },
};
