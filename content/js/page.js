
/** 
 * configurar requisições para a api
 * versio: 0.1
 * Autor: Severino Amorim
 * Email: sevexmaster@gmail.com
 */
const outerVanilha = jQuery,
	/**
	 * extend trim jQuery
	 */
	trim = (text) => {
		return (text || "").replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
	},
	/**
	 * carregamento de ficheiro pela
	 * os ficheiros serão carregados apenas uma unica vez
	 */
	require_once = function (dir = [], callback = null) {

		var x = 0,
			dir = dir,
			auth = () => {

				var doc = document,
					script,
					u;

				/** executar codigo de saida */
				if (!dir[x] && callback)
					return callback();
				/** executar escoupe */
				if ((doc.script || []).indexOf(dir[x]) == -1)
					return (() => {
						u = dir[x];
						script = doc.createElement("SCRIPT");
						script.src = [page.dir, u].join("");
						doc.querySelector("head").appendChild(script);
						script.onload = function (e) {
							/** 
							 * carregar e analizar escoupe dos ficheiros
							 */
							x = x + 1;
							!doc.script ? doc.script = [u] : doc.script.push(u);
							return auth();
						};
					})();
				x = x + 1;
				return auth();
			};

		return auth();
	},
	/**
	 * imprimir file blob
	 */
	globalDropContext = function (response = {}) {
		page.dropDown("#drops", {
			dataValueField: "id",
			dataTextField: "nome",
			icon: 'seve-more-vertical',
			select: function () {
				var dataItem = this.dataItem,
					id = (dataItem || {}).id,
					data = (dataItem.data || {});
				clearTimeout(window.setProgress);
				document.body.classList.remove("stop-load");
				if (id == 1)
					return page.setURL(page.dir + 'secretaria/aluno/inscricao&_=' + data.id);

				if (id == 2)
					return page.setURL(page.dir + 'secretaria/aluno/ficha&_=' + data.id);
			},
			dataSource: [
				{ id: 1, nome: "Editar", data: response },
				{ id: 2, nome: "ficha", data: response },
				{ id: 3, nome: "Imprimir" }
			]
		});
	},
	print = function (
		blob,
		callback = () => { }
	) {
		var doc = document,
			ifr = doc.createElement("IFRAME"),
			t = 0;
		ifr.src = blob;
		ifr.classList.add('ifr');
		doc.querySelectorAll(".ifr").forEach(x => { x.remove() });
		ifr.onerror = () => {
			ifr.remove();
			callback(null);
		};
		ifr.onload = () => {
			/** imprimir documento */
			ifr.contentWindow.focus();
			ifr.contentWindow.print();
			return setTimeout(() => {
				clearInterval(t);
				t = setInterval(() => {
					if (doc.hasFocus())
						return (() => {
							callback({ print: 400, blob: blob });
							clearInterval(t);
						})();
				});
			}, 5e3);
		};
		document.body.append(ifr);
	},

	/**
	 * converter url de imagens em object Image
	 */
	srcToBase64 = function (src, maxW, maxH, callback, options) {
		var canvas = document.createElement('CANVAS');
		var ctx = canvas.getContext("2d");
		img = document.createElement('img'),
			img.src = src;
		img.onerror = function () {
			callback(null);
		};
		img.onload = function () {

			var oWidth = this.width
				, oHeight = this.height
				// coordenadas origem (source)
				, sx = 0
				, sy = 0
				, sWidth = oWidth
				, sHeight = oHeight
				// tamanho destino
				, dWidth = maxW
				, dHeight = maxH
				// tamanho ideal
				, iWidth = Math.round(sHeight / dHeight * dWidth)
				, iHeight = Math.round(sWidth / dWidth * dHeight);
			if (sWidth > iWidth) { // cortar na larguraa
				sx = parseInt((sWidth - iWidth) / 2);
				sWidth = iWidth;
			} else if (sHeight > iHeight) { // cortar na altura
				sy = parseInt((sHeight - iHeight) / 2);
				sHeight = iHeight;
			}
			canvas.width = dWidth;
			canvas.height = dHeight;
			if (options)
				ctx.globalAlpha = 0.08;
			ctx.drawImage(this, sx, sy, sWidth, sHeight, 0, 0, dWidth, dHeight);
			var dataURL = canvas.toDataURL('image/png');
			callback.call({ canvas: canvas, ctx: ctx }, dataURL);
			canvas = null;
		};
	},
	openPage = function (event, callback) {
		if (document.resize)
			delete document.resize;
		return page.post(
			page.dir + "sys/sistema/page",
			{
				link: event.state.url.replace(page.dir, "").split(/[&]/g)[0]
			},
			"text"
		).then(response => {
			outerVanilha((event.state || {}).seletor || ".cont-center")
				.html(response).promise()
				.done(function () {
					/** verificar sé o menu mobile esta aberto */
					if (document.querySelector(".focusMensusmobile"))
						document.querySelector(".cont-left").classList.remove('focusMensusmobile');
					if (!(event.state || {}).seletor)
						page.EmptyDropList();
					clickHancor(outerVanilha(".cont-center").get(0));
					if (callback)
						return callback();
				});
		});
	},
	clickHancor = function (element) {

		var page = window.page;
		var setHancor = function (event) {

			// registrar historico caso haja uma ancora
			event.preventDefault();

			var href = this.getAttribute("href");
			if (page.ClickPedding)
				return true;

			/** block preogress dblClick */
			page.ClickPedding = true;

			page.delay(function () {
				page.ClickPedding = false;
			}, 5e2);


			clearTimeout(window.setProgress);
			window.setProgress = setTimeout(function () {
				document.body.classList.remove("stop-load");
			}, 5e2);

			document.location.href = href;

			/*history.pushState({
				url: href
			},
				"Escola",
				href
			);

			return openPage({ state: { url: href }, element: this });*/
		};

		element.querySelectorAll("[href]")
			.forEach(el => {
				if (!el.hancor) {
					el.hancor = true;
					el.addEventListener("click", setHancor);
				}
			});
	};

/** seletor */
var selector = function (selector) {
	var name = selector, selector = (
		typeof selector == "string" ?
			document.querySelectorAll(selector) :
			selector
	);
	if (!selector || !selector.length)
		return {
			forEach: (callback) => {
				throw (name + " não é um selector de Objecto");
			}
		};
	return typeof selector.forEach == "function" ? selector : {
		forEach: function (callback) {
			return callback(selector, 0);
		}
	};
};


async function logout() {
}

function dataChart() {
	return page.proto(
		{
			type1: function (b) {
				return this.execute("sys/rest/ChartType1", b || {});
			}
		}
	);
}


