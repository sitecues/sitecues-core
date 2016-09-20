const hasEvent = (eventName) => {
    return ('on' + eventName) in window;
};

// TODO: Remove when a release with this PR comes out:
// https://github.com/sindresorhus/globals/pull/100
const { SpeechRecognition } = window;

export default {
    pointerEvents     : hasEvent('pointerdown'),
    touchEvents       : hasEvent('touchstart'),
    lightEvents       : hasEvent('devicelight'),
    proximityEvents   : hasEvent('deviceproximity'),
    motionEvents      : hasEvent('devicemotion'),
    orientationEvents : hasEvent('deviceorientation'),
    batteryApi        : typeof navigator.getBattery === 'function',
    vibrateApi        : typeof navigator.vibrate === 'function',
    speechSynthApi    : typeof speechSynthesis === 'object' && Boolean(speechSynthesis),
    speechRecApi      : typeof SpeechRecognition === 'function'
};
