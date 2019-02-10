import response from '../core/response';

export default (req, res, next) => {
	if (req.get('X-Origin') && req.get('X-Origin') === 'leon-core') {
		next();
	} else {
    response.error(res, 401, 'unauthorized');
	}
};