(doc => {

	// autocomplite
	/**
	 * dataValueField:"" ,dataTextField:"",
	 */

	function elementDom(response) {
		/**
		 * enviar data para o templat
		 */
		var elm = this,
			offest = { left: 0, top: 0 },
			dualRing = ((elm.parentElement.querySelector(".lds-dual-ring") || {}).style || {}),
			template = ((elm.argumento || {}).post || {}).template;
		if (template)
			return (() => {
				dualRing.display = "none";
				return template.call({ element: elm, data: response, arg: elm.argumento }, response);
			})();

		var parent = elm.parentElement,
			removerClick = function (event) {
				var elem = document.activeElement;
				if (!elem.selects) {
					document.querySelectorAll(".droplist")
						.forEach(el => {
							el.style.display = "none";
						});
					outerVanilha(document.body).unbind('click');
				}
			},
			that = this.closest(".page-droplist").querySelector("[page-value]"),
			fixStop = false,
			doc = document,
			bod = doc.body,
			el = doc.querySelector([".", (that.id || that.name), "_droplist"].join(""));
		if (!el) {
			el = doc.createElement("div");
			el.classList.add((that.id || that.name) + "_droplist");
			el.classList.add("droplist");
			bod.appendChild(el);
		}


		if (!response.length)
			return true;

		var ul = doc.createElement("ul");
		el.innerHTML = "";
		el.appendChild(ul);

		/** aplicar style na dropList */
		if ((this.argumento || {}).css) {
			for (var css in this.argumento.css) {
				el.style[css] = this.argumento.css[css];
			}
		}


		if (this === doc.activeElement) {
			el.style.display = "block";
			doc.querySelectorAll(".droplist")
				.forEach(els => {
					if (els !== el)
						els.style.display = "none";
				});
		}


		response.find((arr, i) => {
			var li = doc.createElement("li");
			li.innerHTML = arr.value;
			li.dataItem = arr;

			if (that.setCondFocusIndex)
				fixStop = true;

			if (that.setFocusIndex == i) {
				li.thiss = true;
				li.classList.add("drop-focus");
				delete that.setFocusIndex;
				delete that.setCondFocusIndex;
			}

			if (!fixStop) {
				if (el.valueFocus == arr.value) {
					li.thiss = true;
					li.classList.add("drop-focus");
				} else if (i == 0 && !el.valueFocus) {
					li.thiss = true;
					li.classList.add("drop-focus");
				}
			}

			li.addEventListener("mouseenter", function (e) {
				var select = this;
				select.onnmouseenter = true;
				if (elm.argumento.hover)
					elm.argumento.hover.call({
						element: this,
						input: elm,
						dataItem: this.dataItem.dataItem,
						popup: function (arg_) {
							page.delay(function () {
								if (select.onnmouseenter)
									return (() => {
										var outer = outerVanilha(select),
											div = document.createElement("div"),
											div1 = document.createElement("div");
										div1.classList.add("outo-popup");
										div.classList.add("lds-dual-ring");
										select.classList.add("lds-dual-ring-padding");
										select.append(div);
										select.append(div1);
										div1.loadding = div;
										arg_.execute.call(div1);
									})();
							}, 15e2);
						}
					}, this.dataItem);
			});

			li.addEventListener("mouseleave", function (e) {
				var select = this,
					dual = select.querySelector(".lds-dual-ring"),
					pop = select.querySelector(".outo-popup");
				if (dual)
					dual.remove();
				if (pop)
					pop.remove();

				select.classList.remove("lds-dual-ring-padding");
				delete select.onnmouseenter;
			});

			li.addEventListener("click", function () {
				var sel = elm.querySelector(".page-i-label"),
					value = (Item => {
						el.valueFocus = Item.value;
						elm.closest(".page-droplist").querySelector("[page-value]")
							.value = Item.dataItem[elm.argumento.dataValueField];
						return Item.value;
					})(this.dataItem);

				if (elm.argumento.select)
					elm.argumento.select.call({ element: elm, dataItem: this.dataItem.dataItem });

				if (elm.tagName == "INPUT") {
					elm.value = value;
					return value;
				}

				sel.innerHTML = value;
			});
			ul.appendChild(li);
		});

		offest.left = ((w) => {
			/** verificar sé a dropdown excede a posição do left */
			if ((w + el.clientWidth) > window.innerWidth)
				return (window.innerWidth - el.clientWidth) - 20;
			return w;
		})(outerVanilha(parent).offset().left);

		el.style.top = [
			(outerVanilha(parent).offset().top + parent.offsetHeight + 2), "px"
		].join("");

		el.style.left = [
			offest.left, "px"
		].join("");

		outerVanilha(bod).unbind('click');
		outerVanilha(bod).bind('click', removerClick);

		dualRing.display = "none";
	}

	function finter(searsh, data) {
		var response = new Array();
		data.find(ar => {
			var line = { value: "" }, name = "", arr = (
				this.dataTextField || "nome"
			).split(/[,]/g);

			for (var oj in arr) {
				name = name + (arr.length > 1 ? oj == 0 ? "" : " " : "") + ar[arr[oj]];
				if (searsh.tagName === "INPUT") {
					var filterGoole = searsh.value.toLowerCase().split(/[\s]/g),
						Goole = (searsh.argumento || { post: {} }).post.filterGoogle;
					if (Goole) {
						filterGoole.find(go => {
							if (page.trim(go) !== "") {
								if (ar[arr[oj]].toLowerCase().indexOf(go) > -1) {
									if (line.value == "")
										line.dataItem = ar;
									line.value += (line.value == name ? "" : name);
								}
							}
						});
					} else {
						if (page.trim(searsh.value.toLowerCase()) !== "") {
							if (ar[arr[oj]].toLowerCase().indexOf(searsh.value.toLowerCase()) > -1) {
								if (line.value == "")
									line.dataItem = ar;
								line.value += (line.value == name ? "" : name);
							}
						}
					}
				} else {
					if (line.value == "")
						line.dataItem = ar;
					line.value += (line.value == name ? "" : name);
				}
			}

			if (line.dataItem)
				response.push(line);
		});

		return elementDom.call(searsh, response);
	}

	function dropDown(selector, con) {
		if (con.post)
			con.post.cache = true;
		return dropList(selector, con, false);
	}

	function autocomplite(selector, con) {
		return dropList(selector, con, true);
	}

	function dropList(selector, con, ui) {
		var doc = document,
			args = con,
			ui = ui,
			onj = doc.querySelectorAll("body"),
			selector = (typeof selector == "string" ? doc.querySelectorAll(selector) : ((selector, nod) => {
				return Object.setPrototypeOf([selector], Object.getPrototypeOf(nod));
			})(selector, onj));

		return selector.forEach((ele) => {
			var clone = ele.cloneNode(true),
				dom = doc.createElement("DIV"),
				arrHtml = (ui ? [
					'<div class="page-input">',
					'<input type="text" />',
					'<div class="lds-dual-ring"></div>',
					'</div>'
				] : [
					'<div class="page-input">',
					'<button class="btn dropdown">',
					'<span class="page-i-label">', (args.label || 'Escolher'), '</span>',
					'<span class="', (args.icon || 'seve-chevron-down'), '"></span>',
					'</button>',
					'</div>'
				]).join("");
			dom.classList.add("page-droplist");
			dom.innerHTML = arrHtml;

			clone.type = "hidden";
			clone.setAttribute("page-value", "on");

			/**
			 * pegar o atributo placeholder
			 */
			if (dom.querySelector(".page-input > input")) {
				if (clone.getAttribute("placeholder")) {
					dom.querySelector(".page-input > input").setAttribute("placeholder", clone.getAttribute("placeholder"));
				}
			}

			clone._data = {
				init: { element: clone, arguments: args },
				prop: function (attr, value) {
					var drop = clone.closest(".page-droplist");
					if (drop.querySelector(".page-i-label")) {
						drop.querySelector(".page-input button")
							.setAttribute(attr, value);
					} else {
						drop.querySelector("input").setAttribute(attr, value);
					}
					drop.querySelector("[page-value]").setAttribute(attr, value);
				},
				value: function (value) {
					var el = page.data(clone),
						dt = el.dataSource.data(),
						input,
						normal = true;
					if (value) {
						dt.find((x, index) => {
							if (x[args.dataValueField] == value) {
								clone.value = value;
								input = clone.closest(".page-droplist");
								if (input.querySelector(".page-i-label")) {
									input.querySelector(".page-i-label").innerHTML = x[args.dataTextField];
									clone.setFocusIndex = index;
									clone.setCondFocusIndex = true;
								} else {
									input.querySelector("input").value = x[args.dataTextField];
								}
								normal = false;
							}
						});

						if (normal) {
							input = clone.closest(".page-droplist");
							if (input.querySelector(".page-input input")) {
								input.querySelector(".page-input input").value = value;
								clone.value = value;
							}
						}
					}
				},
				dataSource: {
					data: function (e) {
						return !e ? this._data : ((e, t) => {
							t._data = typeof e.length == "undefined" ? new Array(e) : e;
							return t._data;
						})(e, this);
					},
					_data: new Array()
				}
			};

			dom.appendChild(clone);

			ele.parentElement.appendChild(dom);
			function finterr(args, that, dom, page, eVen) {
				that.argumento = args;
				if (!(args.post || {}).cache && eVen.type == "keyup") {
					var filter = args.post.data;
					if (args.post.filterGoogle)
						(() => {
							var arr = that.value.split(/[\s]/g);
							filter = {};
							arr.find((x, i) => {
								filter[i] = x;
							});

							filter.value = that.value;
						})();
					return page.post(
						[page.dir, args.post.url].join(""),
						filter
					).then(resonse => {
						var resonse = page.refactorObject(resonse);
						page.data(dom.closest(".page-droplist").querySelector("[page-value]"))
							.dataSource.data(resonse);
						return finter.call(
							args,
							that,
							resonse
						);
					});
				}

				return finter.call(
					args,
					that,
					page.data(dom.closest(".page-droplist").querySelector("[page-value]"))
						.dataSource.data()
				);
			}

			/** eventos key autocomplite */
			function keydowm(event) {
				var keyCode = event.keyCode || event.key,
					clone = this.closest(".page-droplist").querySelector("[page-value]"),
					dropl = "." + (clone.id || clone.name) + "_droplist",
					a = document.querySelector(dropl);

				if ([9, 16, 27, 'Tab', 'Shift'].indexOf(keyCode) > -1) {
					return document.querySelectorAll(".droplist")
						.forEach(el => {
							el.style.display = "none";
						});
				} else if ([40, 38, 'ArrowDown', 'ArrowUp'].indexOf(keyCode) > -1) {
					event.preventDefault();
					var up = ([38, 'ArrowUp'].indexOf(keyCode) > -1 ? true : false);
					if (a) {
						var li = a.querySelectorAll("ul > li"),
							FocusEven = function (i, up) {
								delete li[i].thiss;
								li[(up ? i - 1 : i + 1)].thiss = true;
								li[i].classList.remove("drop-focus");
								li[(up ? i - 1 : i + 1)].classList.add("drop-focus");
							};


						for (
							var i = (up ? li.length - 1 : 0);
							(up ? i > 0 : i < li.length);
							(up ? (i--) : (i++))
						) {
							if (li[(up ? i - 1 : i + 1)]) {
								if (li[i].thiss) {
									FocusEven(i, up);
									break;
								}
							} else {
								delete li[i].thiss;
								li[0].thiss = true;
								li[i].classList.remove("drop-focus");
								li[0].classList.add("drop-focus");
							}
						}
					}
				} else if ([13].indexOf(keyCode) > -1) {
					event.preventDefault();
					if (a) {
						if (a.style.display !== "none") {
							var li = a.querySelectorAll("ul > li");
							return li.forEach(el => {
								if (el.thiss) {
									el.click();
									return document.querySelectorAll(".droplist")
										.forEach(el => {
											el.style.display = "none";
										});
								}
							});
						}

						a.style.display = "block";
					}
				}
			}
			if (ui === true) {
				var inpt = dom.querySelector(".page-input input");
				inpt.addEventListener("keyup", function (e) {
					if ([40, 38, 39, 37, 9, 16, 13, 'Tab', 'Shift', 'ArrowDown', 'ArrowUp'].indexOf(e.keyCode || e.key) > -1) {
						return e.preventDefault();
					}

					var that = this;
					page.delay(function () {
						var load = dom.querySelector(".lds-dual-ring");
						if (load)
							load.style.display = "inline-block";
						if (that.value == "")
							return (() => {
								load.style.display = "none";
								document.querySelectorAll(".droplist")
									.forEach(el => {
										el.style.display = "none";
									});
								clone.value = "";
								if ((args.post || { template: () => { } }).template)
									return (args.post || { template: () => { } }).template.call({ element: that, data: [], arg: args }, null);
							})();

						return finterr(args, that, dom, page, e);
					}, 5e2);
				});

				inpt.addEventListener("focus", function (e) {
					//window.scrollTo(0,this.offsetTop-this.offsetHeight);
					if (this.value.length < 1)
						return document.querySelectorAll(".droplist")
							.forEach(el => {
								el.style.display = "none";
							});
					//return finterr(args, this, dom, page, e);
				});
				inpt.addEventListener("keydown", keydowm);
			} else {
				var select = dom.querySelector(".page-input button");
				select.selects = true;
				select.addEventListener("click", function (e) {
					if (document.activeElement == this && this.selects) {
						//window.scrollTo(0,this.offsetTop-this.offsetHeight);
						e.preventDefault();
						var dropl = "." + (clone.id || clone.name) + "_droplist",
							a = document.querySelector(dropl);
						if (a) {
							if (a.style.display != "none") {
								a.style.display = "none";
								return a;
							}
						}
						return finterr(args, this, dom, page, e);
					}
				});
				select.addEventListener("keydown", keydowm);
			}

			ele.remove();

			if ((args.post || {}).fetch)
				return page.post(
					[page.dir, args.post.url].join(""),
					args.post.data
				).then(resonse => {
					var resonse = page.refactorObject(resonse);
					return (args.post || {}).fetch.call({
						init: args,
						data: (resonse) => {
							page.data(clone)
								.dataSource.data(resonse);
						}
					}, resonse);
				});

			if (args.dataSource)
				return page.data(clone)
					.dataSource.data(args.dataSource);
		});
	}

	function grid(selector, args) {
		var selector = page.selector(selector),
			args = args || {},
			Aprototype = {
				element: selector,
				dataSource: {
					data: function (response) {
						return !response ? this._data : (
							(t) => {
								t._data = response;
								return t._data;
							}
						)(this);
					},
					_data: new Array()
				}
			},
			prottipy = Object.create({
				addRow: function () {
					return this.element.forEach(z => z.addRow());
				},
				saveRow: function () {
					return this.element.forEach(z => z.saveRow());
				},
				closeRow: function () {
					return this.element.forEach(z => z.closeRow());
				},
				editRow: function (tr) {
					return this.element.forEach(z => z.editRow(tr));
				},
				deleteRow: function (tr) {
					return this.element.forEach(z => z.deleteRow(tr));
				},
			});

		selector.forEach(ele => {

			var doc = document,
				regext = "input:not([type=hidden]):nth-child(1), button, select",
				append = str => { return doc.createElement(str); },
				grid = append("div"),
				focus = (element) => {
					return element.focus();
				},
				navegarRows = (tr, args) => {
					instanceFocuss(tr, args);
					tr.querySelectorAll("td").forEach((el, inx) => {

						/** renderizar grids */
						if (!header.AprototypeWith) {
							var th = header.querySelectorAll("th")[inx],
								pxs = Math.round(parseFloat(outerVanilha(th).css("width").replace("px", "")));

							if (!el.args.hidden) {
								el.style = "min-width:" + pxs + "px;max-width:" + pxs + "px;";
								th.style = "min-width:" + pxs + "px;max-width:" + pxs + "px;";
							}
						}

						var selector = regext,
							isValidateFocus = (td, tbo, _that, tr, n) => {
								if (td) {
									if (td.querySelector(selector))
										return focus(td.querySelector(selector));
								}

								if (n == 1 && tr.nextSibling)
									return (
										saveRow(),
										editRow(tr.nextSibling, { type: 1 })
									);

								if (n == 1 && !tr.nextSibling)
									return (
										saveRow(),
										addRow()
									);

								if (n == 0 && tr.previousSibling)
									return (
										saveRow(),
										editRow(tr.previousSibling, { type: 0 })
									);

							},
							movecell = (t, n) => {
								var tr = t.closest("tr"),
									_that = t.closest("td"),
									tdAll = tr.querySelectorAll("td"),
									tbody = tr.closest("tbody"),
									colunm = 0;

								for (; colunm < tdAll.length; colunm++) {
									if (_that == tdAll[colunm]) {
										isValidateFocus(tdAll[(n == 1 ? colunm + 1 : colunm - 1)], tbody, _that, tr, n);
										break;
									}
								}

							},
							colunm = el.querySelector(selector);
						if (!colunm) return false;
						el.addEventListener("click", function () {
							if (!this.querySelector(regext)) {
								closeRow();
								editRow(this.closest("tr"), { status: 400, obj: this });
							}
						});

						colunm.addEventListener("keydown", function (e) {
							var t = this;
							if ([9, 13, 16, 27, 46].indexOf(e.keyCode) > -1)
								return (() => {
									e.preventDefault();
									if (e.keyCode == 9 && e.shiftKey)
										return movecell(t, 0);
									if (e.keyCode == 9 || e.keyCode == 13)
										return movecell(t, 1);
									if (e.keyCode == 27)
										return closeRow();
									if (e.keyCode == 46)
										return deleteRow(t.closest("tr"));
								})();
						});

					});

					if (!header.AprototypeWith) {
						header.AprototypeWith = true;
					}
				},
				instanceFocuss = function (tr, arg) {
					var td = tr.querySelectorAll("td:not([style^=display]):not([readonly])"),
						count = 0,
						filds,
						ty = (arg || {}).type;
					tys = (arg || {});

					if (tys.status == 400) {
						if (tys.obj.querySelector(regext)) {
							focus(tys.obj.querySelector(regext));
							return true;
						}
					}

					if (arg) {
						count = ty == 1 ? 0 : (td.length - 1);

						for (; ty == 1 ? (count < td.length) : count > 0; ty == 1 ? (count++) : count--) {
							filds = td[count].querySelector(regext);
							if (filds) {
								focus(filds);
								break;
							}
						}

						return true;
					}

					for (; count < td.length; count++) {
						filds = td[count].querySelector(regext);
						if (filds) {
							focus(filds);
							break;
						}
					}
				},
				editableRow = (td, col, edit, trResolve) => {
					var tr = td.closest("tr"),
						input = append("INPUT");
					td.innerHTML = "";
					td.setAttribute("data-container-for", col.field || "notfildname");
					td["data-container-for"] = col.field;
					input.name = col.field;
					input.setAttribute("id", col.field);
					td.appendChild(input);

					if (col.readonly == true)
						(() => {
							td.setAttribute("readonly", true);
							input.setAttribute("readonly", true);
						})();

					if (col.hidden == true)
						(() => {
							td.style.display = "none";
							input.type = "hidden";
						})();

					if (col.editor)
						col.editor.call(td, input, { indexLine: (tr || trResolve).lineID });

					if (edit)
						(() => {
							if (td.querySelector("[page-value]"))
								return page.data(td.querySelector("[page-value]")).value(tr.dataItem[col.field]);
							input.value = tr.dataItem[col.field];
						})();

				},
				editRow = (tr, args) => {
					if (!tr.dataItem)
						saveRow();
					tr.querySelectorAll("td")
						.forEach(td => editableRow(td, td.args, true));
					return navegarRows(tr, args);
				},
				closeRow = () => {
					var input = body.querySelector("input"), tr;
					if (!input)
						return false
					tr = input.closest("tr");

					if (tr.instanceFocus)
						delete tr.instanceFocus;

					if (!tr.dataItem)
						return saveRow();
					tr.querySelectorAll("td")
						.forEach(td => td.innerHTML = '<span class="input">' + tr.dataItem[td.args.field] + '</span>');
				},
				deleteRow = (tr) => {
					if (tr.dataItem)
						return (
							Aprototype.dataSource._data.splice(Aprototype.dataSource._data.indexOf(tr.dataItem), 1),
							tr.remove()
						);
					return tr.remove();
				},
				saveRow = () => {

					var input = body.querySelector("input");
					return input ? (() => {

						var model = {},
							error = new Array(),
							appen = false,
							dataSource = prottipy.dataSource,
							tr = input.closest("tr");
						model.uid = tr.getAttribute("uid");

						if (tr.instanceFocus)
							delete tr.instanceFocus;

						tr.querySelectorAll("td")
							.forEach(td => {
								var text, fild, eleDrop;
								text = td.querySelector("input:nth-child(1)");
								fild = td.getAttribute("data-container-for");

								/** remover as drop list vinculadas */
								eleDrop = document.querySelector([".", fild, "_droplist"].join(""));
								if (eleDrop)
									eleDrop.remove();

								if (args.rules) {
									if (args.rules[fild] === false) {
										error.push(fild);
									}
								}

								model[fild] = text.value;

							});

						if (error.length > 0)
							return (() => {
								console.log(error);
							})();

						tr.dataItem = model;

						/** validation dataSource in positon line */
						dataSource.data().find((x, i) => {
							if (x.uid == model.uid)
								appen = { p: i };
						});

						if (appen)
							dataSource._data[appen.p] = model;

						if (!appen)
							dataSource._data = dataSource._data.concat(model);

						return prottipy.closeRow();

					})() : true;
				},
				addRow = () => {
					var tr = append("TR");
					tr.lineID = prottipy.dataSource._data.length + 1;
					args.columns.find(col => {
						var td = append("TD");
						td.args = col;
						editableRow(td, col, false, tr);
						tr.appendChild(td);
					});
					tr.setAttribute("uid", ("uid-" + Math.random()).replace(/[.]/g, "-"));
					body.append(tr);
					return navegarRows(tr);
				},
				px = new Array(),
				header,
				body,
				footer;

			grid.setAttribute("data-role", "grid");

			// grid estrutura
			grid.innerHTML = [
				'<div class="grid-header">',
				'<table><thead><tr></tr></thead></table>',
				'</div>',
				'<div class="grid-body">',
				'<table><tbody></tbody></table>',
				'</div>'
			].join("");

			header = grid.querySelector(".grid-header table > thead tr");
			body = grid.querySelector(".grid-body table > tbody");

			// create colunm
			args.columns.find(col => {
				var th = append("TH");
				th.innerHTML = col.title || "";
				if (col.width)
					th.style.width = [col.width, "px"].join("");
				if (col.hidden == true)
					(() => {
						th.style.display = "none";
					})();
				header.appendChild(th);
			});

			ele.append(grid);
			/** atribuir */
			ele.addRow = addRow;
			ele.saveRow = saveRow;
			ele.closeRow = closeRow;
			ele.editRow = editRow;
			ele.deleteRow = deleteRow;
		});

		for (i in Aprototype) {
			prottipy[i] = Aprototype[i];
		}

		return prottipy;
	}

	// criar formulario dinamica mente
	function form(selector) {
		var sel = selector, doc = document;
		return page.proto(
			{
				update: function (obj) {
					var selector = doc.querySelectorAll(sel);
					selector.forEach(container => {
						container.querySelectorAll("form").forEach(form => {
							form.argsments = obj;
							form.initValue = {};
							form.forUpdate = true;
							form.querySelectorAll("[name]").forEach(x => {
								form.initValue[x.name] = x.value;
							});
						});
					});
				},
				create: function (obj) {
					return this.execute(function (resolve) {
						/**
						 * https://loja.okapa.ao/Home/Index
						 * argumentes objets: 
						 * controller => function, 
						 * button => [{label,submit}], 
						 * fildes => [{name, type, label, templete, editor}]
						 * 
						 * arguments line:
						 * template: aqui podes retornar uma string com o elemento
						 * editor: aqui podes adicionar uma rotina sobre o elementos
						 * 
						 */
						var filds = obj.filds,
							not = ['label', 'editor', 'templete'],
							o,
							div,
							input,
							label,
							elements = doc.querySelectorAll(sel),
							formsDats = el => {
								var frm = doc.createElement("FORM"),
									post = [],
									piCon = 0;
								// limpar o formulario
								el.innerHTML = "";
								// adicionar elementos
								for (var iput in filds) {
									o = filds[iput];
									// criar div para receber os inputs
									div = doc.createElement("DIV");
									if (o.templete) {
										div.innerHTML = o.templete.call({ element: div, item: o });
										frm.appendChild(div);
									} else {
										label = doc.createElement("LABEL");
										if (o.label) {
											label.innerHTML = o.label
											div.appendChild(label);
										}
										// criar objecto para os inputd
										input = doc.createElement("INPUT");
										for (var r in o) {
											if (not.indexOf(r) == -1) {
												input.setAttribute(r, o[r]);
												if (r == "name" || r == "id")
													/** atribuir classe no parents */
													div.classList.add("filds-" + o[r]);
											}
										}
										// adicionar os inputs
										div.appendChild(input);
										if (o.editor)
											o.editor.call(
												{
													element: div,
													item: o,
													textarea: function (ob, ar) {
														page.editorText(ob, ar);
													},
													autocomplite: function (ob, ar) {
														page.autocomplite(ob, ar);
														if ((ar.post || {}).cache)
															post.push({
																element: div,
																input: ob,
																post: ar
															});
													},
													dropDown: function (ob, ar) {
														page.dropDown(ob, ar);
														post.push({
															element: div,
															input: ob,
															post: ar
														});
													}
												}
											);

										frm.appendChild(div);
									}
								}

								// verificar sé axiste configuração para o botão
								if (obj.button) {
									var footerB = document.createElement("div");
									footerB.classList.add( "fbform" );
									footerB.classList.add( "border-top-lr" );
									frm.appendChild(footerB);
									// adicionar label no botão
									for (var col in obj.button) {
										var button = doc.createElement("BUTTON");
										button.classList.add("btn");

										for (var n in obj.button[col]) {
											if (["label", "submit"].indexOf(n) == - 1)
												button.setAttribute(n, obj.button[col][n]);
										}

										if (obj.button[col].label)
											button.innerHTML = obj.button[col].label;

										if (!obj.button[col].submit)
											button.noSave = true;
										footerB.appendChild(button);
									}

								}

								frm.addEventListener("submit", function (event) {
									event.preventDefault();
									if (!doc.activeElement.noSave)
										return (foorm => {
											var arr = {},
												error = [],
												updateData = false,
												map = () => {
													document.querySelectorAll(".worning-mensage")
														.forEach(xx => {
															xx.remove();
														});
													return foorm.querySelectorAll("input, textarea")
														.forEach(el => {
															if (!el.disabled) {
																var rules = obj.rules[el.name || el.id];
																if (!(rules || function () { return true; }).call(el))
																	error.push({ element: el, mesage: "error..." });
																if (el.type == "hidden" && el.closest(".page-droplist")) {
																	var bt = el.closest(".page-droplist").querySelector("button");
																	if (bt)
																		bt.classList.remove("worning");
																}

																el.classList.remove("worning");
																if (el.name)
																	arr[el.name || el.id] = el.value;
															}
														});
												},
												mapError = () => {
													error.find(x => {
														var element = x.element;
														if (element.type == "hidden") {
															var iput = element.parentNode.querySelector(".page-input");
															element = iput.querySelector("input, button");
														}
														element.classList.add("worning");
														var worning = element.classList.contains("worning");
														if (worning)
															page.worningInput.call(element);
													});
												},
												focusError = () => {
													page.focusElemenNavegar((element => {
														var element = element;
														if (element.type == "hidden") {
															var iput = element.parentNode.querySelector(".page-input");
															element = iput.querySelector("input, button");
														}
														return element;
													})(error[0].element));
												};

											if (frm.forUpdate)
												return (() => {
													map();
													if (!error.length) {
														frm.querySelectorAll("[name]")
															.forEach(x => {
																if (frm.initValue[x.name] != x.value) {
																	if (!updateData)
																		updateData = {};
																	updateData[x.name] = x.value;
																}
															});

														if (updateData) {
															updateData.primarykey = frm.argsments.primarykey;
															clearTimeout(window.setProgress);
															window.setProgress = setTimeout(function () {
																document.body.classList.remove("stop-load");
															}, 5e2);
															return frm.argsments.controller().update(updateData)
																.then(resonse => {
																	if (obj.done) {
																		obj.done.call({ type: "update" }, resonse);
																	}
																	clearTimeout(window.setProgress);
																	document.body.classList.add("stop-load");
																});
														} else {
															page.popup({
																type: "warning",
																html: '<div align="center">Nenhuma alteração, foi feita neste formulario!</div>'
															});
														}
													} else {
														mapError();
														return focusError();
													}
												})();
											map();
											if (!error.length) {
												clearTimeout(window.setProgress);
												window.setProgress = setTimeout(function () {
													document.body.classList.remove("stop-load");
												}, 5e2);
												return obj.controller().set(arr)
													.then(resonse => {
														if (obj.done) {
															obj.done.call({ type: "save" }, resonse);
														}
														clearTimeout(window.setProgress);
														document.body.classList.add("stop-load");
													});
											}
											mapError();
											return focusError();
										})(this);
								}, true);

								el.appendChild(frm);

								// carregar opjects data
								if (post.length) {
									function ping() {
										if (!post[piCon])
											return resolve(obj);
										if (post[piCon].post) {
											page.post(
												[page.dir,
												((post[piCon].post || { post: {} }).post.url || "")
												].join(""),
												(post[piCon].post || { post: {} }).post.data || {}
											).then(resonse => {
												var resonse = page.refactorObject(resonse);
												page.data(
													post[piCon]
														.element
														.querySelector("[page-value]")
												).dataSource.data(resonse);

												piCon++;
												return ping();
											});
										}
									}
									ping();
								} else {
									setTimeout(function () {
										resolve(obj);
									}, 2e1);
								}
							};

						elements.forEach(formsDats);
					});
				}
			}
		);
	}

	function shellExcel(seletor, response, ar, init) {
		var ar = ar || {}, seletor = (seletor => {
			return typeof seletor == "string" ? document.querySelector(seletor) : seletor;
		})(seletor), matriz = {},
			divT = document.createElement("div"),
			table = document.createElement("table"),
			table1 = document.createElement("table"),
			thead = document.createElement("thead"),
			thead1 = document.createElement("thead"),
			tr = document.createElement("tr"),
			tr2 = document.createElement("tr"),
			tbody = document.createElement("tbody"),
			shell,
			viewportHeight,
			contentHeight,
			thumbHeight,
			scrollTrackSpace,
			scrollThumbSpace,
			scrollJump,
			ch,
			viewportWidth,
			contentWidth,
			viewportShellw,
			thumbHeightw,
			scrollJumpw,
			bleft,
			bleRig,
			resizeDom,
			mousePred = 0;

		divT.classList.add("top-tr");
		seletor.innerHTML = [
			'<button class="chell"></button>',
			'<div class="shell-left"><table></table></div>',
			'<div class="shell-top"></div>',
			'<div class="shell"></div>',
			'<div class="lp1"><button class="lko rolfooter" direction="prev"><span class="seve-chevron-up"></span></button><div class="left-scroll"><div class="bclick"></div><button></button></div><button class="lko rolfooter" direction="next"><span class="seve-chevron-down"></span></button></div>',
			'<div class="lp2"><button class="lko rolfooter" direction="prev"><span class="seve-chevron-left"></span></button><div class="orizontal-scroll"><div class="bclick"></div><button></button></div><button class="lko rolfooter" direction="next"><span class="seve-chevron-right"></span></button></div>'
		].join("");

		shellTop = seletor.querySelector(".shell-top");
		shell = seletor.querySelector(".shell");
		shellLeft = seletor.querySelector(".shell-left");



		table.appendChild(thead);
		table.appendChild(tbody);
		divT.appendChild(table);

		table1.appendChild(thead1);

		shellTop.appendChild(table1);


		var rep = (response || []),
			couu = 1,
			workBookData = new Array();

		if (!seletor._data)
			seletor._data = {
				options: {
					header: ar
				},
				dataSource: {
					data: function (e) {
						return !e ? this._data : ((e, t) => {
							t._data = typeof e.length == "undefined" ? new Array(e) : e;
							return t._data;
						})(e, this);
					},
					initDaSource: !init ? rep : init,
					_data: rep
				}
			};

		if (!init)
			seletor._data.dataSource.initDaSource = rep;

		rep.find((x, i) => {
			var shtT = document.createElement("tr"),
				tr1 = document.createElement("tr"),
				p = 0,
				workBookRow = {};
			sht = shellLeft.querySelector("table");
			for (var o in x) {
				if (i == 0) {
					if (ar[o] && !ar[o].hidden) {
						var td1 = document.createElement("th");
						var td2 = document.createElement("th");
						matriz[o] = 1;
						td1.setAttribute("name-parent", o);
						td1.setAttribute("offSet", p + 1);
						td2.setAttribute("offSet", p + 1);
						td1.innerHTML = '<span>' + (o || "&nbsp") + '</span>';
						td2.setAttribute("name-parent", o);
						td2.innerHTML = '<span>' + (ar[o].title || (o || "&nbsp")) + '</span>';
						tr.appendChild(td1);
						tr2.appendChild(td2);
						thead1.appendChild(tr2);
					}
				}

				if (ar[o] && !ar[o].hidden) {
					workBookRow[o] = (x[o] || "");
					var td = document.createElement("td");
					td.p = p;
					td.innerHTML = '<span>' + (x[o] || "&nbsp") + '</span>';
					td.setAttribute("name-fild", o);
					td.setAttribute("offSet", p + 1);
					tr1.appendChild(td);
					p++;
				}
			}

			workBookData.push(workBookRow);

			if (i == 0) {
				thead.appendChild(tr);
			}

			tdT = document.createElement("td");
			tdT.innerHTML = '<span>' + couu + '</span>';
			shtT.appendChild(tdT);
			sht.appendChild(shtT);
			couu++;

			tbody.appendChild(tr1);
			if (rep.length == (i + 1)) {
				for (var n = 0; n < 40; n++) {
					var tr1 = document.createElement("tr"), p = 0;
					for (var o in rep[0]) {
						if (ar[o] && !ar[o].hidden) {
							var td = document.createElement("td");
							td.innerHTML = '<span>&nbsp</span>';
							td.setAttribute("offSet", p + 1);
							tr1.appendChild(td);
							p++;
						}
					}

					shtT = document.createElement("tr");
					tdT = document.createElement("td");
					tdT.innerHTML = '<span>' + couu + '</span>';
					shtT.appendChild(tdT);
					sht.appendChild(shtT);
					couu++;

					tbody.appendChild(tr1);

				}

			}
		});

		/** alterar workBookData */
		seletor._data.workBookData = workBookData;


		shell.appendChild(divT);
		var shtr = shell.querySelectorAll("tbody tr:nth-child(1) td");
		var shtr1 = shellTop.querySelectorAll("th");
		shell.querySelectorAll("th").forEach(function (el, i) {
			//console.log(el.clientWidth);
			var px = Math.round(parseFloat(outerVanilha(el).css("width").replace("px", "")));
			shtr[i].style = "min-width:" + px + "px;max-width:" + px + "px;";
			shtr1[i].style = "min-width:" + px + "px;max-width:" + px + "px;";
		});

		shell.querySelector("thead").remove();

		resizeDom = () => {
			viewportHeight = outerVanilha(seletor.querySelector(".left-scroll")).height();
			contentHeight = shell.scrollHeight;

			thumbHeight = viewportHeight * (viewportHeight / contentHeight);

			scrollTrackSpace = contentHeight - viewportHeight;
			scrollThumbSpace = viewportHeight - thumbHeight;
			scrollJump = scrollTrackSpace / scrollThumbSpace;

			viewportWidth = outerVanilha(seletor.querySelector(".orizontal-scroll")).width();
			contentWidth = shell.scrollWidth;
			viewportShellw = outerVanilha(shell).width();

			thumbHeightw = viewportWidth * (viewportWidth / contentWidth);
			scrollJumpw = (contentWidth - viewportShellw) / viewportWidth;


			bleft = seletor.querySelector(".orizontal-scroll button");
			bleft.style.width = thumbHeightw + 'px';
			if (scrollJumpw <= 0)
				bleft.style.display = 'none';

			bleRig = seletor.querySelector(".left-scroll button");
			bleRig.style.height = thumbHeight + 'px';
			if (scrollJump <= 0)
				bleRig.style.display = 'none';
		};

		var rolfooter = seletor.querySelectorAll(".lp1 .rolfooter");
		rolfooter.forEach(function (rolfooter) {
			rolfooter.addEventListener("mousedown", function (event) {
				var e = window.event || e, tah = this;
				e.preventDefault();
				clearInterval(mousePred);
				var jump = Math.round(scrollJump);
				mousePred = setInterval(() => {
					if (tah.getAttribute("direction") == "prev")
						shell.scrollTop -= jump;
					if (tah.getAttribute("direction") == "next")
						shell.scrollTop += jump;
					shellLeft.scrollTop = shell.scrollTop;
					if (shellLeft.scrollTop != shell.scrollTop) {
						shell.scrollTop = shellLeft.scrollTop;
					}
					bleRig.style.marginTop = (shell.scrollTop / scrollJump) + "px";
				});
			});

			rolfooter.addEventListener("mouseup", function (e) {
				clearInterval(mousePred);
			});
		});

		var rolfooter = seletor.querySelectorAll(".lp2 .rolfooter");
		rolfooter.forEach(function (rolfooter) {
			rolfooter.addEventListener("mousedown", function (event) {
				var e = window.event || e, tah = this;
				e.preventDefault();
				clearInterval(mousePred);
				var jump = Math.round(scrollJumpw);
				mousePred = setInterval(() => {
					if (tah.getAttribute("direction") == "prev")
						shell.scrollLeft -= jump;
					if (tah.getAttribute("direction") == "next")
						shell.scrollLeft += jump;
					shellTop.scrollLeft = shell.scrollLeft;
					if (shellTop.scrollLeft != shell.scrollLeft) {
						shell.scrollLeft = shellTop.scrollLeft;
					}
					var thu = ((shell.scrollLeft / scrollJumpw) - thumbHeightw);
					bleft.style.marginLeft = (thu < 0 ? 0 : thu) + "px";
				});
			});

			rolfooter.addEventListener("mouseup", function (e) {
				clearInterval(mousePred);
			});
		});

		var storyMouese = false, storyMoueseTwo = false;
		seletor.querySelectorAll("[offSet]")
			.forEach(el => {
				el.addEventListener("mouseenter", function (event) {
					var att = this.getAttribute("offSet");
					storyMouese = seletor.querySelectorAll("[offSet='" + att + "']");
					storyMoueseTwo = this.closest("tr").querySelectorAll("td");
					storyMoueseTwo.forEach(x => {
						x.classList.add("storyMouese");
					});
					storyMouese.forEach(x => {
						x.classList.add("storyMouese");
					});
				});

				el.addEventListener("mouseleave", function (event) {
					if (storyMoueseTwo)
						storyMoueseTwo.forEach(x => {
							x.classList.remove("storyMouese");
						});
					if (storyMouese)
						storyMouese.forEach(x => {
							x.classList.remove("storyMouese");
						});
				});
			})


		seletor.querySelector(".left-scroll button")
			.addEventListener("mousedown", function (event) {
				var mask = (t => {
					if (t.parentElement.querySelector(".mask"))
						t.parentElement.querySelector(".mask").remove();
					var m = document.createElement("div");
					m.classList.add("mask");

					var el = outerVanilha(t.parentElement);
					el.find('button')
						.get(0).cursorX = (
							el.find('button').height() - (
								(el.find('button').offset().top + el.find('button').height()) - event.clientY)
						);
					return m;
				})(this);


				mask.addEventListener("mousemove", function (e) {
					var el = outerVanilha(this.parentElement),
						mn = (el.offset().top + el.height()) - el.find('button').height(),
						scollY = (e.clientY - el.offset().top),
						CX = el.find('button').get(0).cursorX,
						lc = scollY - CX;

					bleRig.pCurL = lc < 0 ? 0 : lc;
					if ((bleRig.pCurL + el.find('button').height()) > el.height()) {
						bleRig.pCurL = el.height() - el.find('button').height();
					}
					bleRig.style.marginTop = bleRig.pCurL + "px";



					shell.scrollTop = (scrollJump * bleRig.pCurL);
					shellLeft.scrollTop = shell.scrollTop;
					if (shellLeft.scrollTop != shell.scrollTop) {
						shell.scrollTop = shellLeft.scrollTop;
					}

				});

				mask.addEventListener("mouseup", function (e) {
					this.remove();
				});

				mask.addEventListener("mouseleave", function (e) {
					this.remove();
				});

				this.parentElement.appendChild(mask);
			});

		seletor.querySelector(".orizontal-scroll .bclick")
			.addEventListener("mousedown", function (event) {
				var e = window.event || e,
					scollX = (e.clientX - outerVanilha(this).offset().left),
					jump = scrollJumpw * (scollX + Math.round((outerVanilha(bleft).width() / 2)));
				shell.scrollLeft = jump;
				shellTop.scrollLeft = shell.scrollLeft;
				if (shellTop.scrollLeft != shell.scrollLeft) {
					shell.scrollLeft = shellTop.scrollLeft;
				}
				var thu = ((shell.scrollLeft / scrollJumpw) - thumbHeightw);
				bleft.style.marginLeft = (thu < 0 ? 0 : thu) + "px";
			});

		seletor.querySelector(".left-scroll .bclick")
			.addEventListener("mousedown", function (event) {
				var e = window.event || e,
					scollY = (e.clientY - outerVanilha(this).offset().top),
					jump = scrollJump * scollY;
				shell.scrollTop = jump;
				shellLeft.scrollTop = shell.scrollTop;
				if (shellLeft.scrollTop != shell.scrollTop) {
					shell.scrollTop = shellLeft.scrollTop;
				}
				bleRig.style.marginTop = (shell.scrollTop / scrollJump) + "px";

			});


		seletor.querySelector(".orizontal-scroll button")
			.addEventListener("mousedown", function (event) {
				var mask = (t => {
					if (t.parentElement.querySelector(".mask"))
						t.parentElement.querySelector(".mask").remove();
					var m = document.createElement("div");
					m.classList.add("mask");

					var el = outerVanilha(t.parentElement);
					el.find('button')
						.get(0).cursorX = (
							el.find('button').width() - (
								(el.find('button').offset().left + el.find('button').width()) - event.clientX)
						);
					return m;
				})(this);


				mask.addEventListener("mousemove", function (e) {
					var el = outerVanilha(this.parentElement),
						mn = (el.offset().left + el.width()) - el.find('button').width(),
						scollX = (e.clientX - el.offset().left),
						CX = el.find('button').get(0).cursorX,
						lc = scollX - CX;

					bleft.pCurL = lc < 0 ? 0 : lc;
					if ((bleft.pCurL + el.find('button').width()) > el.width()) {
						bleft.pCurL = el.width() - el.find('button').width();
					}
					bleft.style.marginLeft = bleft.pCurL + "px";
					var ttx = bleft.scollX > scollX ?
						(scrollJumpw * bleft.pCurL) :
						(bleft.pCurL > thumbHeightw ? (scrollJumpw * (bleft.pCurL + thumbHeightw)) : (scrollJumpw * bleft.pCurL));

					bleft.scollX = scollX;
					if (bleft.pCurL > 0) {
						shell.scrollLeft = ttx;
						shellTop.scrollLeft = ttx;
					}

					if (shellTop.scrollLeft != shell.scrollLeft) {
						shell.scrollLeft = shellTop.scrollLeft;
					}

					if (bleft.pCurL == 0) {
						shell.scrollLeft = 0;
						shellTop.scrollLeft = 0;
					}
				});

				mask.addEventListener("mouseup", function (e) {
					this.remove();
				});

				mask.addEventListener("mouseleave", function (e) {
					this.remove();
				});

				this.parentElement.appendChild(mask);
			});

		resizeDom();
		page.escopeResizeDom(resizeDom);

		if (seletor.addEventListener) {
			// IE9, Chrome, Safari, Opera
			seletor.addEventListener("mousewheel", MouseWheelHandler, false);
			// Firefox
			seletor.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
		}
		// IE 6/7/8
		else {
			seletor.attachEvent("onmousewheel", MouseWheelHandler);
		}

		function MouseWheelHandler(e) {
			var e = window.event || e;
			shell.scrollTop += (e.deltaY);
			shellLeft.scrollTop = shell.scrollTop;
			if (shellLeft.scrollTop != shell.scrollTop) {
				shell.scrollTop = shellLeft.scrollTop;
			}
			shell.scrollLeft += (e.deltaX);
			shellTop.scrollLeft = shell.scrollLeft;
			if (shellTop.scrollLeft != shell.scrollLeft) {
				shell.scrollLeft = shellTop.scrollLeft;
			}
			bleRig.style.marginTop = (shell.scrollTop / scrollJump) + "px";
			var thu = ((shell.scrollLeft / scrollJumpw) - thumbHeightw);
			bleft.style.marginLeft = (thu < 0 ? 0 : thu) + "px";
			e.preventDefault();
		}

		return {
			fillter: () => {
				var center = document.querySelector(".center-riports"),
					frButons = document.querySelector(".frButons"),
					header = page.data(center).options.header,
					denter = document.querySelector("#options-denter"),
					filter,
					workBookChange = (arg) => {
						var book = page.data(arg.selector),
							dataSource,
							newDataSource,
							searsh;

						if (book.options.header[arg.oldfild || arg.fild])
							book.options.header[arg.oldfild || arg.fild].hidden = arg.hidden;

						dataSource = book.dataSource.initDaSource;
						newDataSource = dataSource;
						searsh = arg.searsh.toLowerCase().replace(/[\n\t]/, "");
						/** filtrar valores no data source */
						if (arg.actions === true) {
							if (!book.storyFilter)
								book.storyFilter = [];
							if (book.storyFilter.indexOf(arg.fild) == -1) {
								book.storyFilter.push(arg.fild);
							}
							if (!book.ObjectStoryFilter)
								book.ObjectStoryFilter = {};
							book.ObjectStoryFilter[arg.fild] = searsh;

							/** remover html da dom */
							arg.selector.innerHTML = "";

							if (arg.searsh.length)
								newDataSource = (() => {
									/** filtrar pelo texto */
									frButons.innerHTML = "";
									newDataSource = null;
									var indexOff = (dataSource, xvm, fild) => {
										var nData = new Array();
										dataSource.find(x => {
											var sData = (x[fild] || "").toLowerCase().replace(/[\n\t]/, "");
											if (sData == xvm) {
												/** atribuir os filtros na matris */
												nData.push(x);
											}
										});
										return nData;
									};

									book.storyFilter.find(vm => {
										//frButons
										var tHeader = book.options.header[vm],
											btb = document.createElement("DIV"),
											vjx = book.ObjectStoryFilter[vm];
										btb.classList.add("bt-acript");
										btb.vm = vm;

										newDataSource = indexOff(
											(newDataSource == null ? dataSource : newDataSource),
											vjx,
											vm
										);

										btb.innerHTML = "<div><span><b>" + (tHeader.title || vm) + ":</b>" + vjx + " </span><button class='seve-trash'></button></div>";
										btb.addEventListener("click", function () {
											var par = this, butt, last,
												thisBt = filter.querySelector("[role-workgroup=" + (par || {}).vm + "]");
											/** remover filtros */
											book.storyFilter.splice(book.storyFilter.indexOf(par.vm), 1);
											thisBt.history.value = "";
											delete thisBt.actionsInput;
											delete book.ObjectStoryFilter[par.vm];
											par.remove();

											/** pegar a posição da ultima consulta */
											butt = frButons.querySelectorAll("div>div:last-child")[0],
												/** indentificar o role-workgroup */
												last = filter.querySelector("[role-workgroup=" + (butt || {}).vm + "]");

											last = !last ? {
												history: {
													fild: false,
													value: "",
													checkbox: false
												},
												actionsInput: false
											} : last;

											/** alterar data workbook */
											return workBookChange({
												fild: last.history.fild,
												searsh: last.history.value,
												hidden: last.history.checkbox,
												selector: center,
												button: last,
												actions: last.actionsInput
											});

										});

										frButons.appendChild(btb);
									});

									return newDataSource;
								})();
						}

						/** data work book */
						book.workBookData = newDataSource;
						/* recarregar a função */
						return page.shellExcel(
							arg.selector,
							newDataSource,
							book.options.header,
							book.dataSource.initDaSource
						);
					};

				denter.innerHTML = [
					'<div class="filtrar"></div>'
				].join("");

				filter = denter.querySelector(".filtrar");

				for (var r in header) {
					var bt = document.createElement("BUTTON");
					bt.innerHTML = "<div>" + (header[r].title || r) + '<span class="seve-filter ff-s"></span></div>';
					bt.innerTitle = header[r].title || r;
					bt.args = header[r];
					bt.filds = r;
					bt.setAttribute("role-workgroup", r);
					bt.actionsInput = false;
					bt.history = { value: "", checkbox: false, fild: r };
					bt.addEventListener("contextmenu", function (e) {
						e.preventDefault();
						this.click();
					});
					bt.addEventListener("click", function () {
						var tah = this, butt;
						page.popup({
							type: "warning",
							title: tah.innerTitle,
							button: '<button role="data-ok">Aplicar</button',
							footer: function () {
								var popup = this.popup,
									input = popup.querySelector("[type=text]"),
									checkbox = popup.querySelector("[type=checkbox]"),
									button = popup.querySelector("[role=data-ok]"),
									thisfil = false;

								popup.querySelector(".pop-body").style.width = "320px";

								input.value = tah.history.value;
								checkbox.checked = tah.history.checkbox;

								input.addEventListener("change", function () {
									tah.actionsInput = true;
									thisfil = true;
								});

								button.addEventListener("click", function () {
									var tahs = tah, old, told;
									tahs.history.checkbox = checkbox.checked;
									tahs.history.value = input.value;
									if (!thisfil) {
										butt = frButons.querySelectorAll("div>div:last-child")[0];
										if (butt) {
											told = true;
											tahs = (filter.querySelector("[role-workgroup=" + (butt || {}).vm + "]") || tah);
										}
									}

									old = {
										fild: tahs.history.fild,
										searsh: tahs.history.value,
										hidden: tah.history.checkbox,
										selector: center,
										button: tahs,
										actions: tahs.actionsInput
									};

									if (told) {
										old.oldfild = tah.history.fild;
									}

									return workBookChange(old);

								});
							},
							html: [
								'<div class="col-popup">',
								'<label>Pesquisar Pela Descrição</label>',
								'<input type="text" />',
								'</div>',
								'<div class="col-popup">',
								'<label>Desabilitar Este Campo</label>',
								'<div>',
								'<label class="switch">',
								'<input type="checkbox">',
								'<b class="slider round"></b>',
								'</label>',
								'</div>',
								'</div>'
							].join("")
						});
					});
					filter.appendChild(bt);
				}
			}
		};

	}

	function popup(args) {
		var pop = document.createElement("div"),
			args = args || {};

		pop.classList.add("popup");

		pop.innerHTML = [
			'<div class="pop-mask"></div>',
			'<div class="pop-body">',
			'<div class="pop-top">',
			'<h3 class="pop-title">', (args.title || "&nbsp"), '</h3>',
			'<button role="data-cancel" class="seve-x"></button>',
			'</div>',
			'<div class="pop-center">', (args.html || "&nbsp"), '</div>',
			'<div class="pop-footer">',
			(
				args.type == "warning" ?
					(args.button || "") :
					(args.button || '<button role="data-cancel">Cancelar</button><button role="data-ok">Confirmar</button>')
			),
			'</div>',
			'</div>'
		].join("");

		if (args.type == "warning") {
			pop.classList.add("popup-warning");
			pop.querySelector(".pop-mask").setAttribute("role", "data-cancel");
		}

		if (args.style)
			pop.querySelector(".pop-body").setAttribute("style", args.style);


		pop.close = function () {
			if (typeof args.close == "function")
				args.close();
			pop.remove();
		};
		pop.querySelectorAll("[role='data-cancel']")
			.forEach(x => {
				x.addEventListener("contextmenu", function (e) {
					e.preventDefault();
					pop.close();
				});
				x.addEventListener("click", function () {
					pop.close();
				});
			});

		pop.querySelectorAll("[role='data-ok']")
			.forEach(x => {
				x.addEventListener("click", function () {
					pop.close();
				});
			});

		if (args.footer)
			args.footer.call({ popup: pop, elements: pop.querySelectorAll(".pop-footer > *") });
		document.body.appendChild(pop);
	}


	function globalScroll(seletor) {
		var seletor = (seletor => {
			return typeof seletor == "string" ? document.querySelector(seletor) : seletor;
		})(seletor);

		if (seletor.createScroll)
			return seletor.createScroll();

		var shell = seletor.querySelector("[scroll-body]"),
			viewportHeight,
			contentHeight,
			thumbHeight,
			scrollTrackSpace,
			scrollThumbSpace,
			scrollJump,
			bleRig,
			mousePred = 0,
			bl1 = document.createElement("DIV"),
			resizeDom = () => {
				viewportHeight = outerVanilha(seletor.querySelector(".left-scroll")).height();
				contentHeight = shell.scrollHeight - 61;
				thumbHeight = viewportHeight * (viewportHeight / contentHeight);

				scrollTrackSpace = contentHeight - viewportHeight;
				scrollThumbSpace = viewportHeight - thumbHeight;
				scrollJump = scrollTrackSpace / scrollThumbSpace;

				bleRig = seletor.querySelector(".left-scroll button");
				bleRig.style.height = thumbHeight + 'px';
				if (viewportHeight == thumbHeight)
					bleRig.style.display = 'none';
				if (viewportHeight != thumbHeight)
					bleRig.style.display = 'block';
			};


		bl1.classList.add("lp1");
		bl1.innerHTML = [
			'<button class="lko rolfooter" direction="prev"><span class="seve-chevron-up"></span></button><div class="left-scroll"><div class="bclick"></div><button></button></div><button class="lko rolfooter" direction="next"><span class="seve-chevron-down"></span></button>'
		].join("");
		seletor.appendChild(bl1);
		seletor.classList.add("global-seletor");

		var rolfooter = bl1.querySelectorAll(".rolfooter");
		rolfooter.forEach(function (rolfooter) {
			rolfooter.addEventListener("mousedown", function (event) {
				var e = window.event || e, tah = this;
				e.preventDefault();
				clearInterval(mousePred);
				var jump = Math.round(scrollJump);
				mousePred = setInterval(() => {
					if (tah.getAttribute("direction") == "prev")
						shell.scrollTop -= jump;
					if (tah.getAttribute("direction") == "next")
						shell.scrollTop += jump;
					bleRig.style.marginTop = (shell.scrollTop / scrollJump) + "px";
				});
			});

			rolfooter.addEventListener("mouseup", function (e) {
				clearInterval(mousePred);
			});
		});


		var storyMouese = false, storyMoueseTwo = false;
		seletor.querySelectorAll("[offSet]")
			.forEach(el => {
				el.addEventListener("mouseenter", function (event) {
					var att = this.getAttribute("offSet");
					storyMouese = seletor.querySelectorAll("[offSet='" + att + "']");
					storyMoueseTwo = this.closest("tr").querySelectorAll("td");
					storyMoueseTwo.forEach(x => {
						x.classList.add("storyMouese");
					});
					storyMouese.forEach(x => {
						x.classList.add("storyMouese");
					});
				});

				el.addEventListener("mouseleave", function (event) {
					if (storyMoueseTwo)
						storyMoueseTwo.forEach(x => {
							x.classList.remove("storyMouese");
						});
					if (storyMouese)
						storyMouese.forEach(x => {
							x.classList.remove("storyMouese");
						});
				});
			});


		seletor.querySelector(".left-scroll button")
			.addEventListener("mousedown", function (event) {
				var mask = (t => {
					if (t.parentElement.querySelector(".mask"))
						t.parentElement.querySelector(".mask").remove();
					var m = document.createElement("div");
					m.classList.add("mask");

					var el = outerVanilha(t.parentElement);
					el.find('button')
						.get(0).cursorX = (
							el.find('button').height() - (
								(el.find('button').offset().top + el.find('button').height()) - event.clientY)
						);
					return m;
				})(this);


				mask.addEventListener("mousemove", function (e) {
					var el = outerVanilha(this.parentElement),
						mn = (el.offset().top + el.height()) - el.find('button').height(),
						scollY = (e.clientY - el.offset().top),
						CX = el.find('button').get(0).cursorX,
						lc = scollY - CX;

					bleRig.pCurL = lc < 0 ? 0 : lc;
					if ((bleRig.pCurL + el.find('button').height()) > el.height()) {
						bleRig.pCurL = el.height() - el.find('button').height();
					}
					bleRig.style.marginTop = bleRig.pCurL + "px";
					shell.scrollTop = (scrollJump * bleRig.pCurL);

				});

				mask.addEventListener("mouseup", function (e) {
					this.remove();
				});

				mask.addEventListener("mouseleave", function (e) {
					this.remove();
				});

				this.parentElement.appendChild(mask);
			});


		seletor.querySelector(".left-scroll .bclick")
			.addEventListener("mousedown", function (event) {
				var e = window.event || e,
					scollY = (e.clientY - outerVanilha(this).offset().top),
					jump = scrollJump * scollY;
				shell.scrollTop = jump;
				bleRig.style.marginTop = (shell.scrollTop / scrollJump) + "px";
			});


		resizeDom();
		seletor.createScroll = resizeDom;
		page.escopeResizeDom(resizeDom);
		if (seletor.addEventListener) {
			// IE9, Chrome, Safari, Opera
			seletor.addEventListener("mousewheel", MouseWheelHandler, false);
			// Firefox
			seletor.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
		}
		// IE 6/7/8
		else {
			seletor.attachEvent("onmousewheel", MouseWheelHandler);
		}

		function MouseWheelHandler(e) {
			var e = window.event || e;
			shell.scrollTop += (e.deltaY);
			bleRig.style.marginTop = (shell.scrollTop / scrollJump) + "px";
			e.preventDefault();
		}
	}

	function maskbi(selector) {
		var selector = document.querySelector(selector);

		selector.addEventListener("focusout", function (events) {
			var length = this.value.length;
			if (length < 13 && this.validateBi)
				return this.value = "";
		});

		selector.addEventListener("keydown", function (events) {
			var arr = [8, 16, 17, 37, 38, 39, 40],
				length = this.value.length;

			if (events.ctrlKey && [67, 65, 86, 88].indexOf(events.keyCode) > -1)
				return true;
			// se for bi não pode ser maior que 14 digitos
			if (length > 13 && this.validateBi && arr.indexOf(events.keyCode) == -1)
				events.preventDefault();

		});
	}

	function maskPhoneAng(sel) {
		var sel = selector(sel),
			doc = document,
			sCPosition = function (selector, caretPos) {
				var el = selector;

				el.value = el.value;
				if (el !== null) {

					if (el.createTextRange) {
						var range = el.createTextRange();
						range.move('character', caretPos);
						range.select();
						return true;
					}

					else {
						if (el.selectionStart || el.selectionStart === 0) {
							el.focus();
							el.setSelectionRange(caretPos, caretPos);
							return true;
						}

						else {
							el.focus();
							return false;
						}
					}
				}
			},
			condicional = (v, l) => {
				if (l > 0 && l < 3) return v.replace(/^(\d{3}|\d{2}|\d{1}).*/, '(+244) ');
				if (l > 2 && l < 4) return v.replace(/^(\d{3}).*/, '(+244) ');
				if (l > 3 && l < 7) return v.replace(/^(\d{3})(\d{3}|\d{2}|\d{1}).*/, '(+244) $2');
				if (l > 6 && l < 10) return v.replace(/^(\d{3})(\d{3})(\d{3}|\d{2}|\d{1}).*/, '(+244) $2 $3');
				if (l > 9 && l < 13) return v.replace(/^(\d{3})(\d{3})(\d{3})(\d{3}|\d{2}|\d{1}).*/, '(+244) $2 $3 $4');
			};
		sel.forEach(ele => {
			var input = ele;
			/** inicializar a função */
			input.value = "(+244) ";
			input.addEventListener("focusout", function (events) {
				var value = this.value.replace(/\D/g, "");
				if (value.length < 12)
					return this.value = "(+244) ";
			});
			input.addEventListener("keydown", function (events) {
				var numebr = !isNaN(events.key),
					//sStart = events.target.selectionStart,
					arr = [8, 16, 17, 37, 38, 39, 40],
					value = this.value.replace(/\D/g, ""),
					length = value.length;

				if (events.ctrlKey && [67, 65, 86, 88].indexOf(events.keyCode) > -1)
					return true;

				if (this.value.length > 17 && arr.indexOf(events.keyCode) == -1)
					return events.preventDefault();

				if (!numebr) {
					if (arr.indexOf(events.keyCode) == -1)
						return events.preventDefault();
				}

				if (value.length == 0 && numebr) {
					value = value + "" + events.key;
					length = length + 1;
				}

				if (condicional(value, length))
					return this.value = condicional(value, length);

				//return sCPosition( this, this.value.length );

			});
		});
	}

	/** functions e configuração script web page */
	window.page = {
		painel: {},
		user: function(){
			return JSON.parse( '{"id":"51cd6de7-cc25-40f6-b2ba-f544af72da02","nome":"Mauro","loginName":"mouro","email":"mauro@essca.ao","telefone":"(+244) 998 484 848","fotografia":"","empresa":null,"nivelId":4}' );
		},
		Chart: new Array(),
		/** alterar os campos do modelo para minusculo */
		refactorObject: function (obj) {
			if (!obj || typeof obj === "string" || !obj.find)
				return obj;
			var arr = new Array();
			obj.find(x => {
				var obje = {};
				for (i in x)
					obje[i.toLowerCase()] = x[i];
				arr.push(obje);
			});
			return arr;
		},
		escopeResizeDom: function (resolve) {
			/** criar scope para o resize */
			var doc = document,
				resolve = resolve;
			if (!doc.resize) {
				doc.resize = [resolve];
			} else {
				doc.resize.find(x => {
					if (doc.resize.indexOf(resolve) > -1) {
						doc.resize[doc.resize.indexOf(resolve)] = resolve;
					} else {
						doc.resize.push(resolve);
					}
				});
			}
		},
		maskbi: maskbi,
		dataChart: dataChart,
		selector: selector,
		trim: trim,
		globalScroll: globalScroll,
		shellExcel: shellExcel,
		popup: popup,
		logout: logout,
		form: form,
		srcToBase64: srcToBase64,
		print: print,
		autocomplite: autocomplite,
		dropDown: dropDown,
		grid: grid,
		maskPhoneAng: maskPhoneAng,
		editorIMG: function (obj, calback) {
			var value = (valoe) => {
				var par = obj.parentElement,
				image = document.createElement("img");
				image.classList.add( "img-fotpl" );
				obj.value = valoe;
				image.src = valoe || "/production/content/icon/user.png";
				image.onload = function (e) {
					par.appendChild(image);
					if( typeof calback == "function" )
						calback(e, valoe);
				};
			}, obj = typeof obj == "string" ? document.querySelector(obj) : obj, 
			append = obj => { return document.createElement(obj); },
				set = function (poup, image) {
					var objIMG = document.createElement("img");
					poup.close();
					if (divArea.querySelector("img")) {
						objIMG = divArea.querySelector("img");
					} else {
						divArea.append(objIMG);
					}

					/** renderizar imagens */
					page.srcToBase64(image, 300, 300, function (imag) {
						objIMG.src = imag;
						objIMG.onload = function (e) {
							fetch(imag)
								.then(res => res.blob())
								.then(function (images) {
									var blob = new File([images], (new Date().getTime()) + ".png", { type: "image/png", lastModified: new Date().getTime() }),
										container = new DataTransfer();
									container.items.add(blob);

									if(typeof calback == "function")
										return calback.call({ blob:blob, files:container.files, base64: imag });
									
								});
						};
					});
				},
			divArea = append("div");
			if( obj.initEditor )
				return { value: value };
			
			divArea.innerHTML = ['<div class="opa-foto"><span class="seve-camera"></span></div>'].join('');
			divArea.classList.add("pasrent-image");
			if( !obj.initEditor )
				obj.initEditor = true;
			obj.append(divArea);
			obj.classList.add("editor-img");
			obj.addEventListener("click", function () {
				page.popup({
					type: "warning",
					title: 'Editar foto',
					html: '<input type="file" name="fileupload" style="display:none;" id="fileupload" /><p>The setCaretPosition function works just fine. Your addActionHandler function, however, does not. But even</p>',
					button: '<button class="bak-green" id="WebCam">WebCam</button> <button class="bak-green" id="Carregar">Carregar</button>',
					footer: function () {
						var poup = this.popup,
							WebCam = poup.querySelector("#WebCam"),
							Carregar = poup.querySelector("#Carregar"),
							fileupload = poup.querySelector("#fileupload");

						fileupload.addEventListener("change", function () {
							var reader = new FileReader();
							reader.onload = function (e) {
								return set(poup, e.target.result);
							}
							reader.readAsDataURL(this.files[0]);
						});

						Carregar.addEventListener("click", function () {
							fileupload.click();
						});

						WebCam.addEventListener("click", function () {
							// fechar popup informação...
							poup.close();
							var webcam;

							page.popup({
								title: 'Web Camera',
								html: '<div class="sst-webcam"><video autoplay id="video"></video></div>',
								button: '<button class="bak-green" id="Foto">Foto</button> <button class="bak-green" id="switc">switc</button>',
								close: function () {
									return webcam.stop();
								},
								footer: function () {
									var poup = this.popup,
										Foto = poup.querySelector("#Foto"),
										switc = poup.querySelector("#switc")

									switc.addEventListener("click", function () {
										webcam.switch();
									});

									Foto.addEventListener("click", function () {
										var image = webcam.screenShot();
										set(poup, image);
									});

									// carregar web cam
									webcam = webCam2(poup);
									return webcam.init();
								}
							});
						});
					}
				});
			});

			return { value: value };
		},
		attachment: function (elment) {
			elment.innerHTML = [
				'<div><button></button></div><div></div>'
			].join("");
			elment.classList.add("attachment");
		},
		editorText: function (obj, ar) {
			var append = obj => { return document.createElement(obj); },
				textarea = append("textarea"),
				divTextarea = append("div");

			divTextarea.classList.add("parent-textarea");

			textarea.setAttribute("name", obj.name);
			textarea.setAttribute("id", obj.id);

			divTextarea.append(textarea);

			obj.parentElement.append(divTextarea);

			obj.parentElement.classList.add("container-textarea");
			obj.remove();
		},
		DateString: function (jsonDate) {
			var s = jsonDate.split(/[- :]/),
				dt = new Date(),
				a = new Date(s[0], s[1] - 1, s[2]),
				d = a.toDateString().split(/[\s]/g);

			/** sé for o mesmo dia */
			if (s[2] == dt.getDate() && s[1] == (dt.getMonth() + 1) && s[0] == dt.getFullYear())
				return "Hoje " + [s[3], s[4]].join(":");

			return [d[2], d[1], (d[3] == dt.getFullYear() ? "" : d[3])].join(" ");
		},
		ChartPopUp: function (context) {
			var popup = document.body.querySelector(".Chart-popup");
			if (!popup) {
				popup = document.createElement("div");
				popup.classList.add("Chart-popup");
			}
			popup.style.opacity = 0;
			console.log(context);
		},
		ChartRenderData: function (e) {
			var response = e[0],
				dt = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
				filter = x => {
					var dataSet = new Array();
					dt.find(r => {
						var som = 0;
						x.find(a => {
							if (a.split(/[-]/g)[1] == r) {
								som = som + 1;
							}
						})
						if (som > 0)
							dataSet.push(som);
					});
					return dataSet;
				};
			for (var r in response)
				response[r] = filter(response[r] ? response[r].split(/[,]/g) : []);

			return response;
		},
		setDayHtml: function (arg) {
			selector(arg.selector).forEach(el => {
				var Matris = (a, d) => {
					var ob = new Array();
					for (var day = 1; day <= new Date(a, d, 0).getDate(); day++) {
						var r = {}, name = new Array("diasemena", "dia", "mes", "ano");
						new Date(a, d - 1, day).toLocaleDateString('pt-br', {
							weekday: 'long',
							year: 'numeric',
							month: 'long',
							day: 'numeric'
						}).replace(/de /g, ',').split(/,/g)
							.find((x, i) => {
								r[name[i]] = page.trim(x);
							});

						ob.push(r);
					}
					return ob;
				}, createDom = (response) => {
					/** filter datas */
					var da = new Date(),
						an = arg.date.ano,
						me = arg.date.mes,
						an1 = da.getFullYear(),
						me1 = da.getMonth() + 1,
						dia = da.getDate();


					el.innerHTML = "";
					/** configuração em portugues */
					var pt = ['segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado', 'domingo'],
						arrPt = [
							'<td>Seg</td>',
							'<td>Ter</td>',
							'<td>Qua</td>',
							'<td>Qui</td>',
							'<td>Sex</td>',
							'<td>Sáb</td>',
							'<td>Dom</td>',
						].join("");

					var table = document.createElement("table"),
						trTitle = document.createElement("tr"),
						trH = document.createElement("tr"), tr, i = 0, line = 3;
					table.classList.add("dataOffPares");

					trTitle.innerHTML = [
						'<td colspan="5">', response[0].mes, ' de ', response[0].ano, '</td>',
						'<td colspan="2" option><button type="down"><span class="seve-chevron-down"></span></button><button type="up"><span class="seve-chevron-up"></span></button></td>'
					].join("");

					trTitle.querySelectorAll("button")
						.forEach(function (bt) {
							bt.addEventListener("click", function () {
								var ty = this.getAttribute("type");
								arg.date.mes = (ty == "down" ? (arg.date.mes + 1) : (arg.date.mes - 1));
								createDom(Matris(arg.date.ano, arg.date.mes));
							});
						});

					trH.innerHTML = arrPt;
					table.appendChild(trTitle);
					table.appendChild(trH);


					for (var a = 0; a < 42; a++) {
						if (i == 7)
							i = 0;

						if (i == 0) {
							tr = document.createElement("tr");
							table.appendChild(tr);
						}

						var td = document.createElement("td");
						td.setAttribute("day-index", (a + 1));
						tr.appendChild(td);
						i = i + 1;
					}
					response.find((x, i) => {
						var index = pt.indexOf(x.diasemena);

						if (0 == i) {
							var desc = new Date(arg.date.ano, arg.date.mes - 1, 0).getDate(),
								jn = index, d = 1;

							for (var a = jn; a > 0; a--) {
								var tdi = table.querySelector("[day-index='" + a + "']");
								tdi.innerHTML = desc;
								tdi.classList.add("dateOff");
								desc = desc - d;
							}
						}

						var td = table.querySelectorAll("tr:nth-child(" + line + ") td")[index];
						td.innerHTML = x.dia;
						td.day = x.dia;
						td.classList.add("day");
						td.classList.add("day-" + x.dia);
						if (an == an1 && me == me1 && dia == parseInt(x.dia)) {
							td.classList.add("focus");
							td.NowDay = x.dia;
						}
						if (index == 6) {
							line = line + 1;
						}
						if (response.length - 1 == i) {
							var ap = 42 - response.length, offSet, tdi;
							for (var a = 1; a <= ap; a++) {
								offSet = (parseInt(td.getAttribute('day-index')) + a);
								tdi = table.querySelector("[day-index='" + offSet + "']");
								if (tdi) {
									tdi.innerHTML = a;
									tdi.classList.add("dateOff");
								} else {
									break;
								}

							}
						}
					});

					el.appendChild(table);
				};
				createDom(Matris(arg.date.ano, arg.date.mes));
			});
		},
		containerTab: function (arg) {
			var arg = arg || {},
				filds = [],
				onloadTabs = function (center) {
					var t = this,
						name = t.getAttribute("tab-filter"),
						u = document.location.href,
						ur = u.split(/&/g),
						alt = 90;

					ur.find((x, i) => {
						if (x.indexOf("tab=") > -1)
							alt = i;
					})
					if (alt == 90)
						u = ur.join("&") + "&tab=" + name;
					if (alt != 90) {
						ur[alt] = "tab=" + name;
						u = ur.join("&");
					}
					arg.dataBound.call({ element: t, center: center }, {
						path: page.dir,
						pathname: u.split(page.dir)[1],
						href: u,
						src: name
					});
				};

			selector(arg.selector).forEach(selector => {
				selector.innerHTML = [
					'<div class="data-tb-top">',
					'<div class="rowa"></div>',
					'</div>',
					'<div class="data-tb-center"></div>'
				].join("");

				arg.tabs.find(x => {
					var bt = document.createElement("BUTTON");
					bt.setAttribute("tab-filter", x.link);
					bt.innerHTML = x.label;
					if (x.class)
						bt.setAttribute("class", x.class);
					selector.querySelector(".rowa")
						.appendChild(bt);
				});

				selector.querySelectorAll('[tab-filter]')
					.forEach(el => {
						filds.push(el);
						el.addEventListener('click', function () {
							filds.find(x => {
								if (x !== this)
									x.classList.remove('focus');
							});

							this.classList.add('focus');
							return onloadTabs.call(this, selector.querySelector('.data-tb-center'));
						});
					});

				if (!selector.initPage)
					((selector) => {
						selector.querySelectorAll('[tab-filter]')[0]
							.click();
						selector.initPage = true;
					})(selector);
			});

		},
		responseHTML: function (response, doc = document) {
			var ar = (response[0] || []);
			for (var r in ar)
				(() => {
					doc.querySelectorAll(['[response-', r, ']'].join(''))
						.forEach(x => {
							x.innerHTML = ar[r];
						});
				})();
		},
		XLSX: function (arg) {
			if (typeof XLSX !== "undefined") {
				var arg = arg || {},
					wb = XLSX.utils.book_new();
				wb.Props = {
					Title: arg.Title || "New Document",
					Subject: arg.Subject || "Test",
					Author: arg.Author || "Severino Web Master",
					CreatedDate: new Date()
				};
				wb.SheetNames.push("Test Sheet");
				var ws = XLSX.utils.json_to_sheet(arg.json || [{ error: 'sem nenhum parametro' }]);
				wb.Sheets["Test Sheet"] = ws;
				XLSX.writeFile(wb, (arg.fileName || 'text.xlsx'), { bookType: 'xlsx', type: 'binary' });
			}
			clearTimeout(window.setProgress);
			document.body.classList.add("stop-load");
		},
		setURL: function (href) {
			clearTimeout(window.setProgress);
			window.setProgress = setTimeout(function () {
				document.body.classList.remove("stop-load");
			}, 5e2);
			history.pushState({
				url: href
			},
				"Escola",
				href
			);
			return openPage({ state: { url: href } });
		},
		contextmenu: function (el, arg) {
			var arg = arg || {};
			el.addEventListener("contextmenu", function (event) {
				event.preventDefault();
				var context = document.querySelector(".page-context-menu"),
					that = this,
					height =
						contextmenu = function (event) {
							event.preventDefault();
							outerVanilha(document.body).unbind("click");
							context.remove();
						};
				if (context)
					context.remove();
				context = document.createElement("div");
				context.classList.add("page-context-menu");
				document.body.appendChild(context);
				context.style.top = [
					event.pageY, "px"
				].join("");

				context.style.left = [
					event.pageX, "px"
				].join("");

				if (arg.options)
					(options => {
						var ul = document.createElement('ul'), li;
						options.find(x => {
							li = document.createElement('li');
							if (x.select)
								li.addEventListener("click", function () {
									x.select.call({ element: that, arg: arg, selector: this });
								});
							li.innerHTML = x.label;
							ul.appendChild(li);
						});
						context.appendChild(ul);
					})(arg.options);

				if (outerVanilha(context).offset().top + outerVanilha(context).height() > window.innerHeight) {
					context.style.top = [
						(event.pageY - outerVanilha(context).height()), "px"
					].join("");
				}

				// remover evente listiner
				outerVanilha(document.body).unbind("click");
				outerVanilha(document.body).bind("click", contextmenu);

				context.addEventListener("contextmenu", function (event) {
					event.preventDefault();
				});

			});
		},
		EmptyDropList: function () {
			document.querySelectorAll(".droplist")
				.forEach(x => {
					x.remove();
				});
		},
		focusELementMenu: function (index) {
			var likFocus = document.querySelectorAll(".focusMenus"),
				ind = likFocus[index];
			likFocus.forEach(el => {
				el.classList.remove("focus");
				el.classList.remove("focus-per");
			});
			if (ind) {
				ind.classList.add("focus");
				ind.classList.add("focus-per");
				return ind;
			}

			return { dataLink: [] };
		},
		Link: function (link, container) {
			/** verificar sé o container é um selector ou é um objecto */
			if (!link) return false;
			var container = (
				!container ?
					document.querySelector(".result-search") :
					(typeof container == "string" ? document.querySelector(container) : container)
			);

			link.find(x => {
				var line = document.createElement("div"),
					htm = [
						'<div>', x.label, '</div>',
						(x.plus ? '<button>Nova <span class="seve-plus"></span></button>' : '')
					].join("");
				line.classList.add("list");
				if (x.title) line.classList.add("title");
				if (x.u) line.setAttribute("href", page.dir + x.u);
				line.innerHTML = htm;
				container.appendChild(line);
			});
		},
		u: function (i) {
			var r = {}, op = (document.location.href.split(/[&]/g)[i] || "").split(/[=]/g);
			r[op[0] || "searsh"] = op[1] || null;
			return r;
		},
		delay: (function () {
			var timer = 0;
			return function (callback, ms) {
				clearTimeout(timer);
				timer = setTimeout(callback, ms);
			};
		})(),
		// retorna configuração do data dos elementos
		data: function (selector) {
			selector = (
				typeof selector == "string" ?
					document.querySelector(selector) :
					selector
			);

			if ((selector || {})._data)
				return selector._data;
			return {};
		},
		dir: (
			/** verificar sé o direitorio raiz foi declarado... */
			doc.querySelector("html")
				.getAttribute("host") || ""
		),
		/** adicionar automaticamento os methodos para [[Prototype]]: Object */
		proto: function (obj) {
			var prop = Object.create({
				then: function (resolve = function () { }) {
					this.resolve = resolve;
				},
				execute: function (u, b) {
					// executar quado o parameter for uma função
					var that = this;
					if (typeof u == "function") {
						u(function (response) {
							if (that.resolve)
								that.resolve.call(that, response);
						});
					} else {

						page.post([page.dir, u].join(""), b)
							.then(response => {
								var response = page.refactorObject(response);
								if (this.resolve)
									return this.resolve.call(this, response);
							});
					}
					return this;
				},
			});
			for (i in obj) {
				prop[i] = obj[i];
			}
			return prop;
		},
		post: async function post(url = '', data = {}, type) {
			const response = await fetch(url, {
				method: 'POST',
				mode: 'cors',
				cache: 'no-cache',
				credentials: 'same-origin',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				redirect: 'follow',
				referrerPolicy: 'no-referrer',
				body: new URLSearchParams(data)
			});

			if (type == "text")
				return response.text();
			return response.json();
		},
		worningInput: function () {
			if (this.getAttribute("mensage-worning") || this.tagName == "BUTTON" || this.tagName == "INPUT")
				return (
					(t, mensage) => {
						var worning = t.parentElement.querySelector(".worning-mensage");
						if (!worning) {
							if (mensage) {
								worning = document.createElement("DIV");
								worning.classList.add("worning-mensage");
								worning.innerHTML = "<span>" + mensage + "</span>";
								worning.setAttribute("title", mensage);
								t.parentElement.insertBefore(worning, t);
								t.parentElement.classList.add("worning-opacity");
							}
						}
					}
				)(this, ((this.tagName == "BUTTON" || this.tagName == "INPUT") ? (xn => {

					if (xn.closest(".page-droplist"))
						return xn.closest(".page-droplist").querySelector("input[type=hidden]").getAttribute("mensage-worning");
					return xn.getAttribute("mensage-worning");

				})(this) : this.getAttribute("mensage-worning")));
		},
		focusElemenNavegar: function (selector) {
			var selector = typeof selector == "object" ? selector : document.querySelector(selector);
			if (selector) {
				if (selector.type == "hidden") {
					selector = (sel => {
						return !sel ? selector : sel.querySelector(".page-input input");
					})(selector.closest(".page-droplist"));
				}
				document.querySelectorAll("form input:not([type=hidden]), form button")
					.forEach((ele, index) => {
						delete ele.focusElements;
						if (ele == selector) {

							(selector.closest("form") || selector)
								.parentElement.positionFocus = index;

							selector.focusElements = true;
							//window.scrollTo(0,selector.offsetTop-selector.offsetHeight);
							selector.focus();
							selector.click();
						}
					});
			}
		},
		navegar: function (doc) {
			var filds = doc.querySelectorAll("form input:not([type=hidden]), form button");
			filds.forEach((els) => {
				els.addEventListener("focus", function (e) {
					var tath = this;
					filds.forEach((ele, index) => {
						delete ele.focusElements;
						if (ele == tath) {
							doc.parentElement.positionFocus = index;
							tath.focusElements = true;
						}

					});
				});
			});
			doc.addEventListener("keydown", function (e) {
				if ([13, 9].indexOf(e.keyCode) > -1) {
					var a = parseInt((doc.parentElement.positionFocus || 0)),
						prevent = true;
					if (filds[a].focusElements) {
						if (filds[a].tagName.toLowerCase() == "button" && e.keyCode == 13) {
							prevent = false;
						} else {
							e.preventDefault();
						}
					}
					if (prevent) {
						for (; a < filds.length; a++) {
							if (filds[a].focusElements) {
								var cal = e.shiftKey && 9 ? a - 1 : a + 1;
								if (filds[cal]) {
									filds[cal].focusElements = true;
									outerVanilha(filds[cal]).focus();
									doc.parentElement.positionFocus = cal;
									delete filds[a].focusElements;
								}
								break;
							}
						}
					} else {
						if (!filds[a].initClick) {
							filds[a].click();
							filds[a].initClick = true;
						}

					}
				}
			});
		},
		dasbordChart: function (selector) {
			document.querySelectorAll(selector)
				.forEach(el => {

					var xls = "http://www.w3.org/2000/svg",
						svg = document.createElementNS(xls, "svg"),
						gParent = document.createElementNS(xls, "g"),
						text = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
						t,
						translateG = 0,
						rectX = 0,
						xText = 20,
						dias = 351,
						d = 0, g;
					for (var a = 1; a < dias; a++) {
						if (!d) {
							g = document.createElementNS(xls, "g");
							g.setAttribute("transform", "translate(" + translateG + ", 0)");
							translateG = translateG + 16;
							d = 1;
							a--;
						} else if (d == 8) {
							gParent.appendChild(g);
							d = 0;
							rectX = 0;
							a--;
						} else {
							var rect = document.createElementNS(xls, "rect");
							rect.setAttribute("width", "11");
							rect.setAttribute("height", "11");
							rect.setAttribute("x", "0");
							rect.setAttribute("y", rectX);
							rect.setAttribute("rx", "2");
							rect.setAttribute("ry", "2");
							rectX = rectX + 15;
							if (a == (dias - 1)) {
								g.appendChild(rect);
								gParent.appendChild(g);
							} else {
								g.appendChild(rect);
							}
							d++;
						}
					}

					gParent.setAttribute("transform", "translate(0, 20)");



					text.find((x, i) => {
						t = document.createElementNS(xls, "text");
						t.setAttribute("x", xText);
						t.setAttribute("y", "-8");
						t.innerHTML = x;
						xText = xText + (i == 0 ? 50 : 65);
						gParent.appendChild(t);
					});

					svg.appendChild(gParent);


					el.appendChild(svg);

				});
		}
	};

})(document);

