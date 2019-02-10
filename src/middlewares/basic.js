import log from '../helpers/log';

export default (req, res, next) => {
  res.removeHeader('X-Powered-By');

  log.title('Requesting');
  log.info(`Requested :: ${req.method} ${req.url}`);

  next();
};
