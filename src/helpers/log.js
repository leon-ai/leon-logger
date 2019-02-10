const log = { };

log.success = value => console.log('\x1b[1;32m%s\x1b[0m', value);

log.info = value => console.info('\x1b[1;36m%s\x1b[0m', value);

log.warn = value => console.warn('\x1b[1;33m%s\x1b[0m', value);

log.error = value => console.error('\x1b[1;31m%s\x1b[0m', value);

log.title = value => console.log('\n---\n\n\x1b[1;7m.: %s :.\x1b[0m\n', value.toUpperCase());

log.default = value => console.log('%s', value);

export default log;
