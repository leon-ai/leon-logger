import fs from 'fs';

import { registry } from './config';

import log from '../helpers/log';

const response = { };

response.success = (res, status, code, data = { }) => {
  try {
    const file = fs.readFileSync(`${__dirname}/responses/success.json`);

    const success = {
      success: true,
      status,
      message: JSON.parse(file)[code],
      code,
      data,
    };

    if ((Object.keys(data).length) === 0) {
      delete success.data;
    }

    res.status(status);
    return res.json(success);
  } catch (err) {
    log.error(err.message);
  }
};

response.error = (res, status, code, data = { }) => {
  try {
    const file = fs.readFileSync(`${__dirname}/responses/errors.json`);
    const error = {
      success: false,
      status,
      message: JSON.parse(file)[code],
      code,
      data,
    };

    if ((Object.keys(data).length) === 0) {
      delete error.data;
    }

    res.status(status);
    return res.json(error);
  } catch (err) {
    log.error(err.message);
  }
};

export default response;
