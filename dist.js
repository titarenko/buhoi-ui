module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 22);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("buhoi-client");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var inferno = __webpack_require__(21);

module.exports = function () {
	return inferno.NO_OP;
};

/***/ }),
/* 2 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(0),
    rest = _require.rest;

module.exports = {
	resetQuery: resetQuery,

	setFilter: setFilter,
	setGrouping: setGrouping,
	setSorting: setSorting,
	setPage: setPage,
	setPageSize: setPageSize,

	loadItems: loadItems,
	invalidate: invalidate
};

function resetQuery(overrides) {
	return { type: 'LIST_SET_QUERY', query: overrides };
}

function setFilter(field, value, invalidateList) {
	return { type: 'LIST_SET_FILTER', field: field, value: value, invalidateList: invalidateList };
}

function setGrouping(field) {
	var invalidateList = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

	return { type: 'LIST_SET_GROUPING', field: field, invalidateList: invalidateList };
}

function setSorting(field, direction) {
	var invalidateList = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

	return { type: 'LIST_SET_SORTING', field: field, direction: direction, invalidateList: invalidateList };
}

function setPage(index) {
	var invalidateList = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

	return { type: 'LIST_SET_PAGE', index: index, invalidateList: invalidateList };
}

function setPageSize(size) {
	var invalidateList = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

	return { type: 'LIST_SET_PAGE_SIZE', size: size, invalidateList: invalidateList };
}

function loadItems(resource, query) {
	return rest.read('LIST_LOADING', resource, { query: query });
}

function invalidate() {
	return { type: 'LIST_INVALIDATE' };
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = __webpack_require__(0),
    rest = _require.rest,
    combineReducers = _require.combineReducers;

var Same = __webpack_require__(1);

module.exports = Edit;

Edit.actions = { setField: setField, reset: reset };

Edit.reducer = combineReducers({
	request: requestReducer,
	fields: fieldsReducer,
	error: errorReducer,
	validationErrors: validationErrorsReducer,
	isEditingFinished: isEditingFinishedReducer
});

var createVNode = Inferno.createVNode;
function Edit(props) {
	var resource = props.resource,
	    id = props.id,
	    fields = props.fields,
	    removable = props.removable,
	    restorable = props.restorable,
	    dispatch = props.dispatch,
	    onFinish = props.onFinish;
	var Form = props.Form,
	    _props$Loading = props.Loading,
	    Loading = _props$Loading === undefined ? DefaultLoading : _props$Loading,
	    _props$Error = props.Error,
	    Error = _props$Error === undefined ? DefaultError : _props$Error;


	if (isNotLoaded(props)) {
		dispatch(loadFields(resource, id));
		return createVNode(16, Same);
	}

	if (isLoading(props)) {
		return createVNode(16, Loading, _extends({}, props));
	}

	if (isError(props)) {
		return createVNode(16, Error, _extends({}, props));
	}

	if (isNotInitialized(props)) {
		dispatch(initializeFields());
		return createVNode(16, Same);
	}

	if (isFinished(props)) {
		onFinish();
		return createVNode(16, Same);
	}

	return createVNode(2, 'form', null, [Form(props), createVNode(512, 'input', {
		'type': 'submit',
		'value': '\u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C'
	}), id != null && removable ? createVNode(2, 'button', null, '\u0443\u0434\u0430\u043B\u0438\u0442\u044C', {
		'onClick': handleRemove
	}) : null, id != null && restorable ? createVNode(2, 'button', null, '\u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C', {
		'onClick': handleRestore
	}) : null, createVNode(2, 'button', null, '\u043E\u0442\u043C\u0435\u043D\u0430', {
		'onClick': handleFinish
	})], {
		'onSubmit': handleSubmit
	});

	function handleSubmit(e) {
		e.preventDefault();
		dispatch(saveFields(resource, fields));
	}

	function handleRemove(e) {
		e.preventDefault();
		if (confirm('Подтвердите удаление.')) {
			dispatch(removeItem(resource, id));
		}
	}

	function handleRestore(e) {
		e.preventDefault();
		if (confirm('Подтвердите восстановление')) {
			dispatch(restoreItem(resource, id));
		}
	}

	function handleFinish(e) {
		e.preventDefault();
		dispatch(cancelEditing());
	}
}

function isNotLoaded(_ref) {
	var id = _ref.id,
	    fields = _ref.fields,
	    request = _ref.request,
	    error = _ref.error;

	return id != null && fields == null && request == null && error == null;
}

function isLoading(_ref2) {
	var request = _ref2.request;

	return request;
}

function isError(_ref3) {
	var error = _ref3.error;

	return error;
}

function isNotInitialized(_ref4) {
	var id = _ref4.id,
	    fields = _ref4.fields;

	return id == null && fields == null;
}

function isFinished(_ref5) {
	var isEditingFinished = _ref5.isEditingFinished;

	return isEditingFinished;
}

function loadFields(resource, id) {
	return rest.read('EDIT_LOADING', resource + '/' + id);
}

function saveFields(resource, fields) {
	return rest.write('EDIT_SAVING', resource, fields);
}

function removeItem(resource, id) {
	return rest.remove('EDIT_REMOVING', resource, id);
}

function restoreItem(resource, id) {
	return rest.write('EDIT_RESTORING', resource + '.restore', { id: id });
}

function initializeFields() {
	return { type: 'EDIT_INITIALIZE_FIELDS' };
}

function setField(name, value) {
	return { type: 'EDIT_SET_FIELD', name: name, value: value };
}

function cancelEditing() {
	return { type: 'EDIT_CANCEL' };
}

function reset() {
	return { type: 'EDIT_RESET' };
}

function requestReducer() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	var action = arguments[1];

	switch (action.type) {
		case 'EDIT_LOADING_STARTED':
			return action.request;
		case 'EDIT_LOADING_SUCCEEDED':
		case 'EDIT_LOADING_FAILED':
			return null;
		case 'EDIT_RESET':
			return null;
		default:
			return state;
	}
}

function fieldsReducer() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	var action = arguments[1];

	switch (action.type) {
		case 'EDIT_LOADING_STARTED':
			return null;
		case 'EDIT_LOADING_SUCCEEDED':
			return action.result;
		case 'EDIT_LOADING_FAILED':
			return null;
		case 'EDIT_INITIALIZE_FIELDS':
			return {};
		case 'EDIT_SET_FIELD':
			return _extends({}, state, _defineProperty({}, action.name, action.value));
		case 'EDIT_RESET':
			return null;
		default:
			return state;
	}
}

function validationErrorsReducer() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var action = arguments[1];

	switch (action.type) {
		case 'EDIT_SAVING_STARTED':
		case 'EDIT_SAVING_SUCCEEDED':
			return {};
		case 'EDIT_SAVING_FAILED':
			return action.error.statusCode == 400 ? action.error.body : {};
		case 'EDIT_RESET':
			return {};
		default:
			return state;
	}
}

function errorReducer() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	var action = arguments[1];

	switch (action.type) {
		case 'EDIT_LOADING_STARTED':
		case 'EDIT_SAVING_STARTED':
		case 'EDIT_REMOVING_STARTED':
		case 'EDIT_RESTORING_STARTED':
		case 'EDIT_LOADING_SUCCEEDED':
		case 'EDIT_SAVING_SUCCEEDED':
		case 'EDIT_REMOVING_SUCCEEDED':
		case 'EDIT_RESTORING_SUCCEEDED':
		case 'EDIT_RESET':
			return null;
		case 'EDIT_LOADING_FAILED':
		case 'EDIT_SAVING_FAILED':
		case 'EDIT_REMOVING_FAILED':
		case 'EDIT_RESTORING_FAILED':
			return action.error.statusCode != 400 ? action.error : null;
		default:
			return state;
	}
}

function isEditingFinishedReducer() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
	var action = arguments[1];

	switch (action.type) {
		case 'EDIT_INITIALIZE_FIELDS':
			return false;
		case 'EDIT_LOADING_STARTED':
			return false;
		case 'EDIT_SAVING_STARTED':
			return false;
		case 'EDIT_SAVING_SUCCEEDED':
			return true;
		case 'EDIT_CANCEL':
			return true;
		case 'EDIT_RESET':
			return false;
		case 'EDIT_REMOVING_STARTED':
			return false;
		case 'EDIT_REMOVING_SUCCEEDED':
			return true;
		case 'EDIT_RESTORING_STARTED':
			return false;
		case 'EDIT_RESTORING_SUCCEEDED':
			return true;
		default:
			return state;
	}
}

function DefaultLoading() {
	return createVNode(2, 'p', null, 'Loading...');
}

function DefaultError(_ref6) {
	var error = _ref6.error;

	return createVNode(2, 'p', null, ['Error: ', error.message]);
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(11);
module.exports.actions = __webpack_require__(4);
module.exports.reducer = __webpack_require__(12);

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(13);

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _require = __webpack_require__(0),
    combineReducers = _require.combineReducers;

__webpack_require__(19);

module.exports = Multiselect;

Multiselect.reducer = combineReducers({
	query: queryReducer,
	selectedItems: selectedItemsReducer,
	suggestedItems: suggestedItemsReducer,
	selectedSuggestionIndex: selectedSuggestionIndexReducer
});

var createVNode = Inferno.createVNode;
function Multiselect(props) {
	var resource = props.resource,
	    label = props.label,
	    query = props.query,
	    suggestedItems = props.suggestedItems,
	    selectedSuggestionIndex = props.selectedSuggestionIndex,
	    _props$selectedItems = props.selectedItems,
	    selectedItems = _props$selectedItems === undefined ? [] : _props$selectedItems,
	    dispatch = props.dispatch;


	return createVNode(2, 'div', {
		'className': 'multiselect'
	}, [createVNode(2, 'span', null, label), createVNode(2, 'div', {
		'className': 'input'
	}, [selectedItems.map(function (it) {
		return createVNode(2, 'span', null, [it.name, ' \u2715'], {
			'onClick': function onClick() {
				return dispatch(remove(it));
			}
		});
	}), createVNode(512, 'input', {
		'type': 'text',
		'value': query
	}, null, {
		'onKeyDown': handleKeypress,
		'onInput': function onInput(ev) {
			return dispatch(suggest(resource, ev.target.value));
		},
		'onBlur': function onBlur(ev_) {
			return dispatch(finishSuggestion());
		},
		'onFocus': function onFocus(ev_) {
			return dispatch(suggest(resource, query));
		}
	})]), suggestedItems ? createVNode(2, 'div', {
		'className': 'suggestion'
	}, suggestedItems.map(function (it, i) {
		return createVNode(2, 'span', {
			'className': i == selectedSuggestionIndex ? 'selected' : null
		}, it.name, {
			'onMouseDown': function onMouseDown() {
				return dispatch(add(it));
			}
		});
	})) : null]);

	function handleKeypress(e) {
		if (e.keyCode == 8 && !query) {
			dispatch(removeLast());
		}
		if (e.keyCode == 38 && selectedSuggestionIndex > 0) {
			e.preventDefault();
			dispatch(selectSuggestion(selectedSuggestionIndex - 1));
		}
		if (e.keyCode == 40 && selectedSuggestionIndex < suggestedItems.length - 1) {
			e.preventDefault();
			dispatch(selectSuggestion(selectedSuggestionIndex + 1));
		}
		if (e.keyCode == 13 && selectedSuggestionIndex != null) {
			dispatch(add(suggestedItems[selectedSuggestionIndex]));
		}
	}
}

function queryReducer() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	var action = arguments[1];

	switch (action.type) {
		case 'MULTISELECT_SUGGESTION_STARTED':
			return action.query;
		default:
			return state;
	}
}

function selectedItemsReducer() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	var action = arguments[1];

	switch (action.type) {
		case 'MULTISELECT_ADD':
			return state.some(function (it) {
				return it.id == action.item.id;
			}) ? state : [].concat(_toConsumableArray(state), [action.item]);
		case 'MULTISELECT_REMOVE':
			return state.filter(function (it) {
				return it.id != action.item.id;
			});
		case 'MULTISELECT_REMOVE_LAST':
			return state.length > 0 ? state.slice(0, -1) : state;
		default:
			return state;
	}
}

function suggestedItemsReducer() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	var action = arguments[1];

	switch (action.type) {
		case 'MULTISELECT_SUGGESTION_STARTED':
			return null;
		case 'MULTISELECT_SUGGESTION_SUCCEEDED':
			return action.items;
		case 'MULTISELECT_SUGGESTION_FAILED':
		case 'MULTISELECT_SUGGESTION_ABORTED':
			return null;
		case 'MULTISELECT_FINISH_SUGGESTION':
			return null;
		default:
			return state;
	}
}

function selectedSuggestionIndexReducer() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	var action = arguments[1];

	switch (action.type) {
		case 'MULTISELECT_SUGGESTION_STARTED':
			return null;
		case 'MULTISELECT_SUGGESTION_SUCCEEDED':
			return 0;
		case 'MULTISELECT_SUGGESTION_FAILED':
		case 'MULTISELECT_SUGGESTION_ABORTED':
			return null;
		case 'MULTISELECT_SELECT_SUGGESTION':
			return action.index;
		case 'MULTISELECT_FINISH_SUGGESTION':
			return null;
		default:
			return state;
	}
}

function add(item) {
	return { type: 'MULTISELECT_ADD', item: item };
}

function remove(item) {
	return { type: 'MULTISELECT_REMOVE', item: item };
}

function removeLast() {
	return { type: 'MULTISELECT_REMOVE_LAST' };
}

function suggest(resource, query) {
	return function (dispatch) {
		return dispatch({
			type: 'MULTISELECT_SUGGESTION_STARTED',
			query: query,
			request: resource(query).then(function (r) {
				return r.statusCode < 400 ? dispatch({ type: 'MULTISELECT_SUGGESTION_SUCCEEDED', items: r.body }) : dispatch({ type: 'MULTISELECT_SUGGESTION_FAILED', reason: r.body || r.statusCode });
			}).catch(function (error) {
				return dispatch({ type: 'MULTISELECT_SUGGESTION_ABORTED', reason: error });
			})
		});
	};
}

function selectSuggestion(index) {
	return { type: 'MULTISELECT_SELECT_SUGGESTION', index: index };
}

function finishSuggestion() {
	return { type: 'MULTISELECT_FINISH_SUGGESTION' };
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = TextInput;

__webpack_require__(20);

var createVNode = Inferno.createVNode;
function TextInput(_ref) {
	var label = _ref.label,
	    value = _ref.value,
	    error = _ref.error,
	    sensitive = _ref.sensitive,
	    _onChange = _ref.onChange,
	    preventAutocomplete = _ref.preventAutocomplete;

	return createVNode(2, "label", null, [createVNode(2, "span", null, label), preventAutocomplete ? createVNode(512, "input", {
		"type": "text",
		"style": "display:none;"
	}) : null, preventAutocomplete ? createVNode(512, "input", {
		"type": "password",
		"style": "display:none;"
	}) : null, createVNode(512, "input", {
		"type": sensitive ? 'password' : 'text',
		"defaultValue": value
	}, null, {
		"onChange": function onChange(e) {
			return _onChange(e.target.value);
		}
	}), error ? createVNode(2, "span", {
		"className": "validation-error"
	}, error) : null]);
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(14);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(3)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/lib/loader.js!./generic.scss", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/lib/loader.js!./generic.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var Same = __webpack_require__(1);

var _require = __webpack_require__(4),
    resetQuery = _require.resetQuery,
    loadItems = _require.loadItems;

module.exports = List;

var createVNode = Inferno.createVNode;
function List(props) {
	var resource = props.resource,
	    defaultQuery = props.defaultQuery,
	    query = props.query,
	    _props$Query = props.Query,
	    Query = _props$Query === undefined ? NoQuery : _props$Query,
	    Table = props.Table,
	    _props$Toolbar = props.Toolbar,
	    Toolbar = _props$Toolbar === undefined ? NoToolbar : _props$Toolbar,
	    _props$Loading = props.Loading,
	    Loading = _props$Loading === undefined ? DefaultLoading : _props$Loading,
	    _props$LoadingError = props.LoadingError,
	    LoadingError = _props$LoadingError === undefined ? DefaultLoadingError : _props$LoadingError,
	    _props$Empty = props.Empty,
	    Empty = _props$Empty === undefined ? DefaultEmpty : _props$Empty,
	    dispatch = props.dispatch;


	if (!Table) {
		throw new Error('Table is required.');
	}

	if (isNotInitialized(props)) {
		dispatch(resetQuery(defaultQuery));
		return createVNode(16, Same, _extends({}, props));
	}

	if (isNotLoaded(props)) {
		dispatch(loadItems(resource, query));
		return createVNode(16, Same, _extends({}, props));
	}

	if (isLoading(props)) {
		return createVNode(16, Loading, _extends({}, props));
	}

	if (isEmpty(props)) {
		return createVNode(16, Empty, _extends({}, props));
	}

	if (isLoadingFailed(props)) {
		return createVNode(16, LoadingError, _extends({}, props));
	}

	return createVNode(2, 'div', null, [Query(props), Toolbar(props), Table(props)]);
}

function isNotInitialized(_ref) {
	var query = _ref.query;

	return !query;
}

function isNotLoaded(_ref2) {
	var items = _ref2.items,
	    request = _ref2.request,
	    error = _ref2.error;

	return !(items || request || error != null);
}

function isLoading(_ref3) {
	var request = _ref3.request;

	return request;
}

function isLoadingFailed(_ref4) {
	var error = _ref4.error;

	return error != null;
}

function isEmpty(_ref5) {
	var items = _ref5.items;

	return items != null && items.length == 0;
}

function NoQuery() {}

function NoToolbar() {}

function DefaultEmpty() {
	return createVNode(2, 'p', null, 'No data.');
}

function DefaultLoading() {
	return createVNode(2, 'p', null, 'Loading...');
}

function DefaultLoadingError(_ref6) {
	var error = _ref6.error;

	return error ? createVNode(2, 'p', null, ['Loading error: ', error.message]) : createVNode(2, 'p', null, 'Loading error');
}

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = __webpack_require__(0),
    combineReducers = _require.combineReducers;

var defaultQuery = { filtering: {}, grouping: {}, sorting: {}, paging: {} };

module.exports = combineReducers({
	query: query,
	items: items,
	request: request,
	error: error
});

function query() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultQuery;
	var action = arguments[1];

	switch (action.type) {
		case 'LIST_SET_QUERY':
			return action.query ? _extends({}, defaultQuery, action.query) : defaultQuery;
		case 'LIST_SET_FILTER':
			return _extends({}, state, { filtering: _extends({}, state.filtering, _defineProperty({}, action.field, action.value)) });
		case 'LIST_SET_GROUPING':
			return _extends({}, state, { grouping: { field: action.field } });
		case 'LIST_SET_SORTING':
			return _extends({}, state, { sorting: { field: action.field, direction: action.direction } });
		case 'LIST_SET_PAGE':
			return _extends({}, state, { paging: _extends({}, state.paging, { index: action.index }) });
		case 'LIST_SET_PAGE_SIZE':
			return _extends({}, state, { paging: _extends({}, state.paging, { size: action.size }) });
		default:
			return state;
	}
}

function items() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	var action = arguments[1];

	switch (action.type) {
		case 'LIST_SET_QUERY':
		case 'LIST_INVALIDATE':
			return null;
		case 'LIST_SET_FILTER':
		case 'LIST_SET_GROUPING':
		case 'LIST_SET_SORTING':
			return action.invalidate ? null : state;
		case 'LIST_LOADING_STARTED':
			return null;
		case 'LIST_LOADING_SUCCEEDED':
			return action.result;
		case 'LIST_LOADING_FAILED':
		case 'LIST_LOADING_FORBIDDEN':
			return null;
		default:
			return state;
	}
}

function request() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	var action = arguments[1];

	switch (action.type) {
		case 'LIST_LOADING_STARTED':
			return action.request;
		case 'LIST_LOADING_SUCCEEDED':
		case 'LIST_LOADING_FAILED':
		case 'LIST_LOADING_FORBIDDEN':
			return null;
		default:
			return state;
	}
}

function error() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	var action = arguments[1];

	switch (action.type) {
		case 'LIST_LOADING_STARTED':
		case 'LIST_LOADING_SUCCEEDED':
			return null;
		case 'LIST_LOADING_FAILED':
			return action.error;
		default:
			return state;
	}
}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(0),
    navigateTo = _require.navigateTo;

var Same = __webpack_require__(1);

__webpack_require__(18);

module.exports = Menu;

var createVNode = Inferno.createVNode;
function Menu(_ref) {
	var route = _ref.route,
	    items = _ref.items,
	    dispatch = _ref.dispatch;

	if (!route) {
		return createVNode(16, Same);
	}
	return createVNode(2, 'div', {
		'className': 'menu'
	}, items.map(function (it) {
		return createVNode(2, 'a', {
			'href': it.url,
			'className': route.url.includes(it.url) ? 'active' : null
		}, it.title, {
			'onClick': function onClick(e) {
				return handleClick(e, it.url);
			}
		});
	}));
	function handleClick(e, url) {
		e.preventDefault();
		dispatch(navigateTo(url));
	}
}

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)();
// imports


// module
exports.push([module.i, "html, body, #root {\n  height: 100%;\n  padding: 0;\n  margin: 0; }\n\n.validation-error {\n  color: darkred; }\n\nh2 {\n  margin: 0; }\n\np {\n  margin: 0; }\n\ntable {\n  border-collapse: collapse; }\n\nthead tr {\n  border-bottom: 1px solid gray; }\n\ntd {\n  padding: 2px 4px; }\n", ""]);

// exports


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)();
// imports


// module
exports.push([module.i, ".menu a {\n  text-decoration: none;\n  border-bottom: 1px solid black;\n  padding: 4px; }\n  .menu a:hover, .menu a:visited:hover, .menu a.active, .menu a.active:visited {\n    background: black;\n    color: white; }\n  .menu a, .menu a:visited {\n    color: black;\n    background: white; }\n", ""]);

// exports


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)();
// imports


// module
exports.push([module.i, ".multiselect {\n  margin-bottom: 4px; }\n  .multiselect .input {\n    width: 100%;\n    box-sizing: border-box;\n    display: flex; }\n    .multiselect .input span {\n      flex-shrink: 0;\n      border-bottom: 1px black dotted;\n      margin-right: 4px;\n      cursor: pointer; }\n    .multiselect .input input {\n      width: 100%;\n      box-sizing: border-box; }\n  .multiselect .suggestion span {\n    padding-right: 4px;\n    cursor: pointer; }\n  .multiselect .suggestion .selected {\n    background-color: black;\n    color: white; }\n", ""]);

// exports


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(2)();
// imports


// module
exports.push([module.i, "label span, label input {\n  box-sizing: border-box;\n  display: inline-block;\n  width: 100%; }\n", ""]);

// exports


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(15);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(3)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./style.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./style.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(16);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(3)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./style.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./style.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(17);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(3)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./style.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./style.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("inferno");

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(10);

module.exports = {
	List: __webpack_require__(6),
	Edit: __webpack_require__(5),
	Multiselect: __webpack_require__(8),
	Menu: __webpack_require__(7),
	Same: __webpack_require__(1),
	TextInput: __webpack_require__(9)
};

/***/ })
/******/ ]);