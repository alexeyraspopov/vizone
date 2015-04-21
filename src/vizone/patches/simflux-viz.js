if (window.fluxWasPatched) return;

window.fluxWasPatched = true;

var vizone = window.vizone;

function patchDispatcher(dispatcher) {
	var dispatch = dispatcher.dispatch;

	dispatcher.dispatch = function() {
		return vizone(Function.apply.bind(dispatch, this, arguments), {
			title: arguments[0].actionType,
			args: Array.prototype.slice.call(arguments, 1),
			class: 'Node--action'
		});
	};
}

function patchStore(store, name) {
	var ignoreList = ['getInitialState', 'dispatch', 'subscribe', 'unsubscribe', 'publish', 'serialize', 'deserialize', 'getState'];

	Object.keys(store).filter(function(key) {
		return typeof store[key] === 'function' && ignoreList.indexOf(key) < 0;
	}).forEach(function(key) {
		var method = store[key];

		store[key] = function() {
			return vizone(Function.apply.bind(method, this, arguments), {
				title: name,
				subtitle: key,
				args: [].slice.call(arguments),
				class: 'Node--store',
				sourceLink: {
					label: name/*,
					url: store.$$$stackInfo.location*/
				}
			});
		};
	});
}

function patchActionCreator(creator, name) {
	Object.keys(creator).forEach(function(key) {
		var method = creator[key];

		creator[key] = function() {
			return vizone(Function.apply.bind(method, this, arguments), {
				title: name + '.<b>' + key + '</b>',
				args: [].slice.call(arguments),
				sourceLink: {
					label: name/*,
					url: ac.$$$stackInfo.location*/
				},
				class: 'Node--actionCreator'
			});
		};
	});
}


Object.keys(window.fluxModules).forEach(function(name) {
	var module = window.fluxModules[name];

	if (name === 'Dispatcher') {
		patchDispatcher(module);
	}

	if (/Store$/.test(name)) {
		patchStore(module, name);
	}

	if (/Actions$/.test(name)) {
		patchActionCreator(module, name);
	}
});