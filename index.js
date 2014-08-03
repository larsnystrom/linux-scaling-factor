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

    var that = this;
    this._findScaling(function (scaling) {
      if (nwWindow.window.devicePixelRatio != scaling) {
        that._scaleWindow(nwWindow, scaling);
      }
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
  },

  _scaleWindow: function(nwWindow, scaling) {
    var zoom = scaling * scaling;
    var width = nwWindow.width * scaling;
    var height = nwWindow.height * scaling;
    nwWindow.zoomLevel = zoom;
    nwWindow.resizeTo(width, height);
  }
};
