import { inherits as _inherits, createSuper as _createSuper, classCallCheck as _classCallCheck, createClass as _createClass } from "./_rollupPluginBabelHelpers.js";
import EventEmitter from "eventemitter3";
import WorkerWrapper from "./transmuxerworker.js";
var TransmuxerWorkerControl = /* @__PURE__ */ function (_EventEmitter) {
  _inherits(TransmuxerWorkerControl2, _EventEmitter);
  var _super = _createSuper(TransmuxerWorkerControl2);
  function TransmuxerWorkerControl2(options) {
    var _this;
    _classCallCheck(this, TransmuxerWorkerControl2);
    _this = _super.call(this);
    _this.openlog = options.openLog;
    _this.codecType = options.codecType;
    _this.supportHevc = options.supportHevc;
    _this.worker = new WorkerWrapper();
    _this.worker.onmessage = function (e) {
      _this.emit(e.data.method, e.data);
    };
    _this.worker.postMessage({
      method: "init",
      id: options.id || 0,
      args: {
        openlog: _this.openlog,
        supportHevc: _this.supportHevc,
        codecType: _this.codecType
      }
    });
    return _this;
  }
  _createClass(TransmuxerWorkerControl2, [{
    key: "transmux",
    value: function transmux(id, data, start, videoIdx, audioIdx, moov, useEME, kidValue, context) {
      var buffer = data.buffer;
      this.worker && this.worker.postMessage({
        method: "transmux",
        id,
        buffer,
        args: {
          start,
          videoIdx,
          audioIdx,
          moov,
          useEME,
          kidValue,
          context
        }
      }, [buffer]);
    }
  }, {
    key: "reset",
    value: function reset() {
      this.worker && this.worker.postMessage({
        method: "reset"
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.worker && this.worker.terminate();
    }
  }]);
  return TransmuxerWorkerControl2;
}(EventEmitter);
export { TransmuxerWorkerControl as default };
