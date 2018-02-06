import R from 'ramda';

export default (err, models) => {
  if (err instanceof models.sequelize.ValidationError) {
    return err.errors.map(e => R.pick(['path', 'message'], e));
  }
  return [{ path: 'name', message: 'Something went wrong' }];
};
