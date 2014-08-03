/**
 * Get the scaling factor on linux desktops.
 *
 * @type {Object}
 */

module.exports = {
  scaleWindow: function(nwWindow) {
    if (!nwWindow) {
      return;
    }

    var os = require('os');
    if (os.platform() != 'linux') {
      return;
    }

    this._findScaling(function (scaling) {
      var zoom = scaling * scaling;
      nwWindow.zoomLevel = zoom;
    });
  },

  _findScaling: function(callback) {
    var exec = require('child_process').exec;

    var CMD = 'echo "';
    CMD += '`gsettings get org.gnome.desktop.interface scaling-factor | cut -c7-`';
    CMD += ' * ';
    CMD += '`gsettings get org.gnome.desktop.interface text-scaling-factor`';
    CMD += '" | bc -l';

    var child = exec(CMD, function (error, stdout, stderr) {
      if (null !== error) {
        console.log('cmd error: ' + error);
        return;
      }

      console.log(stderr);

      callback(stdout);
    });
  }
};
