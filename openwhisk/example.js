const crypto = require('crypto');
/**
 * Return a simple greeting message for someone.
 *
 * @param name A person's name.
 * @param place Where the person is from.
 */
function main(params) {
  console.log('params:', params);
  var course = params.course || 'PJDS';
  var name = params.name || 'Jonathan';
  return {
    payload: crypto
      .createHash('md5')
      .update(course + name)
      .digest('hex'),
  };
}