// carregar funções apois a pagina ser carregada
window.onload = function () {
	(doc => {

		/** carregar resizes para o dom javascript */
		window.addEventListener("resizeDom", function () {
			(document.resize || []).find(function (resolve) {
				resolve();
			});
		});


		/** rotina do menu mobile */
		doc.querySelectorAll(".menu-mobiles button")
			.forEach(button => {
				button.addEventListener("click", function () {


					var t = this, name = this.getAttribute("name-event");

					if (document.querySelector(".list-lateral-focus")) {
						document.querySelector(".list-lateral")
							.classList.remove("list-lateral-focus");
					}

					/** estilizar o elemento com focus */
					t.classList.add("focus");
					t.closest(".menu-mobiles").querySelectorAll("button")
						.forEach(button => {
							if (t != button)
								button.classList.remove('focus');
						});

					if (name)
						return ((name, t) => {

							if (document.querySelector(".focusMensusmobile")) {
								document.querySelector(".cont-left").classList.remove('focusMensusmobile');
							} else {
								document.querySelector(".cont-left").classList.add('focusMensusmobile');
							}

						})(name, this);

					if (document.querySelector(".focusMensusmobile"))
						document.querySelector(".cont-left").classList.remove('focusMensusmobile');

				});
			});

		doc.querySelectorAll(".cont-left > ul > li")
			.forEach(li => {
				var parentNone = document.querySelector(".mobile-menu-info"),
					painel = document.createElement("div");
				painel.classList.add("mmo-painel");
				(li.dataLink || []).find(xres => {
					var siblings = document.createElement("div");
					siblings.innerHTML = [xres.label].join("");
					if (!xres.title)
						siblings.setAttribute("href", page.dir + xres.u);
					painel.append(siblings);
				});

				if (li.dataLink)
					parentNone.appendChild(painel);
				clickHancor(painel);
			});

		doc.querySelectorAll(".options-user")
			.forEach(function (ele) {
				ele.addEventListener("click", function () {
					return page.popup({
						type: "warning",
						style: "right:10px;width:200px;",
						html: [
							'<div class="row-lines"><span>',page.user().nome,'</span></div>',
							'<div class="row-lines">My Profile</div>',
							'<div class="row-lines">Notificações</div>',
							'<div class="row-lines">Configurações</div>',
							'<div class="row-lines">Ajuda</div>',
							'<div class="row-lines" id="logaut">Sair</div>'
						].join(""),
						footer: function () {
							var popup = this.popup;
							// evento para sair da aplicação
							popup.querySelector(".pop-center")
								.style = "padding:10px 0 !important;padding-bottom: 0 !important;";

							popup.querySelector(".pop-mask")
								.style = "background:transparent;";

							popup.querySelector(".pop-body")
								.classList.add("menus-lists");



							popup.querySelectorAll(".pop-top, .pop-footer")
								.forEach(ele => ele.style = "display:none;");


							popup.querySelector("#logaut")
								.addEventListener("click", function () {
									return page.logout();
								});
						}
					})
				});
			});

		var likFocus = doc.querySelectorAll(".focusMenus");
		likFocus.forEach((ele, index) => {
			ele.addEventListener("click", function () {
				var tah = this;
				likFocus.forEach(el => {
					if (tah != el) {
						el.classList.remove("focuss");
						el.classList.remove("focus");
						el.classList.remove("focus-per");
					}
				});
				tah.classList.add("focus");
				tah.classList.add("focus-per");
				tah.classList.remove("focuss");
				outerVanilha(".ofsetMenus").remove();
			});

			/** ignorar campos */
			return true;
			if (index == 0 || index == 4) return true;
			ele.addEventListener("mouseenter", function () {

				if (window.innerWidth < 900)
					return false;

				var tah = this;
				likFocus.forEach(el => {
					if (tah != el) {
						el.classList.remove("focus");
						el.classList.remove("focuss");
					}
				});
				tah.classList.add("focus");
				tah.classList.add("focuss");

				var doc = document,
					container = document.querySelector("body"),
					ofsetMenus = container.querySelector(".ofsetMenus"),
					mousedo = doc.querySelectorAll(".page-top, .cont-center, .cont-right"),
					mtc,
					refreshFunction = () => {
						if (!ofsetMenus)
							(() => {
								ofsetMenus = document.createElement("div");
								ofsetMenus.classList.add("ofsetMenus");
								container.appendChild(ofsetMenus);
							})();

						ofsetMenus.innerHTML = '<div class="offcenter"></div>';
						mtc = (outerVanilha(tah).offset().top - 20);
						ofsetMenus.style.top = mtc + "px";
					},
					mouseenter = () => {
						likFocus.forEach(el => {
							el.classList.remove("focus");
							el.classList.remove("focuss");
						});
						doc.querySelector(".focus-per").classList.add("focus");
						outerVanilha(this).unbind("mouseenter");
						if (ofsetMenus)
							ofsetMenus.remove();
					};

				mousedo.forEach(x => {
					outerVanilha(x).unbind("mouseenter");
					outerVanilha(x).bind("mouseenter", mouseenter);
				});


				refreshFunction();
				if (outerVanilha(ofsetMenus).offset().top > outerVanilha(".focus").offset().top) {
					ofsetMenus.remove();
					ofsetMenus = null;
					refreshFunction();
				}

				page.Link(tah.dataLink, ofsetMenus.querySelector(".offcenter"));
				return clickHancor(ofsetMenus);
			});


		});

		clickHancor(document);
	})(document);

};

/**
 * resize dom javascript
 */
(function () {
	var throttle = function (type, name, obj) {
		obj = obj || window;
		var running = false;
		var func = function () {
			if (running) { return; }
			running = true;
			requestAnimationFrame(function () {
				obj.dispatchEvent(new CustomEvent(name));
				running = false;
			});
		};
		obj.addEventListener(type, func);
	};

	/* init - you can init any event */
	throttle("resize", "resizeDom");
})();