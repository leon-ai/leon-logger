import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import path from 'path';

import response from './response';
import { api } from './config';

import corsMidd from '../middlewares/cors';
import basicMidd from '../middlewares/basic';
import originMidd from '../middlewares/origin';

import log from '../helpers/log';
import { timestamp } from '../helpers/date';

const app = express();
const dbPath = path.join(__dirname, '../../db/db.json');
let adapter = { };
let db = { };

export default class Server {
  static async init() {
    app.use(helmet());
    app.use(corsMidd);
    app.use(basicMidd);
    app.use(originMidd);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
      extended: true,
    }));

    log.title('Initialization');

    try {
      adapter = new FileSync(dbPath);
      db = low(adapter);
      await db.defaults({ items: [] })
        .write();

      log.success('Database loaded');
    } catch (e) {
      log.error(`Error while generating database: ${e}`);
    }

    log.success(`Current env :: ${process.env.NODE_ENV}`);

    this.bootstrap();
  }

  static bootstrap() {
    app.post(`${api().version}/expressions`, async (req, res) => {
      const {
        lang,
        version,
        query,
        classification,
      } = req.body;

      if (lang && version && query && classification && typeof classification === 'object') {
        if (lang !== 'en' && lang !== 'fr') {
          response.error(res, 400, 'invalid_language');
        } else {
          const itemsNb = await db.get('items')
            .size()
            .value();

          if (itemsNb < 500000) {
            const expression = {
              v: version,
              q: query,
              l: lang,
              p: classification.package,
              m: classification.module,
              c: classification.confidence,
            };
            const obj = {
              t: timestamp(),
              e: expression,
            };

            try {
              await db.get('items')
                .push(obj)
                .write();
              log.success(`Item added :: ${JSON.stringify(expression)}`);
            } catch (e) {
              log.error(`Error while adding item ${e}`);
            }
          }

          response.success(res, 201, 'expression_added');
        }
      } else {
        response.error(res, 400, 'invalid_request');
      }
    });

    app.use((req, res) => { response.error(res, 404, 'not_found'); });

    this.listen();
  }

  static listen() {
    app.listen(api().port, (err) => {
      if (err) throw err;

      log.success(`Listening on :: ${api().port}`);
    });
  }
}
